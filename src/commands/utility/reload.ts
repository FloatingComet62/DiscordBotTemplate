import { SlashCommandBuilder } from 'discord.js';
import { CommandData, InteractionType } from '../../interfaces';
import { loadCommand } from '../../loader';

const data = new SlashCommandBuilder()
	.setName('reload')
	.setDescription('Reload a command')
	.addStringOption((option) =>
		option
			.setName('command')
			.setDescription('The command to reload')
			.setRequired(true),
	);
const cooldown = 5;

async function execute(interaction: InteractionType) {
	const commandName = interaction.options
		.getString('command', true)
		.toLowerCase();
	const command = interaction.client.commands.get(commandName);

	if (!command) {
		return interaction.reply(
			`There is no command with name \`${commandName}\``,
		);
	}

	const commandFile = `./${command.data.name}.js`;
	delete require.cache[require.resolve(commandFile)];
	try {
		const newCommand = loadCommand(commandFile);
		interaction.client.commands.set(newCommand.data.name, newCommand);
		await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded`);
	} catch (error: any) {
		console.error(error);
		await interaction.reply(
			`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
		);
	}
}

export default { data, cooldown, execute } as CommandData;
