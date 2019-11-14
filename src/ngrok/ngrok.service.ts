import { Injectable } from '@nestjs/common';
import { connect, INgrokOptions, disconnect, kill } from 'ngrok';

@Injectable()
export class NgrokService {
  async connect(options?: INgrokOptions): Promise<string> {
    return await connect(options);
  }

  async disconnect(): Promise<void> {
    await disconnect();
    await kill();
  }
}
