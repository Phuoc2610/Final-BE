import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubFeedbackDTO{
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    content: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userId: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    feedbackId: string;
}