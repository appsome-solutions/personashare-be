import * as functions from 'firebase-functions';
import difference from 'lodash/difference';
import { MongoClient } from 'mongodb';

const uri =
  'mongodb+srv://opiniaspec:opiniaspec2019@cluster0-61nud.mongodb.net/personashare?retryWrites=true&w=majority';

let client: MongoClient;

exports.scheduledFunction = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async _context => {
    if (client && client.isConnected()) {
      console.log('DB CLIENT ALREADY CONNECTED');
    } else
      try {
        client = await MongoClient.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('DB CLIENT RECONNECTED');
      } catch (e) {
        throw e;
      }

    const db = await client.db('personashare');
    const now = Math.floor(Date.now() / 1000);
    const recommendationsToRemove = await db
      .collection('recommendations')
      .find({
        active: true,
        recommendedTill: {
          $lt: now,
        },
      });

    let personaRecommendationToRemove: Record<string, string[]> = {};
    let spotRecommendationToRemove: Record<string, string[]> = {};

    const personasBulk = await db
      .collection('personas')
      .initializeUnorderedBulkOp();
    const spotBulk = await db.collection('spots').initializeUnorderedBulkOp();

    await recommendationsToRemove.forEach(recommendation => {
      if (recommendation.destinationKind == 'persona') {
        if (personaRecommendationToRemove[recommendation.source]) {
          personaRecommendationToRemove = {
            ...personaRecommendationToRemove,
            [recommendation.source]: personaRecommendationToRemove[
              recommendation.source
            ].concat([recommendation.destination]),
          };
        } else {
          personaRecommendationToRemove = {
            ...personaRecommendationToRemove,
            [recommendation.source]: [recommendation.destination],
          };
        }
      } else {
        if (spotRecommendationToRemove[recommendation.source]) {
          spotRecommendationToRemove = {
            ...spotRecommendationToRemove,
            [recommendation.source]: spotRecommendationToRemove[
              recommendation.source
            ].concat([recommendation.destination]),
          };
        } else {
          spotRecommendationToRemove = {
            ...spotRecommendationToRemove,
            [recommendation.source]: [recommendation.destination],
          };
        }
      }
    });

    // handling persona recommendations
    if (Object.keys(personaRecommendationToRemove).length) {
      const personasToPersonas = await db.collection('personas').find({
        uuid: {
          $in: Object.keys(personaRecommendationToRemove),
        },
      });

      await personasToPersonas.forEach(persona => {
        // need to remove ids from recommendList and networkList
        const recommendationToFilter =
          personaRecommendationToRemove[persona.uuid];

        if (recommendationToFilter) {
          const newRecommendList = difference(
            persona.recommendList,
            recommendationToFilter,
          );

          // remove recommended persona from recommendList of the given persona
          personasBulk
            .find({
              uuid: persona.uuid,
            })
            .update({
              $set: {
                recommendList: newRecommendList,
              },
            });

          // remove given persona from recommended persona networkList
          recommendationToFilter.forEach(uuid => {
            personasBulk
              .find({
                uuid,
              })
              .update({
                $pull: {
                  networkList: persona.uuid,
                },
              });
          });
        }
      });
    }

    // handling spot recommendations
    if (Object.keys(spotRecommendationToRemove).length) {
      const personasToSpots = await db.collection('personas').find({
        uuid: {
          $in: Object.keys(spotRecommendationToRemove),
        },
      });

      await personasToSpots.forEach(persona => {
        // need to remove ids from spotRecommendList and networkList of the spot

        const recommendationToFilter = spotRecommendationToRemove[persona.uuid];

        if (recommendationToFilter) {
          const newSpotRecommendList = difference(
            persona.spotRecommendList,
            recommendationToFilter,
          );

          // remove recommended persona from spotRecommendList of the given persona
          personasBulk
            .find({
              uuid: persona.uuid,
            })
            .update({
              $set: {
                spotRecommendList: newSpotRecommendList,
              },
            });

          // remove given persona from recommended spot networkList
          recommendationToFilter.forEach(uuid => {
            spotBulk
              .find({
                uuid,
              })
              .update({
                $pull: {
                  networkList: persona.uuid,
                },
              });
          });
        }
      });
    }

    try {
      Promise.all([personasBulk.execute(), spotBulk.execute()]).then(() => {
        db.collection('recommendations').updateMany(
          {
            recommendedTill: {
              $lt: now,
            },
          },
          {
            $set: {
              active: false,
            },
          },
        );
      });
    } catch (e) {}

    return null;
  });
