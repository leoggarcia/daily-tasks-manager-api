import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
	
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  schedule_date: Date;
  
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  schedule_end_date: Date;
}
