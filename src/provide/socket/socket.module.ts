/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './gateway';
import { NotificationService } from 'src/app/notification/notification.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { RoomMessageService } from 'src/app/roomMessage/roomMessage.service';
import { UserRoomMessageService } from 'src/app/userRoomMessage/userRoomMessage.service';
import { MessageService } from 'src/app/message/message.service';


@Global()
@Module({
  providers: [SocketGateway, NotificationService, PrismaService, RoomMessageService, UserRoomMessageService, MessageService],
  exports: [SocketGateway],
})
export class SocketModule {}