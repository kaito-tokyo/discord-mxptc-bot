import express from "express";

import { verify } from "./validator.js";

const app = express();
const port = Number(process.env["PORT"] ?? 3000);

app.use(express.raw());

app.get("/", async (req, res) => {
  const isValidRequest = await verify(req, req.body);
  if (!isValidRequest) {
    res.status(401);
    res.send("Bad sigunature!");
    return;
  }

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
});
