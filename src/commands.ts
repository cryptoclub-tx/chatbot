import { ApplicationCommandOptionType, ChatInputCommandInteraction, ApplicationCommandData } from 'discord.js';

export type ChatInputCommandInteractionHandler = (interaction: ChatInputCommandInteraction) => Promise<void>;
export type AppCommandDefinition = ( ApplicationCommandData & { handler: ChatInputCommandInteractionHandler } );

export const commands: AppCommandDefinition[] = [
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
    handler: async (interaction: ChatInputCommandInteraction) => {
      const assetName = (interaction.options.getString('asset') || '').toLowerCase();
      const quoteCurrency = 'usd';
      const currencySymbol = '$';
      await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${assetName}&vs_currencies=${quoteCurrency}`)
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
