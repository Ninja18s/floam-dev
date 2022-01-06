import { BaseEntity } from '../base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Studio } from '../studio/studio.entity';
import { User } from '../users/user.entity';

export enum IMAGE_TYPE {
     PROFILE = 'profile_pic',
     STUDIO = 'studio_pic',
     GID = 'government_id',
     DOCLINK = 'doc_link',
}

@Entity('image')
export class Image extends BaseEntity {
     @Column('text')
     src: string;

     @Column({ nullable: true })
     type: IMAGE_TYPE;

     @Column({ nullable: true })
     studioId?: string;

     @ManyToOne((type1) => Studio, { nullable: true })
     @JoinColumn({ name: 'studio_id' })
     studio?: Studio | null;

     @Column({ nullable: true })
     userId?: string;

     @ManyToOne((type1) => User, { nullable: true })
     @JoinColumn({ name: 'user_id' })
     user?: User | null;
}
