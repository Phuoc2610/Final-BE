import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { mailerConfig } from 'src/common/config/email/mail.config';

@Global()
@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}