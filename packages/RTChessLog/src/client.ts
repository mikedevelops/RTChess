import { request, GET } from "../../RTChessCore/src/Request/Request";
import Time from '../../RTChessCore/src/Time/Time';
import { sortByCreatedAtASC } from '../../RTChessCore/src/Utils/sort';
import Log, { LogLevel, SerialisedLog } from './Log/Log';
import Logger from './Log/Logger';

const container = document.getElementById("logs");
const filter = document.getElementById("filter-level");
const refresh = document.getElementById("refresh");
let filters: string[] = [LogLevel.INFO];
let logs: Log[] = [];

if (container === null) {
  throw new Error("There is no log container!");
}

if (filter === null) {
  throw new Error("There is no filter form!");
}

let lastLogDate: Time | null = null;

const printLog = (log: Log) => {
  if (filters.indexOf(log.getLevel()) === -1) {
    return;
  }

  const root = document.createElement("div");
  const type = document.createElement("pre");
  const level = document.createElement("pre");
  const time = document.createElement("pre");
  const message = document.createElement("pre");
  const data = document.createElement("pre");
  const createdAt = Time.from(new Date(log.getCreatedAt()));

  type.innerText = log.getSrc();
  level.innerText = log.getLevel();
  time.innerText = createdAt.formatShort();
  message.innerText = log.getMessage();

  root.setAttribute("class", `log ${log.getSrc()}`);

  root.appendChild(time);

  const delta = document.createElement("pre");

  delta.setAttribute("class", "delta");

  if (lastLogDate === null) {
    delta.innerText = `+0ms`;
  } else {
    delta.innerText = `+${createdAt.getDelta(lastLogDate)}ms`
  }
  root.appendChild(delta);

  root.appendChild(level);
  root.appendChild(type);
  root.appendChild(message);

  if (Object.keys(log.getData()).length) {
    data.innerText = JSON.stringify(log.getData());
    data.setAttribute("class", "data");
    root.appendChild(data);
  }

  container.appendChild(root);
  lastLogDate = createdAt;
};


filter.addEventListener("change", (event: any) => {
  if (event.target === null) {
    return;
  }

  if (event.target.checked && filters.indexOf(event.target.value) === -1) {
    filters.push(event.target.value);
    updateLocalLogs();

    return;
  }

  if (!event.target.checked && filters.indexOf(event.target.value) !== -1) {
    filters = filters.filter(level => level !== event.target.value);
    updateLocalLogs();

    return;
  }
});

const getLogs = () => {
  request(GET, "http://localhost:3000/logs").then(({ data }) => {
    const serialisedLogs = <unknown>data as SerialisedLog[];

    logs = serialisedLogs.map(Logger.deserialiseLog);
    updateLocalLogs();
  });
};

const clearLogs = () => {
  while(container.children.length) {
    container.children[0].remove();
  }
};

const updateLocalLogs = () => {
  clearLogs();

  logs.sort(sortByCreatedAtASC);
  logs.forEach(printLog);
};

getLogs();

if (refresh === null) {
  throw new Error("There is no refresh button!");
}

refresh.addEventListener("click", () => {
  getLogs();
});

