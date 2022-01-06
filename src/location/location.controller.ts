import { LatLngLiteral } from '@googlemaps/google-maps-services-js'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { Location } from './location.entity'
import { ParseLatLngPipe } from './location.pipes'
import { LocationService } from './location.service'

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
  ) {}

  @Post('validate')
  validateAddress(@Body() location: Location) {
    return this.locationService.getLatLng(location)
  }

  @Get('get-address')
  getAddress(@Query(ParseLatLngPipe) latLng: LatLngLiteral) {
    return this.locationService.getAddressFromLatLng(latLng)
  }
}
