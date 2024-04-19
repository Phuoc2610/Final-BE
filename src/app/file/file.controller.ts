import { Controller, ForbiddenException, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FileService } from "./file.service";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role } from "src/common/enums/roles.enum";
import { MyJwtGuard } from "src/common/guard/jwt-auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";

@Controller('file')
@ApiTags('File')
// @ApiBearerAuth('JWT-auth')
// @Roles(Role.User)
// @UseGuards(MyJwtGuard, RolesGuard)
export class FileController{
    constructor(
        private readonly fileService: FileService
    ){

    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile('file') file:Express.Multer.File):Promise<any>{
        console.log(file)
        try{
            return await this.fileService.uploadFile(file)

        }catch(error){
            throw new ForbiddenException()
        }
    }
}