import fs from 'fs';
import path from 'path';
import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	InteractionReplyOptions,
} from 'discord.js';
import { config } from 'dotenv';
import { CommandData, AppClient, EventData } from './interfaces';

config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
}) as AppClient;

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath).default as CommandData;
		client.commands.set(command.data.name, command);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath).default as EventData;
	const lambda = (...args: any[]) => event.execute(client, ...args);
	if (event.once) {
		client.once(event.name, lambda);
	} else {
		client.on(event.name, lambda);
	}
}

client.login(process.env.TOKEN);
