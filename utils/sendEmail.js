import nodemailer from "nodemailer";
export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const messageContent = {
    from: `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`,
    to: email,
    subject: subject,
    html: `<b>${message}</b>`,
  };
  const info = await transporter.sendMail(messageContent);
  console.log("Message sent: %s", info.messageId);
};

// all code available in nodemailer documentation
