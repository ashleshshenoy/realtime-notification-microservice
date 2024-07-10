const amqp = require('amqplib');

const AMQP_URL = process.env.RABBIT_MQ; 
const EXCHANGE_NAME = 'direct_exchange';

let channel;

const MAX_RETRY_ATTEMPTS = 3


async function connectRabbitMQ() {
  const connection = await amqp.connect(AMQP_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
}


async function consumeMessages(userId, socket) {

  const { queue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue, EXCHANGE_NAME, userId);
  
  console.log("fetching message for "  + userId)
  channel.consume(queue,async (msg) => {
    if (msg !== null) {

      const retryAttempts = msg.properties.headers['x-retry-attempts'] || 0;
      try{

        const content = JSON.parse(msg.content.toString());
        console.log("message recieved : " , content)
        socket.emit('notification', content);  // processing the message        
        await channel.ack(msg);
        throw new Error("custom error to check retry");   //uncomment to check the retry mechanism
        //eslint-disable-next-line
      }catch(err){

        const retryDelay = 1000 * Math.pow(5, retryAttempts);
        if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
          console.log("Max retry attempts reached."); // discarding message in this case, optionally can add to a DLQ
          return;
        }

        console.log(`Retrying to process the message Attempt: ${retryAttempts } Delay: ${retryDelay}`);
        setTimeout(async () => {
            await channel.publish(EXCHANGE_NAME, userId, Buffer.from(msg.content.toString()), {
              headers: {
                'x-retry-attempts': retryAttempts + 1,
              },
            });

        }, retryDelay);

      }
    }
  });
}

module.exports = {
  connectRabbitMQ,
  consumeMessages
};
