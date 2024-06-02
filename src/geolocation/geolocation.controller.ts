import { Body, Controller, Post } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
@Controller('geolocation')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}
  @Post('/find')
  async getGeolocation(
    @Body('address') address: string,
    @Body('email') email: string,
  ) {
    const geolocation = await this.geolocationService.findOrCreateGeolocation(
      address,
      email,
    );
    return geolocation;
  }
}
