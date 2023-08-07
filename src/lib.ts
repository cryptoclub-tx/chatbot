import { REST, Routes } from 'discord.js';
import { AppCommandDefinition } from './commands';

export const discordRegisterCommands = (rest:REST, appId:string, commands: ReadonlyArray<Readonly<AppCommandDefinition>>) => {
  return rest.put(Routes.applicationCommands(appId), {
    body: commands,
  })
}
