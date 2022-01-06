import * as bcrypt from 'bcrypt'
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { User } from './user.entity'

@EventSubscriber()
export class UserEventSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User
  }

  async beforeInsert(event: InsertEvent<User>): Promise<any> {
    if(event.entity.password){
      event.entity.password = await bcrypt.hash(event.entity.password, 10)
      return event
    }
  }
}
