import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Command } from './interfaces';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const filePath = path.join(commandsPath, file);
	const command: Command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN || '');
rest.put(Routes.applicationGuildCommands(process.env.CLIENTID || '', process.env.GUILDID || ''), { body: commands })
    .then(() => console.log('Commands deployed!'))
    .catch(console.error);