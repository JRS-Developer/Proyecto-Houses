import { IsInt, IsPositive } from 'class-validator';
import { ToNumber } from 'src/common/decorators/to-number.decorator';

export class CreateChatDto {
  @IsInt()
  @ToNumber()
  @IsPositive()
  receiverId!: number;
}
