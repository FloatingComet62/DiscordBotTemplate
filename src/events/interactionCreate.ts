import { MessageComponentInteraction } from "discord.js";
import { customClient } from '../interfaces';

export const name = 'interactionCreate';
export const once = false;
export const needClient = true;

export async function execute(client: customClient, interaction: MessageComponentInteraction): Promise<void> {
    if (!interaction.isCommand()) return;
    const command = client.commands?.get(interaction.commandName);
    if(!command) return;
    try{
        if(command.needClient) await command.execute(interaction, client);
        else await command.execute(interaction);
    }catch{
        console.error(Error);
        await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true 
        });
    }
}