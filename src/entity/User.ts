import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,

} from 'typeorm';

import { Task } from './Task';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  use_id!: number

  @Column()
  userName!: string

  @Column()
  email!: string

  @Column({
    length: 255,
  })
  password!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn() updatedAt!: Date

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[]
}