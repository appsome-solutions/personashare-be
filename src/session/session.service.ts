import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoService } from '../mongo-service/mongo.service';
import {
  SessionDocument,
  SessionInterface,
} from './interfaces/session.interfaces';
import { SessionType } from './dto/session.dto';

@Injectable()
export class SessionService {
  mongoService: MongoService<Model<SessionDocument>>;

  constructor(
    @InjectModel('Session')
    private readonly sessionModel: Model<SessionDocument>,
  ) {
    this.mongoService = new MongoService(this.sessionModel);
  }

  async createSession(session: SessionInterface): Promise<SessionDocument> {
    return await this.mongoService.create<SessionInterface, SessionDocument>(
      session,
    );
  }

  async getSession(
    condition: Partial<SessionInterface>,
  ): Promise<SessionType[]> {
    return await this.mongoService.findByMatch<
      Partial<SessionInterface>,
      SessionType
    >(condition);
  }

  async updateSession(session: SessionInterface): Promise<SessionDocument> {
    const { uid, sid } = session;
    return await this.mongoService.update<
      Partial<SessionInterface>,
      SessionDocument
    >({ sid }, { uid });
  }

  async deleteSession(condition: Partial<SessionInterface>): Promise<number> {
    return await this.mongoService.remove<Partial<SessionInterface>>(condition);
  }
}
