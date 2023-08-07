import { REST, Routes } from 'discord.js';

export const discordRegisterCommands = (rest:REST, appId:string, commands: any[]) => {
  return rest.put(Routes.applicationCommands(appId), {
    body: commands,
  })
}
