import { IsOptional, IsString } from 'class-validator';

export class SearchHousesQueryDto {
  @IsString()
  @IsOptional()
  q?: string;
}
