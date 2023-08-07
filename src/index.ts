import { Client } from 'discord.js';
import { REST } from 'discord.js';
import { discordRegisterCommands } from './lib';
import config from './config';
import commands from './commands';

// Create Discord REST client
const discordRest = new REST({
  version: '10'
}).setToken(config.discord.token)

// Create Discord socket client
const client = new Client({
  intents: [],
})

// Fires when Discord socket is ready
client.on('ready', async () => {
  await discordRegisterCommands(discordRest, config.discord.application_id, commands);
  console.log('Successfully registered commands');
  console.log(`Join bot to Discord server @ https://discordapp.com/api/oauth2/authorize?scope=bot&client_id=${config.discord.application_id}`);
})

// Handles commands from chat input
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const interactionCommand = commands.find(c => c.name === interaction.commandName);
  interactionCommand.handler(interaction);
})

// Start the Discord client
client.login(config.discord.token);

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Application is shutting down');
  await client.destroy()
}

['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => {
  console.log(`Got signal ${sig}`);
  return shutdown();
}))
