import { LatLngLiteral } from '@googlemaps/google-maps-services-js/dist'
import axios, { AxiosResponse } from 'axios'

interface LocData {
  city: string
  zip: string
  dst: number
  geopoint: { lat: number, lon: number }
  longitude: number
  state: string
  latitude: number
  timezone: number
}

export const atlanta: LatLngLiteral = { lat: 33.748997, lng: -84.387985 }
export const sandySprings: LatLngLiteral = { lat: 33.930435, lng: -84.373314 }
export const decatur: LatLngLiteral = { lat: 33.773560, lng: -84.296562 }
export const lakeCity: LatLngLiteral = { lat: 30.188650, lng: -82.637154 }
export const losAngeles: LatLngLiteral = { lat: 34.039, lng: -118.265 }
export const cities = [ atlanta, sandySprings, decatur, lakeCity, losAngeles ]

function deg2rad(degrees) {
  return degrees * (Math.PI/180)
}

function rad2deg(radians) {
  return radians * (180/ Math.PI);
}

export function isWithinRange(
  { lat: lat1, lng: long1 }: LatLngLiteral, // origin
  { lat: lat2, lng: long2 }: LatLngLiteral, // destination
  range: number
) {
  const theta = long1 - long2
  let miles = (Math.sin(deg2rad(lat1))) * Math.sin(deg2rad(lat2)) +
    (Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta)))
  miles = Math.acos(miles)
  miles = rad2deg(miles)
  const resultInMiles = miles * 60 * 1.1515
  // console.log(`resultInMiles: ${resultInMiles}`)

  return resultInMiles <= range
}

export async function zipToLatLng(zipCode: number): Promise<LatLngLiteral> {
  const url = 'https://public.opendatasoft.com/api/v2/catalog/datasets/us-zip-code-latitude-and-longitude/exports/json'
  const params = { search: zipCode, timezone: 'UTC' }
  try {
    const res: AxiosResponse<LocData[]> = await axios.get(url, { params })
    // expecting one result
    const data = res.data[0]
    return { lat: data.latitude, lng: data.longitude }
  } catch (error) {
    console.error(error)
    return losAngeles
  }
}
