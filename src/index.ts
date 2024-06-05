import fs from 'fs';
import path from 'path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { CommandData, AppClient } from './interfaces';
import { COMMANDS_DIR, EVENTS_DIR, JS_FILE } from './consts';
import { loadCommand, loadEvent } from './loader';

config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
}) as AppClient;

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, COMMANDS_DIR);
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(JS_FILE);
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = loadCommand(filePath);
		client.commands.set(command.data.name, command);
	}
}

const eventsPath = path.join(__dirname, EVENTS_DIR);
const eventFiles = fs.readdirSync(eventsPath).filter(JS_FILE);

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = loadEvent(filePath);
	const lambda = (...args: any[]) => event.execute(client, ...args);
	if (event.once) {
		client.once(event.name, lambda);
	} else {
		client.on(event.name, lambda);
	}
}

client.login(process.env.TOKEN);
