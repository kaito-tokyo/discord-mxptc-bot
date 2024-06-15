import express from "express";

const app = express();
const port = Number(process.env["PORT"] ?? 3000);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listing on port ${port}`);
})