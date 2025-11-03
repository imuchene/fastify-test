import '@dotenvx/dotenvx/config';
import amqplib, { Message } from 'amqplib';

export class AnalyticsService {
  channel: amqplib.Channel;
  connection: amqplib.ChannelModel;

  private drinkMap: any = { latte: 0, coffee: 0, cappuccino: 0 };

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(String(process.env.RABBITMQ_URL));
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('analytics');

      this.channel.consume('analytics', (data: Message | null) => {
        if (data) {
          const { content } = data;
          const { order, customer } = JSON.parse(content.toString());

          if (this.drinkMap[order] !== undefined) {
            this.drinkMap[order]++;
          }
          console.log(`${order} being analyzed for ${customer}`);
          this.channel.ack(data);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
