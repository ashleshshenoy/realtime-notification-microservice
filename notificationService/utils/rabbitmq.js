const amqp = require("amqplib");

const AMQP_URL = process.env.RABBIT_MQ;
const EXCHANGE_NAME = "direct_exchange";

let channel;

async function connectRabbitMQ() {
	const connection = await amqp.connect(AMQP_URL);
	channel = await connection.createChannel();
	await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true , exclusive : true});
}

async function publishMessage(sender,userId, message) {
	console.log(`${sender} sent message to ${userId}`);
	await channel.publish(EXCHANGE_NAME, userId, Buffer.from(JSON.stringify(message)));
}

module.exports = {
	connectRabbitMQ,
	publishMessage,
};
