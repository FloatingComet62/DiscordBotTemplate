import { Client, Intents, Collection } from 'discord.js';
import { customClient, Command, Event } from './interfaces';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const client: customClient = new Client({
    intents: [
        Intents.FLAGS.GUILDS
    ]
});

// Command Loader
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));
for(const file of commandFiles){
	const filePath = path.join(commandsPath, file);
	const command: Command = require(filePath);

	client.commands.set(command.data.toJSON().name, command);
}

// Event Loader
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.js'));
for(const file of eventFiles){
	const filePath = path.join(eventsPath, file);
	const event: Event = require(filePath);

	if(event.once) client.once(event.name, (...args: any[]) => eventExecuter(event.needClient, ...args));
	else client.on(event.name, (...args: any[]) => eventExecuter(event.needClient, ...args));

    function eventExecuter(needClient: boolean, ...args: any[]){
        if(needClient) event.execute(client, ...args);
        else event.execute(...args);
    }
}

client.login(process.env.TOKEN);