import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,

} from 'typeorm';

import { Task } from './Task';
import bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  use_id!: number

  @Column()
  userName!: string

  @Column({ unique: true })
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



  @BeforeInsert()
  async hasPassword() {
    {
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    }
  }
  @BeforeUpdate()
  async hasPasswordOnUpdate() {
    const existingUser = await User.findOneBy({ use_id: this.use_id });
    if (existingUser && this.password !== existingUser.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

