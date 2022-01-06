import { Client as GMapsClient, GeocodingAddressComponentType } from '@googlemaps/google-maps-services-js'
import {
  AddressComponent,
  AddressType,
  GeocodeRequest,
  GeocodeResponse,
  GeocodeResult,
  LatLngLiteral,
  ReverseGeocodeRequest,
} from '@googlemaps/google-maps-services-js/dist'
import { Injectable, Logger } from '@nestjs/common'
import { add } from 'winston'
import { Location } from './location.entity'

const G_MAPS_API_KEY = 'AIzaSyCXE-xMBZPmhOxt0BPbzAf20y9zG3J9n4A'
@Injectable()
export class LocationService {
  private log: Logger = new Logger('LocationService')
  private gMaps = new GMapsClient()

  async getLatLng(location: Location): Promise<LatLngLiteral> {
    this.log.debug(`Calling GMaps API`)
    const { addressOne, addressTwo, city, zipCode, state } = location
    const address = `${addressOne}, ${addressTwo ? addressTwo + ' ' : ''}${city} ${state} ${zipCode}`
    const request: GeocodeRequest = {
      params: { address, key: G_MAPS_API_KEY }
    }

    try {
      if (state !== 'CA'){
        return null
      }
      const response: GeocodeResponse = await this.gMaps.geocode(request)
      if (!response.data.results || !response.data.results.length) {
        this.log.error(`Failed to find address: ${address}`)
        return null
      }

      const result: GeocodeResult = response.data.results[0]
      let i
      for(i = 0; i < result.address_components.length; i ++) {
        if(result.address_components[i].types.includes(AddressType.postal_code) === true)
          break
      }
      if(i === result.address_components.length) {
        return null
      }
      console.log(result.address_components[i])
      console.log(zipCode)
      if(result.address_components[i].short_name !== zipCode) {
        return null
      }
      return result.geometry.location
    } catch (error) {
      console.log(error)
      this.log.error(`API failed to find address: ${address}`)
    }
  }

  async getAddressFromLatLng(latLng: LatLngLiteral) {
    const { lat, lng } = latLng
    this.log.debug(`[getAddressFromLatLng] lat: ${lat}, lng: ${lng}`)
    const request: ReverseGeocodeRequest = {
      params: { latlng: latLng, key: G_MAPS_API_KEY }
    }

    try {
      const response: GeocodeResponse = await this.gMaps.reverseGeocode(request)
      if (!response.data.results || !response.data.results.length) {
        this.log.error(`Failed to find lat: ${lat}, lng: ${lng}`)
        return null
      }

      // most likely candidate
      const result: GeocodeResult = response.data.results[0]

      const getValueByType = (type: AddressType | GeocodingAddressComponentType) => {
        const addressComp: AddressComponent = result.address_components.find(item => item.types.includes(type))
        return addressComp ? addressComp.short_name : null
      }

      const address: Location = {
        addressOne: `${getValueByType(GeocodingAddressComponentType.street_number)} ${getValueByType(AddressType.route)}`,
        addressTwo: null,
        city: getValueByType(AddressType.locality),
        state: getValueByType(AddressType.administrative_area_level_1),
        zipCode: getValueByType(AddressType.postal_code),
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      }

      return address
    } catch (error) {
      this.log.error(`API failed to find lat: ${lat}, lng: ${lng}`)
      throw new Error('Address not found.')
    }
  }
}
