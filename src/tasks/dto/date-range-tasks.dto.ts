import { IsDateString } from "class-validator";

export class DateRangeTasksDto{
    @IsDateString()
    startDate: Date;
    
    @IsDateString()
    endDate: Date
}