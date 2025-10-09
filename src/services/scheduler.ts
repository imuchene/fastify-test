import { scheduleJob, Spec } from 'node-schedule';
import { sendMail } from './mailer';
import { campaignMail } from '../templates/mail-template';

export function schedule(timeOptions: Spec) {
  scheduleJob(timeOptions, async () => {
    await sendMail(
      'izo@example.com',
      campaignMail('Special Promotion', 'promo1', 'izo@example.com'),
    );
  });
}
