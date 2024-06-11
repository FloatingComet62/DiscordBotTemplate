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
			CONNECTION_URI: string;
		}
	}
}

export type InteractionType = ChatInputCommandInteraction<CacheType> & {
	client: AppClient;
};

export type CommandData = {
	cooldown: number;
	data: SlashCommandBuilder;
	execute: (interaction: InteractionType) => Promise<void>;
};

export type AppClient = Client & {
	commands: Collection<string, CommandData>;
	cooldowns: Collection<string, Collection<string, number>>;
};

export type EventData = {
	name: keyof ClientEvents;
	once: boolean;
	execute: (client: AppClient, ...any: any[]) => Promise<void>;
};
