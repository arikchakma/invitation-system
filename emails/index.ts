import { buildSendMail } from 'mailing-core';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.postmarkapp.com',
  port: 587,
  auth: {
    user: process.env.POSTMARK_API_KEY,
    pass: process.env.POSTMARK_API_KEY,
  },
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: 'Arik from Invitation System <hello@arikko.dev>',
  configPath: './mailing.config.json',
});

export default sendMail;
