import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDTO } from "./dto/create-feedback.dto";
import { UpdateFeedbackDTO } from "./dto/update-feedback.dto";

@Controller('feedback')
@ApiTags('Feedback')
export class FeedbackController{
    constructor(
        private feedbackService : FeedbackService
    ){

    }

    @Get('')
    getAll(){
        return this.feedbackService.findAll()
    }

    @Get(':id')
    getById(@Param('id') id:string) {
        return this.feedbackService.findById(id)
    }

    @Patch(':id')
    updateCategory(@Param('id') id:string , @Body() updateFeedbackDTO : UpdateFeedbackDTO){
        return this.feedbackService.update(id, updateFeedbackDTO);
    }
    
    @Post('')
    createCategory(@Body() createFeedbackDTO: CreateFeedbackDTO){
        return this.feedbackService.create(createFeedbackDTO);
    }

    @Delete(':id')
    deleteCategory(@Param('id') id:string){
        return this.deleteCategory(id)
    }
    
}