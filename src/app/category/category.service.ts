import { ForbiddenException, Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateCategoryDTO } from "./dto/create.category.dto";
import { UpdateCategoryDTO } from "./dto/update.category.dto";

@Injectable({})
export class CategoryService {
    constructor(
        private prismaService: PrismaService,

    ) {
    }

    async findAll(): Promise<Category[]> {
        return await this.prismaService.category.findMany();
    }

    async findById(id: string): Promise<Category> {
        if (!id) {
            throw new ForbiddenException("Error Id:")
        }
        const category = await this.prismaService.category.findUnique({
            where: {
                id: id
            },

        })
        if (!category) {
            throw new ForbiddenException("Error category")
        }
        return category
    }
    async create(createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        return await this.prismaService.category.create({
            data: {
                ...createCategoryDTO
            }
        })
    }

    async update(id: string, updateCatgoryDTO: UpdateCategoryDTO): Promise<Category> {
        const category = await this.findById(id)

        if (!category) {
            throw new ForbiddenException("Error id")
        }
        return await this.prismaService.category.update({
            where: {
                id: id
            },
            data: {
                ...updateCatgoryDTO
            }
        })
    }
    async deleteCategory(id: string): Promise<any> {
        const category = await this.findById(id);
        // if(category.)
        return await this.prismaService.category.delete({
            where: {
                id: id
            }
        })
    }
}