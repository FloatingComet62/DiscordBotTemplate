import { CommandData, EventData } from './interfaces';

export function loadCommand(filePath: string): CommandData {
	return require(filePath).default as CommandData;
}

export function loadEvent(filePath: string): EventData {
	return require(filePath).default as EventData;
}
