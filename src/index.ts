import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { AppClient } from './types';
import { iterateCommands, iterateEvents } from './loader';
import KeyV from 'keyv';

config();

let keyV: KeyV | null = null;
if (KeyV) {
	keyV = new KeyV({
		uri: process.env.CONNECTION_URI,
	});
}

keyV?.on('error', (error) => console.error(`KeyV Connection Error\n${error}`));

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
}) as AppClient;

client.commands = new Collection();
client.cooldowns = new Collection();

iterateCommands((_, command) => {
	client.commands.set(command.data.name, command);
});

iterateEvents((event) => {
	const lambda = (...args: any[]) => event.execute(client, ...args);
	if (event.once) {
		client.once(event.name, lambda);
	} else {
		client.on(event.name, lambda);
	}
});

client.login(process.env.TOKEN);
