import { REST } from "@discordjs/rest";
import {
  loadDiscordApplicationId,
  loadDiscordBotToken,
} from "./constants.js";
import { Routes } from "discord-api-types/v10";

import * as registerMatch from "./commands/registerMatch.js";

export async function registerGlobalCommands() {
  const discordApplicationId = loadDiscordApplicationId();
  const discordBotToken = await loadDiscordBotToken();

  const rest = new REST({ version: "v10" }).setToken(discordBotToken);
  await rest.put(Routes.applicationCommands("1251084776194969653"), {
    body: [registerMatch.data],
  });
}
