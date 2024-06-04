import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { CommandData } from './interfaces';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
            GUILD_ID: string;
        }
    }
}

config();

const commands: any[] = []
const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath) as CommandData;
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Start refreshing ${commands.length} application (/) commands`);
        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        ) as any[];
        console.log(`Successfully reloaded ${data.length} applications (/) commands`);
    } catch (error) {
        console.error(error)
    }
})();