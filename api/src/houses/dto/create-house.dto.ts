import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
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

  @IsString()
  address!: string;

  @IsInt()
  @Min(0)
  bedRoomAbvGr!: number;

  @IsInt()
  @Min(0)
  fullBath!: number;

  @IsString()
  @IsUrl()
  image!: string;
}
