import config from '@/config/app.config';
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP.SMTPHOST?.toString(),
    port: parseInt(config.SMTP.SMTPPORT as string),
    secure: false,
    auth: {
      user: config.SMTP.SMTPUSER,
      pass: config.SMTP.SMTPPASS,
    },
  });

  await transporter.sendMail({
    from: '<no-reply@' + config.SMTP.SMTPHOST + '>',
    to,
    subject,
    html,
  });
};
