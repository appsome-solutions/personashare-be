import { Document } from 'mongoose';

interface SessionInterface {
  sid: string;
  readonly uid: string;
}

interface SessionDocument extends SessionInterface, Document {}

export { SessionInterface, SessionDocument };
