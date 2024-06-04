import {
	CacheType,
	ChatInputCommandInteraction,
	SlashCommandBuilder
} from 'discord.js';

export type InteractionType = ChatInputCommandInteraction<CacheType>;

export interface CommandData {
	data: SlashCommandBuilder;
	execute: (interaction: InteractionType) => Promise<void>;
}
