import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('designs')
export class Design {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  @Column({ type: 'jsonb', default: '{}' })
  canvasData: object;

  @Column({ default: 800 })
  width: number;

  @Column({ default: 600 })
  height: number;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.designs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
