import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Design } from '../../designs/entities/design.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  @Exclude()
  verificationToken: string;

  @OneToMany(() => Design, (design) => design.user)
  designs: Design[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
