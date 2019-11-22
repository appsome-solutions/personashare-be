export interface QRCodeResponse {
  qrCode: string;
}

export interface GetLoginPageResponse {
  loginSuccessUrl: string;
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
