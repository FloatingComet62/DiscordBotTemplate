import { Collection, Events, InteractionReplyOptions } from 'discord.js';
import { AppClient, EventData, InteractionType } from '../interfaces';

const name = Events.InteractionCreate;
const once = false;

async function execute(client: AppClient, interaction: InteractionType) {
	if (!interaction.isChatInputCommand()) return;
	const { commands, cooldowns } = client;

	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found`);
		return;
	}

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name)!;
	const cooldownAmount = command.cooldown * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime =
			(timestamps.get(interaction.user.id) || 0) + cooldownAmount;

		if (expirationTime > now) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({
				content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
				ephemeral: true,
			});
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

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
