import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDTO } from "./dto/create.category.dto";
import { UpdateCategoryDTO } from "./dto/update.category.dto";

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

    @Get(':id')
    getById(@Param('id') id:string) {
        return this.categoryService.findById(id)
    }

    @Patch(':id')
    updateCategory(@Param('id') id:string , @Body() updateCategoryDTO : UpdateCategoryDTO){
        return this.categoryService.update(id, updateCategoryDTO);
    }
    
    @Post('')
    createCategory(@Body() createCategoryDTO: CreateCategoryDTO){
        return this.categoryService.create(createCategoryDTO);
    }

    @Delete(':id')
    deleteCategory(@Param('id') id:string){
        return this.deleteCategory(id)
    }
    
}