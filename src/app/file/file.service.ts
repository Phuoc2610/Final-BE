import { Injectable } from "@nestjs/common";
import { S3Service } from "src/provide/s3/s3.service";

@Injectable()
export class FileService{
    constructor(
        private readonly s3Service : S3Service
    ){

    }

    async uploadFile(file:any):Promise<any>{
        return this.s3Service.uploadFile(file, 'app/')
    }
}