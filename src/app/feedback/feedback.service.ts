import { ForbiddenException, Injectable } from "@nestjs/common";
import { Category, FeedBack } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateFeedbackDTO } from "./dto/create-feedback.dto";
import { UpdateFeedbackDTO } from "./dto/update-feedback.dto";


@Injectable({})
export class FeedbackService {
    constructor(
        private prismaService: PrismaService,

    ) {
    }

    async findAll(): Promise<FeedBack[]> {
        return await this.prismaService.feedBack.findMany();
    }

    async findById(id: string): Promise<FeedBack> {
        if (!id) {
            throw new ForbiddenException("Error Id:")
        }
        const feedBack = await this.prismaService.feedBack.findUnique({
            where: {
                id: id
            },

        })
        if (!feedBack) {
            throw new ForbiddenException("Error category")
        }
        return feedBack
    }
    async create(createFeedbackDTO: CreateFeedbackDTO): Promise<FeedBack> {
        console.log(createFeedbackDTO)
        return await this.prismaService.feedBack.create({
            data: {
                ...createFeedbackDTO
            }
        })
    }

    async update(id: string, updateCatgoryDTO: UpdateFeedbackDTO): Promise<FeedBack> {
        const feedBack = await this.findById(id)
        if (!feedBack) {
            throw new ForbiddenException("Error id")
        }
        return await this.prismaService.feedBack.update({
            where: {
                id: id
            },
            data: {
                ...updateCatgoryDTO
            }
        })
    }
    async deleteFeedback(id: string): Promise<any> {
        const feedback = await this.findById(id);
        return await this.prismaService.feedBack.delete({
            where: {
                id: id
            }
        })
    }
}