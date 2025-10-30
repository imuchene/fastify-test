import '@dotenvx/dotenvx/config';
import amqplib from 'amqplib';


export class FulfilmentService {
  async connect(){
  try {
    const connection = await amqplib.connect(String(process.env.RABBITMQ_URL));
    const channel = await connection.createChannel();
    await channel.assertQueue('analytics');
  } catch (error) {
    console.error(error);
  }
}

}