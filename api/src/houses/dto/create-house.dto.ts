import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateHouseDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @Min(0)
  salePrice!: number;

  @IsInt()
  @IsPositive()
  @Min(1900)
  @Max(new Date().getFullYear())
  yearBuilt!: number;

  @IsInt()
  @Min(0)
  garageCars = 0;
}
