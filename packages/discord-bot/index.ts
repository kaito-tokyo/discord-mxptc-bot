import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";

const app = express();
const port = Number(process.env["PORT"] ?? 3000);

function isApplicationCommandInteraction(
  message: unknown,
): message is APIApplicationCommandInteraction {
  if (!message || typeof message !== "object" || !("type" in message)) {
    return false;
  }
  return message.type === InteractionType.APPLICATION_COMMAND;
}

app.post(
  "/",
  verifyKeyMiddleware(
    "e5bdebe3264718958fdc0fc10f15d124da3e4434b064a0568784db8d617f04ef",
  ),
  async (req, res) => {
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
  },
);

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});
