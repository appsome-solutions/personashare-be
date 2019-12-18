import { Schema } from 'mongoose';

export const SessionSchema = new Schema({
  sid: String,
  uid: String,
});
