import { createTransport, SendMailOptions } from 'nodemailer';
import '@dotenvx/dotenvx/config';

const transporter = createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export async function sendMail(to: string, html: string) {
  const mailOptions: SendMailOptions = {
    from: 'noreply@innbox.example.com',
    to,
    subject: 'Email from Inn Box!',
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`An error occurred: ${error.message}`);
    }
  }
}
