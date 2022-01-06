import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @CreateDateColumn()
  public createdAt?: Date | string

  @UpdateDateColumn()
  public updatedAt?: Date
}
