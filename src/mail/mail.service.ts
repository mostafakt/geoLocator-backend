import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendGeolocationEmail(
    to: string,
    address: string,
    latitude: number,
    longitude: number,
  ) {
    await this.mailerService.sendMail({
      to,
      subject: 'Geolocation Results',
      //   template: './geolocation',
      html: `<h1>Geolocation Results</h1>
      <p>The geolocation for ${address} is:</p>
      <ul>
        <li>Latitude: ${latitude}</li>
        <li>Longitude: ${longitude}</li>
      </ul>`,
      context: {
        address,
        latitude,
        longitude,
      },
    });
  }
}
