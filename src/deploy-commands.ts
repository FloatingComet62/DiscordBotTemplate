import {
	REST,
	RESTPostAPIChatInputApplicationCommandsJSONBody as commandJSONData,
	Routes,
} from 'discord.js';
import { config } from 'dotenv';
import { iterateCommands } from './loader';

config();

const commands: commandJSONData[] = [];

iterateCommands((_, command) => {
	commands.push(command.data.toJSON());
});

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Start refreshing ${commands.length} application (/) commands`);
		const data = (await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID,
			),
			{ body: commands },
		)) as any[];
		console.log(
			`Successfully reloaded ${data.length} applications (/) commands`,
		);
	} catch (error) {
		console.error(error);
	}
})();
