import { MessageComponentInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with "Pong!');
export const needClient = false;

export async function execute(interaction: MessageComponentInteraction){
    await interaction.reply('Pong!');
}