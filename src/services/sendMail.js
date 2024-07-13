import nodemailer from "nodemailer";

export const sendMail = async ({
  to,
  subject = "Nop Reply",
  textMessage = "",
}) => {
  // config email transporter
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: process.env.MAIL_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAil_AUTH,
      pass: process.env.MAIL_PASS,
    },
    service: "gmail",
  });

  const info = await transporter.sendMail({
    from: '"Job Search App"<mh0649546@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text: textMessage, // plain text body
  });
  return info;
};

export default sendMail;
