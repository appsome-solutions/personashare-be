export interface QRCodeResponse {
  qrCode: string;
}

export interface GetLoginPageResponse {
  loginSuccessUrl: string;
  postLoginSuccessUrl: string;
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface GetProfilePageResponse {
  name?: string;
  picture?: string;
  email?: string;
  emailVerified?: boolean;
}
