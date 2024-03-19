import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { Profile } from "@prisma/client";

@Controller('profile')
@ApiTags('Profile')
export class ProfileController{
    constructor(
        private profileService : ProfileService
    ){

    }

    @Get(':id')
    async getById(@Param('id') userId: string) : Promise<Profile>{
        return this.profileService.getProfile(userId)
    }
    
}