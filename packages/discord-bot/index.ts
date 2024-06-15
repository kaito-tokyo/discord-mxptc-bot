import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { InteractionType, verifyKeyMiddleware } from "discord-interactions";
import express from "express";

import { loadDiscordPublicKey } from "./constants.js";
import { registerGlobalCommands } from "./registerGlobalCommands.js";
import * as match from "./commands/match.js";

function isApplicationCommandInteraction(
  message: unknown,
): message is APIApplicationCommandInteraction {
  if (!message || typeof message !== "object" || !("type" in message)) {
    return false;
  }
  return message.type === InteractionType.APPLICATION_COMMAND;
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
});

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});
