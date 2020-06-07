import { IncomingMessage } from 'http';

export interface Response {
  data: string;
}

export interface RequestParams {
  [index: string]: string;
}

const isBrowserEnv = () => {
  try {
    return window !== undefined;
  } catch (err) {
    return false;
  }
}

export const request = (url: string, data: RequestParams = {}): Promise<Response> => {
  if (isBrowserEnv()) {
    return clientRequest(url, data);
  }

  return serverRequest(url, data);
};

const serverRequest = (endpoint: string, data: RequestParams): Promise<Response> => {
  const http = require("http");
  const url = require("url");
  const agent = new http.Agent({ keepAlive: true });

  return new Promise((resolve, reject) => {
    let serialisedData;

    try {
      serialisedData = JSON.stringify(data);
    } catch(error) {
      reject(new Error(`Unable to serialise request data "${data}"`));
      return;
    }

    const req = http.request({
      agent ,
      host: "localhost",
      protocol: "http:",
      port: 3000,
      method: 'POST',
      path: url.parse(endpoint).path,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(serialisedData)
      }
    }, (res: IncomingMessage) => {
      res.on("end", () => {
        resolve();
      });

    });

    req.on("error", (error: Error) => {
      reject(error);
    });

    // TODO: we are not handling responseText at all

    req.write(serialisedData);
    req.end();
  });
};

const clientRequest = (url: string, data: RequestParams): Promise<Response> => {
  const req = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    let serialisedData;

    try {
      serialisedData = JSON.stringify(data);
    } catch(error) {
      reject(new Error(`Unable to serialise request data ${data}`));
      return;
    }

    const res = () => {
      if (req.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      if (req.status === 200) {
        if (req.responseText === "OK") {
          resolve();
          return;
        }

        try {
          resolve(JSON.parse(req.responseText));
        } catch(error) {
          reject(new Error(`Unable to parse response text as JSON "${req.responseText}"`));
        }
        return;
      } else {
        reject(new Error(`Got a bad status from the log server "${req.status}"`));
        return;
      }
    }

    req.onreadystatechange = res;
    req.open("POST", url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(serialisedData);
  });
}
