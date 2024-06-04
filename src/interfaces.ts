import {
	CacheType,
	ChatInputCommandInteraction,
	Client,
	ClientEvents,
	Collection,
	SlashCommandBuilder,
} from 'discord.js';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			CLIENT_ID: string;
			GUILD_ID: string;
		}
	}
}

export type InteractionType = ChatInputCommandInteraction<CacheType>;

export interface CommandData {
	cooldown: number;
	data: SlashCommandBuilder;
	execute: (interaction: InteractionType) => Promise<void>;
}

export interface AppClient extends Client {
	commands?: Collection<string, CommandData>;
}

export interface EventData {
	name: keyof ClientEvents;
	once: boolean;
	execute: (client: AppClient, ...any: any[]) => Promise<void>;
}
