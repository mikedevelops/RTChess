import express from "express";
import Logger from "./Log/Logger";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

new Logger();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.json(Logger.instance.getHistory());
});

app.post("/log", (request, response) => {
  const { log } = request.body;
  let serialisedLog;

  try {
    serialisedLog = JSON.parse(log as string);
  } catch (err) {
    console.log(`Unable to parse log "${log}"`);
    response.sendStatus(200);
    return;
  }

  Logger.instance.hydrate(serialisedLog);
  response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Log Server listening on ", PORT);
});
