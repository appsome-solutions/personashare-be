import { Injectable } from '@nestjs/common';
import { initializeApp, app, credential, auth } from 'firebase-admin';
import { ConfigService } from '../config';
import { GQLContext } from '../app.interfaces';

@Injectable()
export class FirebaseService {
  firebase: app.App;

  constructor(private readonly configService: ConfigService) {
    const { FirebaseCredentialPath } = this.configService;
    let appCredential: credential.Credential;

    try {
      appCredential = credential.cert(FirebaseCredentialPath);
    } catch (_e) {
      appCredential = credential.cert(JSON.parse(FirebaseCredentialPath));
    }

    this.firebase = initializeApp({
      credential: appCredential,
    });
  }

  async checkSession(sid: string): Promise<auth.DecodedIdToken> {
    return await this.firebase.auth().verifySessionCookie(sid, true);
  }

  async getClaimFromToken(context: GQLContext): Promise<auth.DecodedIdToken> {
    const token = context.req.headers.authorization
      .replace('Bearer', '')
      .trim();

    return await this.checkSession(token);
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
