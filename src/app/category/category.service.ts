import { Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateCategoryDTO } from "./dto.ts/create.category.dto";

@Injectable({})
export class CategoryService {
    constructor(
        private prismaService: PrismaService,

    ) {
    }

    async findAll():Promise<Category[]>{
        return await this.prismaService.category.findMany();
    }
    async create(createCategoryDTO: CreateCategoryDTO) : Promise<Category>{
        return  await this.prismaService.category.create({
            data:{
                ...createCategoryDTO
            }
        })
     }
}