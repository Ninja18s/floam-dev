import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity({ name: 'unserviceableLocation' })
export class UnserviceableLocation extends BaseEntity {
     @Column({ nullable: true })
     state: string;

     @Column({ nullable: true })
     city: string;

     @Column({ nullable: true })
     zipCode: string;

     @Column({ default: null, type: 'float' })
     lat?: number;

     @Column({ default: null, type: 'float' })
     lng?: number;
}
