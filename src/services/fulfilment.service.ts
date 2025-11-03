import '@dotenvx/dotenvx/config';
import amqplib, { Message } from 'amqplib';
export class FulfilmentService {
  channel: amqplib.Channel;
  connection: amqplib.ChannelModel;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(String(process.env.RABBITMQ_URL));
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('analytics');
      await this.channel.assertQueue('drink-order');

      this.channel.consume('drink-order', async (data: Message | null) => {
        if (data) {
          const { content } = data;
          const { order, customer } = JSON.parse(content.toString());
          console.log(`${order} being fulfilled for ${customer}`);
          this.channel.ack(data);
          await this.sendOrderData({ order, customer });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendOrderData(data: any) {
    this.channel.sendToQueue('analytics', Buffer.from(JSON.stringify(data)));
  }
}
