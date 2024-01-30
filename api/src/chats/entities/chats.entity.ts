import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  creator!: User;

  @Column()
  creatorId!: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  receiver!: User;

  @Column()
  receiverId!: number;

  @OneToMany(() => ChatMessage, (m) => m.chat)
  messages!: ChatMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  lastMessage!: ChatMessage | null;
}

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  sender!: User;

  @Column()
  senderId!: number;

  @Column()
  message!: string;

  @Column({
    default: false,
  })
  read!: boolean;

  @ManyToOne(() => Chat, (c) => c.messages)
  chat!: Chat;

  @CreateDateColumn()
  createdAt!: Date;
}
