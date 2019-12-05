import { CookieOptions } from 'express';

export interface CreateSessionResponse {
  sessionCookie: string;
  sessionOptions: CookieOptions;
}
