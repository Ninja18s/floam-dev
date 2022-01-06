import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { BaseEntity } from '../base/base.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Json } from 'aws-sdk/clients/robomaker';

export enum PAYOUT_STATUSES {
     REQUESTED = 'requested',
     APPROVED = 'approved',
     REJECTED = 'rejected',
}

@Entity('payout')
export class Payout extends BaseEntity {
     @Column({ default: 0, type: 'float' })
     totalAmount: number;

     @Column({ default: 0, type: 'float' })
     floamAmount: number;

     @Column({ default: 0, type: 'float' })
     studioUserAmount: number;

     @Column()
     userId: string;

     @Column()
     responseData: Json;

     @Column({ default: PAYOUT_STATUSES.REQUESTED })
     status: PAYOUT_STATUSES;

     @ManyToOne((type) => User, { eager: true })
     @JoinColumn()
     user?: User;

     @Column()
     appointmentId: string;

     @ManyToOne((type) => Appointment, { eager: true })
     @JoinColumn()
     appointment?: Appointment;

     @Column({ default: null, nullable: true })
     stripeUserPayoutId?: string;

     amountSend: boolean;
}
