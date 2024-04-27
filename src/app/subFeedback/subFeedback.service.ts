import {ForbiddenException, Injectable } from "@nestjs/common";
import { Profile, SubFeedBack } from "@prisma/client";

import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateSubFeedbackDTO } from "./dto/createSubFeedback.dto";
import { UpdateSubFeedbackDTO } from "./dto/updateSubfeedback.dto";



@Injectable({})
export class SubFeedbackService {
    constructor(
        private prismaService : PrismaService,
    ){

    }

    async getByFeedback(id:string) : Promise<SubFeedBack[]>{
        return await this.prismaService.subFeedBack.findMany({
            where:{
                feedbackId:id
            },
            include:{
                user:{
                    include:{
                        profile:true
                    }
                }
            }
        })
    }
    async create(createSubFeedbackDTO : CreateSubFeedbackDTO) : Promise<SubFeedBack>{
        console.log(createSubFeedbackDTO)
        return await this.prismaService.subFeedBack.create({
            data:{
                content:createSubFeedbackDTO.content,
                userId: createSubFeedbackDTO.userId,
                feedbackId: createSubFeedbackDTO.feedbackId
            }
        })
    }
    async update(id:string, updateSubFeedbackDTO : UpdateSubFeedbackDTO): Promise<SubFeedBack>{
        return await this.prismaService.subFeedBack.update({
            where:{
                id:id
            },
            data:{
                ...updateSubFeedbackDTO
            }
        })
    }
}