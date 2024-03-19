import {ForbiddenException, Injectable } from "@nestjs/common";
import { Profile } from "@prisma/client";

import { PrismaService } from "src/database/prisma/prisma.service";


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
        return await this.prismaService.profile.findUnique({
            where:{
                userId: id
            }
        })
    }
}