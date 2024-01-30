import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsPositive()
  chatId!: number;

  @IsString()
  @IsNotEmpty()
  message!: string;
}
