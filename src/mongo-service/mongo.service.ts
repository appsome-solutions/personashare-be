import { Document, Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

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
    const updatedDocument = await this.model.findOneAndUpdate(
      conditions,
      input,
      {
        new: true,
      },
    );

    if (!updatedDocument) {
      throw new NotFoundException(`Cant find ${this.model.modelName}`);
    }

    return updatedDocument;
  }

  async remove<C>(condition: C): Promise<number> {
    const { deletedCount } = await this.model.deleteMany(condition);

    return deletedCount || 0;
  }

  async findByMatch<C extends Record<string, any>, R>(
    condition: C,
  ): Promise<R> {
    const doc = await this.model.findOne(condition).exec();

    if (!doc) {
      throw new NotFoundException(`Cant find ${this.model.modelName}`);
    }

    return doc;
  }

  async findAll<R>(): Promise<R[]> {
    return await this.model.find().exec();
  }
}
