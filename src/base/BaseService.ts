import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export default class BaseService<T> {
  private repo: Repository<T>

  constructor(repo: Repository<T>) {
    this.repo = repo
  }

  create(item: T) {
    return this.repo.save(item)
  }

  update(item: T) {
    return this.repo.save(item)
  }

  delete(item: T) {
    return this.repo.delete(item)
  }
}
