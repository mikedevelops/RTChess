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

export const POST = "POST";
export const GET = "GET";

export const request = (method: string, url: string, data: RequestParams = {}): Promise<Response> => {
  if (isBrowserEnv()) {
    return clientRequest(method, url, data);
  }

  return serverRequest(method, url, data);
};

const serverRequest = (method: string, endpoint: string, data: RequestParams): Promise<Response> => {
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
      method: method,
      path: url.parse(endpoint).path,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(serialisedData)
      }
    }, (res: IncomingMessage) => {
      let responseData = "";

      res.on("end", () => {
        resolve({ data: responseData });
      });

      res.on("data", chunk => {
        responseData += chunk;
      });
    });

    req.on("error", (error: Error) => {
      reject(error);
    });

    req.write(serialisedData);
    req.end();
  });
};

const clientRequest = (method: string, url: string, data: RequestParams): Promise<Response> => {
  const req = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    let serialisedData;

    try {
      serialisedData = JSON.stringify(data);
    } catch(error) {
      reject(new Error(`Unable to serialise request data ${data}`));
      return;
    }

    let responseData = "";

    const res = () => {
      if (req.readyState !== XMLHttpRequest.DONE) {
        responseData += req.responseText;
        return;
      }

      if (req.status === 200) {
        if (req.responseText === "OK") {
          resolve();
          return;
        }

        try {
          resolve({ data: JSON.parse(responseData) });
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
    req.open(method, url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(serialisedData);
  });
}
