import '@dotenvx/dotenvx/config';
import amqplib, { Message } from 'amqplib';

export class AnalyticsService {
  channel: amqplib.Channel;
  connection: amqplib.ChannelModel;

  private drinkMap: any = { latte: 0, coffee: 0, cappuccino: 0 };

  constructor() {
    this.connect();
    this.processDrinkAnalytics();
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

  async processDrinkAnalytics() {
    const FIVE_MINUTES_IN_MILLISECONDS = 5 * 60 * 1000;
    const TEN_SECONDS_IN_MILLISECONDS = 10 * 1000;

    setInterval(() => {
      const drinkNames = Object.keys(this.drinkMap);

      const totalDrinkCount = drinkNames.reduce((total, drinkName) => {
        return total + this.drinkMap[drinkName];
      }, 0);

      const drinkPercentages = drinkNames.map((drinkName) => {
        const percentage =
          Math.floor((this.drinkMap[drinkName] / totalDrinkCount) * 100) || 0;
        return `${drinkName}: ${percentage}%`;
      });

      console.log(`Drink orders: ${drinkPercentages}`);

      setTimeout(() => {
        drinkNames.forEach((drinkName) => {
          this.drinkMap[drinkName] = 0;
        });
      }, FIVE_MINUTES_IN_MILLISECONDS);
    }, TEN_SECONDS_IN_MILLISECONDS);
  }
}
