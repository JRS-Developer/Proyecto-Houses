import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'houses',
})
export class House {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  salePrice!: number;

  @Column({ nullable: true })
  houseStyle!: string;

  @Column({ nullable: true })
  firePlaces!: number;

  @Column({ nullable: true })
  garageCars!: number;

  @Column({ nullable: true })
  garageCond!: string;

  @Column({ nullable: true })
  yearBuilt!: number;

  @ManyToOne(() => User, (u) => u.houses, {
    onDelete: 'SET NULL',
  })
  user!: User | null;
}
