import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';

export const commands = [
  {
    name: 'cryptoprice',
    description: 'Fetches USD price of asset from CoinGecko',
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: 'asset',
        description: 'Unique name of asset listed on CoinGecko',
        required: true,
      },
    ],
    handler: (interaction: ChatInputCommandInteraction) => {
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
  },
]

export default commands;
