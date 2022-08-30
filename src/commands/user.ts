import { MessageComponentInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info!');
export const needClient = false;
    
export async function execute(interaction: MessageComponentInteraction): Promise<void> {
    await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
}