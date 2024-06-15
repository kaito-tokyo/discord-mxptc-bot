import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from "discord-interactions";
import express from "express";


const app = express();
const port = Number(process.env["PORT"] ?? 3000);

app.post(
  "/",
  verifyKeyMiddleware("e5bdebe3264718958fdc0fc10f15d124da3e4434b064a0568784db8d617f04ef"),
  async (req, res) => {
    const message = JSON.parse(req.body.toString());
    if (message.type === InteractionType.APPLICATION_COMMAND) {
      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Hello World!",
        },
      });
    }
  },
);

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});
