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

const html = 
`<html>
  <body>
    <h1>Confirm your email</h1>
  </body>
</html>
`

const mailOptions: SendMailOptions = {
  from: 'izo@innbox.example.com',
  to: 'imuchene@msn.com',
  subject: 'Welcome to Inn Box!',
  html: html,
};

async function sendMail() {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`An error occurred: ${error.message}`);
    }
  }
}

sendMail();
