import { IsInt, IsOptional, IsString } from 'class-validator';
import { ToNumber } from 'src/common/decorators/to-number.decorator';

export class SearchHousesQueryDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsInt()
  @IsOptional()
  @ToNumber()
  limit = 10;

  @IsInt()
  @IsOptional()
  @ToNumber()
  offset = 0;
}
