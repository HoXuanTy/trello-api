import express, { Express, Request, Response } from "express";
const app: Express = express()

const hostname = "localhost";
const post = 8000;

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World");
});

app.listen(post, hostname, () => {
  console.log(`I'm running server at http://${hostname}:${post}/`);
})