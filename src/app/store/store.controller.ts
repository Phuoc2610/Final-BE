import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StoreService } from "./store.service";
import { CreateStoreDTO } from "./dto/create-store.dto";
import { UpdateStoreDTO } from "./dto/update-store.dto";

@Controller('store')
@ApiTags('Store')
export class StoreController{
    constructor(
        private storeService : StoreService
    ){

    }

    @Get('')
    getAll(){
        return this.storeService.findAll()
    }

    @Get(':id')
    getById(@Param('id') id:string) {
        return this.storeService.findById(id)
    }

    @Patch(':id')
    updateStore(@Param('id') id:string , @Body() updateStoreDTO : UpdateStoreDTO){
        return this.storeService.update(id, updateStoreDTO);
    }
    
    @Post('')
    createStore(@Body() createStoreDTO: CreateStoreDTO){
        return this.storeService.create(createStoreDTO);
    }

    @Delete(':id')
    deleteStore(@Param('id') id:string){
        return this.storeService.deleteStore(id)
    }
    
}