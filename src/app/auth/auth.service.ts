import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "src/database/prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";
import * as argon from 'argon2';
import { RoleEnum } from "./types/role.type";
import { Profile, Role, User, UserRole } from "@prisma/client";
import { AuthDTO } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import { createOAuth2Client } from "src/common/config/google/oauth2.config";
import { MailService } from "src/provide/mail/mail.service";
import passport from "passport";
// import { createOAuth2Client } from 'src/config/google/oauth2.config';
@Injectable({})
export class AuthService {
    private readonly client: OAuth2Client;
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
    ) {
        this.client = createOAuth2Client();
    }

    async register(registerDTO: RegisterDTO): Promise<any> {
        const hashPass = await argon.hash(registerDTO.password);
        const userRole = await this.findRole(RoleEnum.User)
        const roleUser = await this.findRole(RoleEnum.Store)
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: registerDTO.email,
                    password: hashPass,
                    firstName: registerDTO.firstName,
                    lastName: registerDTO.lastName,
                },
            })
            await this.connectRoleUser(user.id, "clgywq0h8000308l3a38y39t6")
            await this.createProfile(user);
            const listStore = await this.prismaService.user.findMany({
                where:{
                    userRoles:{
                        some:{
                            roleId: roleUser.id
                        }
                    }
                }
            })
            console.log(listStore)
            for(const store of listStore ){
                await this.prismaService.roomMessage.create({
                    data:{
                        userRoomMessage:{
                            createMany:{
                                data:[
                                    {
                                        userId: user.id
                                    },
                                    {
                                        userId: store.id
                                    }
                                ]
                            }
                        }
                    }
                })

            }
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
                userId: user.id,
                address: '117 nguyen tri phuong',
                avatarUrl: 'https://cdn-icons-png.freepik.com/512/147/147142.png',
                gender: 'male'
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
    ): Promise<{accessToken:string}> {
        const payload = {
            id: userId,
            email,
            roles,
        };
        const jwtString =  await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '7d',
        })

        return {
            accessToken: jwtString,
        }
    }

    async verifyGoogleIdToken(token: string): Promise<any> {
        const ticket = await this.client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name, picture } = ticket.getPayload();
        const user = await this.loginGoogle(email, name, picture);
        return await this.createJwtToken(user.id, user.email, user.userRoles[0].role.name);
      }
    
      async loginGoogle(
        email: string,
        name: string,
        picture: string,
      ): Promise<any> {
        const user = await this.prismaService.user.findUnique({
          where: {
            email: email,
          },
          include: {
            userRoles: {
                include:{
                    role:true
                }
            },
          },
        });
        // console.log(user)
        if (!user) {
          const newUser = await this.prismaService.user.create({
            data: {
              email: email,
              profile: {
                create: {
                  fullName: name,
                  avatarUrl: picture,
                },
              },
              userRoles:{
                create:{
                    roleId: "clgywq0h8000308l3a38y39t6"
                }
              }
            },
          });
          return newUser;
        }
        return user ;
      }

    async sendEmail() {
        return await this.mailService.sendEmail(
          'phuocnvgcd191236@fpt.edu.vn',
          'phuoc0905886611@gmail.com',
          'Hello phuoc',
          'Vào thư rác k ? ',
        );
      }

      async changePassword(authDTO: AuthDTO): Promise<void>{
        await this.prismaService.user.update({
            where:{
                email: authDTO.email
            },
            data:{
                password: authDTO.password
            }
        })
      }

      async resetPassword(email : string){
        const randomNumber = Math.floor(Math.random() * 1000000);
        const randomString = randomNumber.toString().padStart(6, '0');
        const user = await this.prismaService.user.findUnique({
          where:{
            email: email
          }
        })
        
        if(!user){
          throw new ForbiddenException('Not Found')
        }
        const password = await argon.hash(randomString);
        await this.prismaService.user.update({
          where:{
            email: email
          },
          data:{
            password: password
          }
        })
    
        return await this.mailService.sendEmail(
          `${email}`,
          'hieutcgcd191045@fpt.edu.vn',
          'Reset PassWord KMart',
          `Your new password is ${randomString}`,
        );
      }
}