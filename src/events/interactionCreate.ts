import { Events, InteractionReplyOptions } from 'discord.js';
import { AppClient, EventData, InteractionType } from '../interfaces';

const name = Events.InteractionCreate;
const once = false;

async function execute(client: AppClient, interaction: InteractionType) {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands?.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		const options: InteractionReplyOptions = {
			content: 'There was an error while executing this command!',
			ephemeral: true,
		};
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(options);
		} else {
			await interaction.reply(options);
		}
	}
}

export default { name, once, execute } as EventData;
