import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { BaseEntity } from '../base/base.entity';

@Entity('bankDetail')
export class BankDetail extends BaseEntity {
     @Column()
     name: string;

     @Column()
     bankName: string;

     @Column()
     routingNumber: string;

     @Column()
     accountNumber: string;

     @Column({ default: null, nullable: true })
     bankToken?: string;

     @Column({ default: null, nullable: true })
     bankAccountToken?: string;

     @Column()
     userId: string;

     @ManyToOne((type) => User, { eager: true })
     @JoinColumn()
     user?: User;
}
