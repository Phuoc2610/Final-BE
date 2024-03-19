import { ForbiddenException, Injectable } from "@nestjs/common";

import { PrismaService } from "src/database/prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";
import * as argon from 'argon2';
import { error } from "console";
import { RoleEnum } from "./types/role.type";
import { Profile, Role, User, UserRole } from "@prisma/client";
import { AuthDTO } from "./dto/auth.dto";

@Injectable({})
export class AuthService {
    constructor(
        private prismaService : PrismaService,
    ){

    }

    // asnyc login(){
    //     return await
    // }
    async register(registerDTO: RegisterDTO) : Promise<any>{
        const hashPass = await argon.hash(registerDTO.password);
        const userRole = await this.findRole(RoleEnum.User)
        try{
            const user = await this.prismaService.user.create({
                data:{
                    email: registerDTO.email,
                    password: hashPass,
                    firstName: registerDTO.firstName,
                    lastName: registerDTO.lastName,
                },
            })
            await this.createProfile(user);
            return user
        }catch(error){
            if(error.code == 'P2002'){
                throw new ForbiddenException('Email already exist ');
            }
        }
    }

    async createProfile(user: User) : Promise<Profile>{
        return await this.prismaService.profile.create({
            data:{
                fullName: user.firstName + user.lastName,
                userId: user.id
            }
        })
    }
    async login(authDTO: AuthDTO):Promise<any>{
        const user = await this.prismaService.user.findUnique({
            where:{
                email: authDTO.email,
                isDelete: false
            },
            include:{
                userRoles:{
                    select:{
                        role: true
                    }
                }
            }
        })

        if (!user) {
            throw new ForbiddenException('User not found');
          }
          if (!user.password) {
            throw new ForbiddenException('password wrong');
          }
          const verifyPassword = await argon.verify(
            user.password,
            authDTO.password,
          );
          if (!verifyPassword) {
            throw new ForbiddenException('Wrong Password');
          }
      
          delete user.password;

          return user
    }

    async connectRoleUser(userId: string, roleId: string) : Promise<UserRole>{
        return await this.prismaService.userRole.create({
            data:{
                userId: userId,
                roleId: roleId
            }
        })
    }
    async findRole (name : string) : Promise<Role>{
        if(name == null){
            throw new ForbiddenException("Don't find role")
        }
        return await this.prismaService.role.findUnique({
            where:{
                name: name
            }
        })
    }
}