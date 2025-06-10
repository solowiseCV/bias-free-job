import nodemailer from "nodemailer";

// You can use any SMTP provider (Gmail, Mailtrap, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  service: "gmail", // or use `host`, `port`, `secure`, etc. for custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASSWORD, // your email app password (not your actual password!)
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};
