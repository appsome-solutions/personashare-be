import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleResolver } from './example.resolver';
import { QrCodeModule } from '../qrcode';

@Module({
  providers: [ExampleService, ExampleResolver],
  imports: [QrCodeModule],
})
export class ExampleModule {}
