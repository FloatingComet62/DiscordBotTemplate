import { SlashCommandBuilder } from 'discord.js';
import { CommandData, InteractionType } from '../../interfaces';

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong');
const cooldown = 5

async function execute(interaction: InteractionType) {
	await interaction.reply('Pong');
}

export default { data, cooldown, execute } as CommandData;
