import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { BaseEntity } from '../base/base.entity';

@Entity('userBankDetail')
export class UserBankDetail extends BaseEntity {
    @Column()
    name: string;

    @Column()
    accountNumber: string;

    @Column()
    routingNumber: string;

    @Column()
    bankName: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    userId: string;


}