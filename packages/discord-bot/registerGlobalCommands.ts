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

  const rest = new REST({ version: "10" }).setToken(discordBotToken);
  await rest.put(Routes.applicationCommands(discordApplicationId), {
    body: [registerMatch.data.toJSON()],
  });
}
