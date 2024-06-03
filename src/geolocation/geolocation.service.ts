import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeolocationService {
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org/search';
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}
  async findOrCreateGeolocation(
    address: string,
    email: string,
  ): Promise<{ latitude: number; longitude: number }> {
    let geolocation = await this.prisma.address.findUnique({
      where: { address },
    });

    if (!geolocation) {
      try {
        const response = await axios.get(this.nominatimUrl, {
          params: {
            q: address,
            format: 'json',
          },
          headers: {
            'User-Agent': 'YourAppName/1.0 (http://example.com)',
          },
        });

        if (response.data.length > 0) {
          const firstResult = response.data[0];
          const latitude = parseFloat(firstResult.lat);
          const longitude = parseFloat(firstResult.lon);
          geolocation = await this.prisma.address.create({
            data: { address, latitude, longitude },
          });
          if (email) {
            await this.mailService.sendGeolocationEmail(
              email,
              address,
              latitude,
              longitude,
            );
          }
          return {
            latitude: latitude,
            longitude: longitude,
          };
        } else {
          throw new NotFoundException(
            'Geolocation data not found for the given address',
          );
        }
      } catch (error) {
        throw new BadRequestException(error);
      }
    } else {
      if (email) {
        try {
          await this.mailService.sendGeolocationEmail(
            email,
            address,
            geolocation.latitude,
            geolocation.longitude,
          );
        } catch (error) {
          // throw new BadRequestException(error);
          console.log(error);
        }
      }
      return {
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
      };
    }
  }
}
