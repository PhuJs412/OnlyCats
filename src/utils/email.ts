import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html
  });
};
