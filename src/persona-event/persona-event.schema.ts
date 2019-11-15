import { Schema } from 'mongoose';

export const PersonaEventSchema = new Schema({
  uuid: String,
  name: String,
  description: String,
  logo: String,
  image: String,
  url: String,
  details: {
    type: Map,
    of: String,
  },
  speakers: [Schema.Types.ObjectId],
  personas: [Schema.Types.ObjectId],
});
