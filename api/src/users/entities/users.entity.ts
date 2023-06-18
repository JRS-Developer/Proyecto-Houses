import { House } from 'src/houses/entities/houses.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @OneToMany(() => House, (h) => h.user, {
    onDelete: 'CASCADE',
  })
  houses!: House[];
}
