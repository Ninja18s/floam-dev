import { BaseEntity } from '../base/base.entity';
import { Column, Entity, ManyToMany, JoinColumn } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';
import { User } from '../users/user.entity';

@Entity('paymentHistory')
export class PaymentHistory extends BaseEntity {
     @Column()
     userId: string;

     @ManyToMany((type) => User)
     user?: User;

     @Column({ default: 0, type: 'float' })
     amount: number;

     @Column({ default: null })
     status: string;

     @Column()
     text: string;

     @Column({ nullable: true })
     transactionId: string;

     @Column({ nullable: true })
     appointmentId: string;

     @ManyToMany((type) => Appointment)
     @JoinColumn()
     appointment?: Appointment;
}
