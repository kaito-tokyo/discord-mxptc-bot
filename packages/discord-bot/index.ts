import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";

import { loadDiscordPublicKey } from "./constants.js";
import { registerGlobalCommands } from "../registerGlobalCommands.js";

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
  const message: unknown = JSON.parse(req.body.toString());
  if (isApplicationCommandInteraction(message)) {
    if (message.data.name === "ping") {
      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Hello World!",
        },
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});
