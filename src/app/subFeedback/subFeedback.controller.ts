import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Profile } from "@prisma/client";
import { GetUser } from "src/common/decorator/user.decorator";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role } from "src/common/enums/roles.enum";
import { MyJwtGuard } from "src/common/guard/jwt-auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { SubFeedbackService } from "./subFeedback.service";
import { CreateSubFeedbackDTO } from "./dto/createSubFeedback.dto";
import { UpdateSubFeedbackDTO } from "./dto/updateSubfeedback.dto";


@Controller('subFeedback')
@ApiTags('SubFeedBack')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard, RolesGuard)
export class SubFeedbackController{
    constructor(
       private readonly subFeedbackService: SubFeedbackService
    ){
        
    }
    
    @Get('feedback/:id')
    getByFeedback(@Param('id') id:string){
        return this.subFeedbackService.getByFeedback(id)
    }
    @Post()
    create(@Body() crateSubFeedbackDTO: CreateSubFeedbackDTO){
        return this.subFeedbackService.create(crateSubFeedbackDTO)
    }

    @Patch(':id')
    update(@Param('id') id:string, @Body() updateSubFeedbackDTO: UpdateSubFeedbackDTO){
        return this.subFeedbackService.update(id, updateSubFeedbackDTO)
    }
   
}