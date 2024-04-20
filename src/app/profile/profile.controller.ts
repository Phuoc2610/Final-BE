import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { Profile } from "@prisma/client";
import { GetUser } from "src/common/decorator/user.decorator";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role } from "src/common/enums/roles.enum";
import { MyJwtGuard } from "src/common/guard/jwt-auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { UpdateProfileDto } from "./dto/update.profile.dto";

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard, RolesGuard)
export class ProfileController{
    constructor(
        private profileService : ProfileService
    ){
        
    }
    
    @Roles(Role.User)
    @Get()
    async getyToken(@GetUser('id') userId: string): Promise<Profile>{
        return this.profileService.getProfile(userId)
    }
    @Get(':id')
    async getById(@Param('id') userId: string) : Promise<Profile>{
        return this.profileService.getProfile(userId)
    }
    @Roles(Role.User)
    @Patch(':id')
    async update(@Param('id') id:string, @Body() updateProfileDTO: UpdateProfileDto):Promise<Profile>{
        return this.profileService.updateProfile(id, updateProfileDTO)
    }
}