
import { AxiosError, CanceledError } from "axios";
import { client } from "./client.js";
import { handleRequest } from "../../server/mockApi.js";

const DELAY = 100; // small delay so the loaders are visible, like the dev server

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function browserAdapter(config) {
  await wait(DELAY);
  if (config.signal?.aborted) throw new CanceledError(null, config);

  const [status, data] = handleRequest({
    method: (config.method || "get").toUpperCase(),
    url: client.getUri(config), // e.g. /api/packages?destination=goa
    body: config.data ? JSON.parse(config.data) : null,
    headers: config.headers.toJSON(),
  });

  const response = {
    data: JSON.parse(JSON.stringify(data)), // a copy, like a real network response
    status,
    statusText: String(status),
    headers: {},
    config,
    request: {},
  };

  if (status >= 200 && status < 300) return response;

  const code = status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST;
  throw new AxiosError(`Request failed with status code ${status}`, code, config, {}, response);
}

export function startBrowserApi() {
  client.defaults.adapter = browserAdapter;
}
