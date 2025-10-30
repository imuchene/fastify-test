import '@dotenvx/dotenvx/config';
import amqplib from 'amqplib';


export class AnalyticsService {
//   async connect(){
//   try {
//     const connection = await amqplib.connect(String(process.env.RABBITMQ_URL));
//     const channel = await connection.createChannel();
//     await channel.assertQueue('drink-order');
//   } catch (error) {
//     console.error(error);
//   }
// }

}