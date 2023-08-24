import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;
}
