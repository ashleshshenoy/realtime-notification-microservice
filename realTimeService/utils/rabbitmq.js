const amqp = require('amqplib');

const AMQP_URL = process.env.RABBIT_MQ;
const EXCHANGE_NAME = 'direct_exchange';
const QUEUE_NAME = 'message_queue';

let channel;
const MAX_RETRY_ATTEMPTS = 3;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(AMQP_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
    console.log("Consumer connected to RabbitMQ");
  } catch (error) {
    console.error("Error connecting consumer to RabbitMQ:", error.message);
    throw error;
  }
}

async function consumeMessages(userId, socket) {
  try {
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, userId);

    console.log("Fetching messages for " + userId);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const retryAttempts = msg.properties.headers['x-retry-attempts'] || 0;

        try {
          const content = JSON.parse(msg.content.toString());
          console.log("Message received: ", content);
          socket.emit('notification', content); // Processing the message
          await channel.ack(msg);
          // eslint-disable-next-line 
        } catch (err) {
          const retryDelay = 1000 * Math.pow(5, retryAttempts);
          if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
            console.log("Max retry attempts reached."); // Discarding message, optionally add to DLQ
            await channel.ack(msg); // Acknowledge the message to remove it from the queue
            return;
          }

          console.log(`Retrying to process the message. Attempt: ${retryAttempts} Delay: ${retryDelay}`);
          setTimeout(async () => {
            await channel.publish(EXCHANGE_NAME, userId, Buffer.from(msg.content.toString()), {
              headers: {
                'x-retry-attempts': retryAttempts + 1,
              },
              persistent: true
            });
            await channel.ack(msg); // Acknowledge the original message after re-publishing
          }, retryDelay);
        }
      }
    });

    console.log('Waiting for messages...');
  } catch (error) {
    console.error('Error consuming messages:', error.message);
    throw error;
  }
}

module.exports = {
  connectRabbitMQ,
  consumeMessages,
};
