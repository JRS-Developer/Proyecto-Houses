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
  image!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  salePrice!: number;

  @Column({ nullable: true })
  houseStyle!: string;

  @Column({ nullable: true })
  firePlaces!: number;

  @Column({ nullable: true })
  fireplaceQu!: string;

  @Column({ nullable: true })
  garageYrBlt!: number;
  @Column({ nullable: true })
  garageCars!: number;
  @Column({ nullable: true })
  garageArea!: number;
  @Column({ nullable: true })
  garageCond!: string;
  @Column({ nullable: true })
  garageType!: string;
  @Column({ nullable: true })
  garageFinish!: string;
  @Column({ nullable: true })
  garageQual!: string;

  @Column({ nullable: true })
  poolArea!: number;
  @Column({ nullable: true })
  poolQC!: string;

  @Column({ nullable: true })
  kitchenQual!: string;
  @Column({ nullable: true })
  kitchenAbvGr!: number;

  @Column({ nullable: true })
  bedRoomAbvGr!: number;

  @Column({ nullable: true })
  fullBath!: number;

  @Column({ nullable: true })
  utilities!: string;

  @Column({ nullable: true })
  lotArea!: number;

  @Column({ nullable: true })
  yearBuilt!: number;

  @ManyToOne(() => User, (u) => u.houses, {
    onDelete: 'SET NULL',
  })
  user!: User | null;

  @Column({ nullable: true })
  userId?: number;
}
