import path from 'path';
import fs from 'fs';
import { COMMANDS_DIR, EVENTS_DIR, JS_FILE } from './consts';
import { CommandData, EventData } from './types';

export function loadCommand(filePath: string): CommandData {
	return require(filePath).default as CommandData;
}

export function loadEvent(filePath: string): EventData {
	return require(filePath).default as EventData;
}

export function iterateCommands(
	callback: (type: string, command_data: CommandData) => void,
): void {
	const foldersPath = path.join(__dirname, COMMANDS_DIR);
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(JS_FILE);
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = loadCommand(filePath);
			callback(folder, command);
		}
	}
}

export function iterateEvents(callback: (event_data: EventData) => void): void {
	const eventsPath = path.join(__dirname, EVENTS_DIR);
	const eventFiles = fs.readdirSync(eventsPath).filter(JS_FILE);

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = loadEvent(filePath);
		callback(event);
	}
}
