/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Global()
@Module({
   imports:[MulterModule.register({
    storage: diskStorage({
        destination:'./uploads',
    }),
    limits:{fieldSize: 5000000},
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          req.fileValidationError = 'Only image files are allowed!';
          return callback(null, false);
        }
        callback(null, true);
      },
   })] ,
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}