import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "src/database/prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";
import * as argon from 'argon2';
import { error } from "console";
import { RoleEnum } from "./types/role.type";
import { Profile, Role, User, UserRole } from "@prisma/client";
import { AuthDTO } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { promises } from "dns";

@Injectable({})
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {

    }

    async register(registerDTO: RegisterDTO): Promise<any> {
        const hashPass = await argon.hash(registerDTO.password);
        const userRole = await this.findRole(RoleEnum.User)
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: registerDTO.email,
                    password: hashPass,
                    firstName: registerDTO.firstName,
                    lastName: registerDTO.lastName,
                },
            })
            const role = await this.connectRoleUser(user.id, "clgywq0h8000308l3a38y39t6")
            await this.createProfile(user);
            return this.createJwtToken(user.id, user.email, userRole.name)
        } catch (error) {
            if (error.code == 'P2002') {
                throw new ForbiddenException('Email already exist ');
            }
        }
    }

    async createProfile(user: User): Promise<Profile> {
        return await this.prismaService.profile.create({
            data: {
                fullName: user.firstName + user.lastName,
                userId: user.id
            }
        })
    }
    async login(authDTO: AuthDTO): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDTO.email,
                isDelete: false
            },
            include: {
                userRoles: {
                    include: {
                        role: {
                            select: {
                                name: true
                            }
                        }
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

        return await this.createJwtToken(user.id, user.email, user.userRoles[0].role.name)
    }

    async connectRoleUser(userId: string, roleId: string): Promise<UserRole> {
        return await this.prismaService.userRole.create({
            data: {
                userId: userId,
                roleId: roleId
            }
        })
    }
    async findRole(name: string): Promise<Role> {
        if (name == null) {
            throw new ForbiddenException("Don't find role")
        }
        return await this.prismaService.role.findUnique({
            where: {
                name: name
            }
        })
    }

    async findRoleById(id: string): Promise<Role> {
        if (id !== null) {
            throw new NotFoundException('Not find id')
        }
        return await this.prismaService.role.findUnique({
            where: {
                id: id
            }
        })
    }
    async createJwtToken(
        userId: string,
        email: string,
        roles: string,
    ): Promise<any> {
        const payload = {
            id: userId,
            email,
            roles,
        };
        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '7d',
        })
    }
}