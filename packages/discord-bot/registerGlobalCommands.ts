import { REST } from "@discordjs/rest";
import { loadDiscordApplicationId, loadDiscordBotToken } from "./constants.js";
import { Routes } from "discord-api-types/v10";

import * as match from "./commands/match.js";

export async function registerGlobalCommands() {
  const discordApplicationId = loadDiscordApplicationId();
  const discordBotToken = await loadDiscordBotToken();

  const rest = new REST({ version: "10" }).setToken(discordBotToken);
  await rest.put(Routes.applicationCommands(discordApplicationId), {
    body: [match.data.toJSON()],
  });
}
