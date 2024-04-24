import { MailerOptions } from '@nestjs-modules/mailer';
export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'phuoc0905886611@gmail.com',
      pass: 'srsj pjfk qbjb pczs',
    },
  },
  defaults: {
    from: 'phuoc0905886611@gmail.com',
  },
};