import { REST } from "@discordjs/rest";
import {
  loadDiscordApplicationId,
  loadDiscordBotToken,
} from "./discord-bot/constants.js";
import { Routes } from "discord-api-types/v10";

import * as registerMatch from "./discord-bot/commands/registerMatch.js";

export async function registerGlobalCommands() {
  const discordApplicationId = loadDiscordApplicationId();
  const discordBotToken = await loadDiscordBotToken();

  const rest = new REST({ version: "v10" }).setToken(discordBotToken);
  await rest.put(Routes.applicationCommands(discordApplicationId), {
    body: [registerMatch.data],
  });
}
