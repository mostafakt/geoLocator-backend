import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeolocationModule } from './geolocation/geolocation.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [GeolocationModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
