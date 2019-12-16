import { Document, Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MongoService<M extends Model<any>> {
  constructor(private readonly model: M) {}

  async create<I, D extends Document>(input: I): Promise<D> {
    const newDoc = new this.model(input);

    return await newDoc.save();
  }

  async update<I, D extends Document>(input: I, uuid: string): Promise<D> {
    const updatedDocument = await this.model.findOneAndUpdate({ uuid }, input);

    if (!updatedDocument) {
      throw new NotFoundException(
        `Cant find document with given uuid: ${uuid}`,
      );
    }

    return updatedDocument;
  }

  async remove<C>(condition: C): Promise<number> {
    const { deletedCount } = await this.model.deleteMany(condition);

    return deletedCount || 0;
  }

  async findByMatch<C, R>(condition: C): Promise<R[]> {
    const docs = await this.model.find(condition).exec();

    return !docs || docs.length < 1 ? [] : docs;
  }

  async findAll<R>(): Promise<R[]> {
    return await this.model.find().exec();
  }
}
