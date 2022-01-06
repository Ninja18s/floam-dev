import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm/index'

@Injectable()
export class BaseRepository<T> extends Repository<T> {
  createOrUpdateStudio(item: T) {
    return this.save(item)
  }
}
