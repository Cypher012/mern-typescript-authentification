import nodemailer, { createTransport, SendMailOptions } from "nodemailer";
import config from "config";
import { log } from "./logger";

/* const createTestCreds = async () => {
  const creds = await nodemailer.createTestAccount();
  console.log({ creds });
}; */
// createTestCreds();

const smtp = config.get<{
  user: string;
  host: string;
  port: number;
  pass: string;
  secure: boolean;
}>("smtp");

const transporter = createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.secure,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

export async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, "Error sending email");
      return;
    }

    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    log.info(`Email sent: ${info.response}`);
    log.info(`Message ID: ${info.messageId}`);
  });
}
