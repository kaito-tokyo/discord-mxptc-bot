import { InteractionResponseType } from "discord-interactions";
import express from "express";

import { verify } from "./validator.js";

const app = express();
const port = Number(process.env["PORT"] ?? 3000);

app.post("/", express.raw(), async (req, res) => {
  const isValidRequest = await verify(req, req.body);
  if (!isValidRequest) {
    res.status(401);
    res.send("Bad sigunature!");
    return;
  }

  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "Hello World!"
    }
  });
});

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});
