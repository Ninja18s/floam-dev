import { BaseEntity } from '../base/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Location } from '../location/location.entity';

export enum USER_STATUS {
     ACTIVE = 'ACTIVE',
     REGISTRATION = 'REGISTRATION',
}

@Entity('user')
export class User extends BaseEntity {
     @Column({ default: null, nullable: true })
     password: string;

     @Column({ length: 200, default: null, nullable: true })
     firstName: string;

     @Column({ length: 200, default: null, nullable: true })
     lastName: string;

     // todo: make this a unique column
     @Column({ length: 100, nullable: true })
     email: string;

     @Column({ default: null, nullable: true })
     docLink: string;

     @Column({ default: null, nullable: true })
     phone?: string;

     @Column({ default: null, nullable: true })
     dateOfBirth?: string;

     @Column({ default: null, nullable: true })
     gender?: string;

     @Column({ default: null, nullable: true })
     ethnicity?: string;

     @Column({ default: null, nullable: true })
     bio?: string;

     @OneToOne((type) => Location, {
          cascade: true,
          eager: true,
          nullable: true,
     })
     @JoinColumn()
     location?: Location | null;

     @Column({ default: null })
     pushToken?: string;

     @Column({ default: null })
     artistName?: string;

     @Column({ default: null })
     status?: USER_STATUS | null;

     @Column({ default: null, nullable: true })
     facebookId?: string;

     @Column({ default: null, nullable: true })
     googleId?: string;

     @Column({ default: null, nullable: true })
     appleId?: string;

     @Column({ default: null, nullable: true })
     customerId?: string;

     @Column({ default: 'email', nullable: false })
     loginType?: string;

     isNewUser: boolean;
}
