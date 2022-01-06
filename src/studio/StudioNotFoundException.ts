import { HttpException, HttpStatus } from '@nestjs/common'

export class StudioNotFoundException extends HttpException {
  constructor() {
    super('Studio not found.', HttpStatus.NOT_FOUND)
  }
}
