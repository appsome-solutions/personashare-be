import { Injectable } from '@nestjs/common';
import { connect, INgrokOptions } from 'ngrok';

@Injectable()
export class NgrokService {
  async connect(options?: INgrokOptions): Promise<string> {
    return await connect(options);
  }
}
