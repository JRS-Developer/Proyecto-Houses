import { OmitType } from '@nestjs/mapped-types';
import { CreateHouseDto } from './create-house.dto';

export class CalculateHousePriceDto extends OmitType(CreateHouseDto, [
  'title',
] as const) {}
