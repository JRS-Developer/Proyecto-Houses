import { House } from '../entities/houses.entity';

export type HouseIndex = Omit<House, 'user'>;
