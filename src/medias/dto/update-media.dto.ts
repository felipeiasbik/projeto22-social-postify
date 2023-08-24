import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMediaDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
