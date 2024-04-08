import { ForbiddenException, Injectable } from "@nestjs/common";
import { Category, FeedBack, Store } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { UpdateStoreDTO } from "./dto/update-store.dto";
import { CreateStoreDTO } from "./dto/create-store.dto";


@Injectable({})
export class StoreService {
    constructor(
        private prismaService: PrismaService,

    ) {
    }

    async findAll(): Promise<Store[]> {
        return await this.prismaService.store.findMany();
    }

    async findById(id: string): Promise<Store> {
        if (!id) {
            throw new ForbiddenException("Error Id:")
        }
        const feedBack = await this.prismaService.store.findUnique({
            where: {
                id: id
            },

        })
        if (!feedBack) {
            throw new ForbiddenException("Error category")
        }
        return feedBack
    }
    async create(createStoreDTO: CreateStoreDTO): Promise<Store> {
        return await this.prismaService.store.create({
            data: {
                ...createStoreDTO
            }
        })
    }

    async update(id: string, updateStoreDTO : UpdateStoreDTO): Promise<Store> {
        const feedBack = this.findById(id)
        if (!feedBack) {
            throw new ForbiddenException("Error id")
        }
        return await this.prismaService.store.update({
            where: {
                id: id
            },
            data: {
                ...updateStoreDTO
            }
        })
    }
    async deleteStore(id: string): Promise<any> {
        return await this.prismaService.store.delete({
            where: {
                id: id
            }
        })
    }
}