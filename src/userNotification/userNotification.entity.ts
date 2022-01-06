import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { BaseEntity } from '../base/base.entity';

@Entity('UserNotification')
export class UserNotification extends BaseEntity {
     @Column()
     text: string;

     @Column()
     type: string;

     @Column({ nullable: true, default: null })
     entityId: string;

     @Column()
     userId: string;

     @ManyToOne((type) => User, { eager: true })
     @JoinColumn()
     user?: User;

     @Column()
     wasRead: boolean;
}
