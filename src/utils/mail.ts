
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (data :any) => {
  try {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS 
      },
    });

    const mailOptions = {
      from: `Bias project <${process.env.NODE_MAILER_USER}>`,
      to: data.email,
      subject: data.subject,
      html: data.html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};


