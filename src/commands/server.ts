import { MessageComponentInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!');
export const needClient = false;
    
export async function execute(interaction: MessageComponentInteraction){
    await interaction.reply(`Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`);
}