import { Document, Model } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MongoService<M extends Model<any>> {
  constructor(private readonly model: M) {}

  async create<I, D extends Document>(input: I): Promise<D> {
    const newDoc = new this.model(input);

    return await newDoc.save();
  }

  async update<I, D extends Document>(
    input: I,
    conditions: object,
  ): Promise<D> {
    return this.model.findOneAndUpdate(conditions, input, {
      new: true,
    });
  }

  async remove<C>(condition: C): Promise<number> {
    const { deletedCount } = await this.model.deleteMany(condition);

    return deletedCount || 0;
  }

  async findByMatch<C extends Record<string, any>, R>(
    condition: C,
    selectedFields?: Array<keyof R>,
  ): Promise<R> {
    let query = this.model.findOne(condition);

    if (selectedFields) {
      const selectCondition = selectedFields.reduce(
        (acc, field) => ({
          ...acc,
          [field]: 1,
        }),
        {},
      );
      query = query.select(selectCondition);
    }

    return await query.exec();
  }

  async findAll<R>(): Promise<R[]> {
    return await this.model.find().exec();
  }

  getModel() {
    return this.model;
  }
}
