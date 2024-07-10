const amqp = require("amqplib");

const AMQP_URL = process.env.RABBIT_MQ;
const EXCHANGE_NAME = "direct_exchange";

let channel;

async function connectRabbitMQ() {
	try {
		const connection = await amqp.connect(AMQP_URL);
		channel = await connection.createChannel();
		await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
		console.log("Publisher connected to RabbitMQ");
	} catch (error) {
		console.error("Error connecting publisher to RabbitMQ:", error.message);
		throw error;
	}
}

async function publishMessage(sender, userId, message) {
	try {
		if (!channel) {
			await connectRabbitMQ();
		}
		console.log(`${sender} sent message to ${userId}`);
		await channel.publish(
			EXCHANGE_NAME,
			userId,
			Buffer.from(JSON.stringify(message)),
			{ persistent: true }
		);
		console.log("Message sent successfully");
	} catch (error) {
		console.error("Error publishing message:", error.message);
		throw error;
	}
}

module.exports = {
	connectRabbitMQ,
	publishMessage,
};
