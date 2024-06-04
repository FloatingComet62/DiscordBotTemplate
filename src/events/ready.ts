import { Client, Events } from 'discord.js';
import { AppClient, EventData } from '../interfaces';

const name = Events.ClientReady;
const once = true;

async function execute(_: AppClient, client: Client) {
	if (!client.user) {
		console.error(`Failed to login`);
		process.exit(1);
	}
	console.log(`Logged in as ${client.user.tag}`);
}

export default { name, once, execute } as EventData;
