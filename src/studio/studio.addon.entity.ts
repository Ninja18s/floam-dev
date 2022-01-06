import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { Studio } from './studio.entity';

export enum ADD_ON_PRICE_OPTION {
     INCLUDED = 'INCLUDED',
     PER_HOUR = 'PER_HOUR',
     FLAT_FEE = 'FLAT_FEE',
}

@Entity({ name: 'studio_addons' })
export class StudioAddOn extends BaseEntity {
     @Column()
     name: string;

     @Column()
     description: string;

     @Column({ nullable: true, default: null })
     price: number | null;

     @Column({ default: ADD_ON_PRICE_OPTION.INCLUDED })
     priceOption?: ADD_ON_PRICE_OPTION;

     @Column({ nullable: true })
     studioId: string;
     @ManyToOne((type) => Studio)
     @JoinColumn()
     studio?: Studio;
}
