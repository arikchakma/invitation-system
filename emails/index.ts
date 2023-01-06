import nodemailer from "nodemailer";
import { buildSendMail } from "mailing-core";

const transport = nodemailer.createTransport({
  pool: true,
  secure: true, // use TLS
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: "Arik from Invitation System <hello@arikko.dev>",
  configPath: "./mailing.config.json",
});

export default sendMail;
