import { Client, ApplicationCommandOptionType } from 'discord.js';
import { REST } from 'discord.js';
import { discordRegisterCommands } from './lib';
import config from './config';

const commands = [
  {
    name: 'cryptoprice',
    description: 'Fetches USD price of asset from CoinGecko',
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: 'asset',
        description: 'Unique name of asset listed on CoinGecko',
        required: true
      },
    ]
  },
]

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

  if(interaction.commandName === 'ping'){
    await interaction.reply('pong');
  }
  if(interaction.commandName === 'cryptoprice'){
    const assetName = (interaction.options.getString('asset') || '').toLowerCase();
    const quoteCurrency = 'usd';
    const currencySymbol = '$';
    return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${assetName}&vs_currencies=${quoteCurrency}`)
      .then( async resp => {
        const priceData = await resp.json();
        const pricePer = priceData[assetName][quoteCurrency];
        await interaction.reply(`1 ${assetName} = ${currencySymbol}${pricePer}`);
      })
      .catch(async err => {
        console.error(err);
        await interaction.reply('An unexpected error has occurred. Please try agian later.')
      })
  }

})

// Start the Discord client
client.login(config.discord.token);
