import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseLatLngPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    let parsedValue = { ...value }
    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string') {
        parsedValue = { ...parsedValue, [key]: JSON.parse(value[key]) }
      }
    }
    return parsedValue;
  }
}
