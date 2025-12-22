import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  taskId!: number;

  @Column({
    length: 255,
  })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  isCompleted!: boolean;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
  user!: User;
}
