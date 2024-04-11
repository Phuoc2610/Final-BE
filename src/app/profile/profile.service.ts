import {ForbiddenException, Injectable } from "@nestjs/common";
import { Profile } from "@prisma/client";

import { PrismaService } from "src/database/prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update.profile.dto";


@Injectable({})
export class ProfileService {
    constructor(
        private prismaService : PrismaService,
    ){

    }

    
    async getProfile(id : string) : Promise<Profile>{
        if(id == null){
            throw new ForbiddenException('Not have Id')
        }
        const profile =  await this.prismaService.profile.findUnique({
            where:{
                userId: id
            }
        })
        if(!profile){
            throw new ForbiddenException("Error ")
        }
        return profile
    }

    async updateProfile(id: string, updateProfileDTO :UpdateProfileDto) : Promise<Profile>{
        const profile = this.getProfile(id)
        return await this.prismaService.profile.update({
            where:{
                id: id
            },
            data:{
                ...updateProfileDTO
            }
        })
    } 
}