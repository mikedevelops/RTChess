import express from "express";
import Logger from "./Log/Logger";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

new Logger();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const client = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>RTChess Logs</title>
    <style>
        * { margin: 0; padding: 0; }
        pre { display: inline-block; padding: 0.5rem; font-weight: bold; }
        body { padding: 1rem; }

        .log {
            display: flex;
        }

        .delta {
            width: 3rem;
        }

        .data {
            margin-left: auto;
        }

        .SERVER {
            background-color: rgba(255, 209, 102, 0.5);
        }

        .CLIENT {
            background-color: rgba(6, 214, 160, 0.5);
        }

        #filter-level {
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <form id="filter-level">
        <label>info: <input type="checkbox" value="INFO" checked/></label>
        <label>event: <input type="checkbox" value="EVENT"/></label>
        <label>verbose: <input type="checkbox" value="VERBOSE"/></label>
    </form>
    <button id="refresh">Refresh</button>
    <div id="logs"></div>
    <script src="logs.js"></script>
</body>
</html>
`;

app.get("/", (request, response) => {
  response.send(client);
});

app.get("/logs", (request, response) => {
  response.json(Logger.instance.getHistory().map(log => log.serialise()));
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
