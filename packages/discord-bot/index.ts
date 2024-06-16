import {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  InteractionType,
} from "discord-api-types/v10";
import { verifyKeyMiddleware } from "discord-interactions";
import express from "express";

import { loadDiscordPublicKey } from "./constants.js";
import { registerGlobalCommands } from "./registerGlobalCommands.js";
import * as match from "./commands/match.js";

function isApplicationCommandInteraction(
  message: unknown,
): message is APIChatInputApplicationCommandInteraction {
  if (!message || typeof message !== "object" || !("type" in message)) {
    return false;
  }
  return message.type === InteractionType.ApplicationCommand;
}

function isApplicationCommandAutocompleteInteraction(
  message: unknown,
): message is APIApplicationCommandAutocompleteInteraction {
  if (!message || typeof message !== "object" || !("type" in message)) {
    return false;
  }
  return message.type === InteractionType.ApplicationCommandAutocomplete;
}

registerGlobalCommands();

const app = express();
const port = Number(process.env["PORT"] ?? 3000);

app.post("/", verifyKeyMiddleware(loadDiscordPublicKey()), async (req, res) => {
  const { body: message } = req;
  if (isApplicationCommandInteraction(message)) {
    if (message.data.name === match.data.name) {
      await match.execute(message, res);
    }
  }
  if (isApplicationCommandAutocompleteInteraction(message)) {
    if (message.data.name === match.data.name) {
      await match.autocomplete(message, res);
    }
  }
});

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});
