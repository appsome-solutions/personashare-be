import { Injectable } from '@nestjs/common';
import { initializeApp, app, credential, auth } from 'firebase-admin';
import { ConfigService } from '../config';

@Injectable()
export class FirebaseService {
  firebase: app.App;

  constructor(private readonly configService: ConfigService) {
    const { FirebaseCredentialPath } = this.configService;

    this.firebase = initializeApp({
      credential: credential.cert(FirebaseCredentialPath),
    });
  }

  async getUser(uid: string): Promise<auth.UserRecord> {
    return await this.firebase.auth().getUser(uid);
  }

  async checkSession(sid: string): Promise<auth.DecodedIdToken> {
    return await this.firebase.auth().verifySessionCookie(sid, true);
  }

  async removeUser(uid: string): Promise<void> {
    return await this.firebase.auth().deleteUser(uid);
  }

  async getDecodedClaim(idToken: string): Promise<auth.DecodedIdToken> {
    return await this.firebase.auth().verifyIdToken(idToken);
  }

  async revokeRefreshTokens(uid: string): Promise<void> {
    await this.firebase.auth().revokeRefreshTokens(uid);
  }
}
