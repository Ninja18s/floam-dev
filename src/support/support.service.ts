import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/user.entity'
import { supportDto } from './support.dto'
import { Support } from './support.entity'

@Injectable()
export class supportService {
  private log: Logger = new Logger('supportService')

  constructor(
    @InjectRepository(Support)
    private readonly supportRepo: Repository<Support>,
  ) { }

  createSupport(dto: supportDto) {
    const { text, type, userId } = dto
    const support: Support = { text, type, userId }
    return this.supportRepo.save(support)
  }

  getAll() {
    return this.supportRepo.find()
  }

}