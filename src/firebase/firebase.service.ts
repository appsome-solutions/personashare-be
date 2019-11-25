import { Injectable } from '@nestjs/common';
import { initializeApp, app, auth } from 'firebase';
import { ConfigService } from '../config';

@Injectable()
export class FirebaseService {
  private firebase: app.App;

  constructor(private readonly configService: ConfigService) {
    const {
      FirebaseAppId,
      FirebaseAuthDomain,
      FirebaseDbUrl,
      FirebaseProjectId,
      FirebaseStorageBucket,
      FirebaseMessagingSenderId,
      FirebaseAPIKey,
    } = this.configService;
    this.firebase = initializeApp({
      apiKey: FirebaseAPIKey,
      appId: FirebaseAppId,
      authDomain: FirebaseAuthDomain,
      databaseURL: FirebaseDbUrl,
      projectId: FirebaseProjectId,
      storageBucket: FirebaseStorageBucket,
      messagingSenderId: FirebaseMessagingSenderId,
    });
  }

  async signInWithGoogle(idToken: string): Promise<auth.UserCredential> {
    const credential = auth.GoogleAuthProvider.credential(idToken);

    return await this.firebase.auth().signInWithCredential(credential);
  }
}
