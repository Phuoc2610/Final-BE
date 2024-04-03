import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDTO } from "./dto.ts/create.category.dto";

@Controller('category')
@ApiTags('Category')
export class CategoryController{
    constructor(
        private categoryService : CategoryService
    ){

    }

    @Get('')
    getAll(){
        return this.categoryService.findAll()
    }
    @Post('')
    createCategory(@Body() createCategoryDTO: CreateCategoryDTO){
        return this.categoryService.create(createCategoryDTO);
    }
    
}