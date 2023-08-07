import { Client } from 'discord.js';
import { REST } from 'discord.js';
import { discordRegisterCommands } from './lib';
import config from './config';
import commands from './commands';
import * as Http from 'http';
import * as PromClient from 'prom-client';

if(config.metrics.enable_default){
  PromClient.collectDefaultMetrics()
}

// Create HTTP server
const server = Http.createServer(async (req, res) => {
  if(req.url == '/favicon.ico'){
    res.writeHead(404);
    return res.end();
  }
  else if(req.url == '/healthz'){
    res.writeHead(200);
    return res.end('ok');
  }
  else if(req.url == '/metrics'){
    try {
      const metrics = await PromClient.register.metrics();
      res.writeHead(200);
      return res.end(metrics);
    }
    catch(err){
      console.error(err);
      res.writeHead(500);
      return res.end('An unexpected error has occurred.');
    }
  }
  res.writeHead(404);
  return res.end('404 - not found');
})

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

server.listen(config.http.port, () => {
  console.log('Server listening on port', config.http.port);
  // Start the Discord client
  client.login(config.discord.token);
})

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Application is shutting down');
  try {
    console.log('Stopping discord client');
    await client.destroy()
  }
  catch(err){
    console.error(err);
    process.exit(1);
  }
  console.log('Stopping HTTP service');
  server.close((err) => {
    if(err){
      console.error(err);
      process.exit(1);
    }
  })
}

['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => {
  console.log(`Got signal ${sig}`);
  return shutdown();
}))
