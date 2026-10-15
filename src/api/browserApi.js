// The deployed site has no server (GitHub Pages, Netlify and Vercel host static files here),
// so in the production build the "backend" runs inside the browser.
// This replaces Axios's network step with a call to the same handleRequest()
// function that the Vite dev server uses. The rest of the app does not change.
import { AxiosError, CanceledError } from "axios";
import { client } from "./client.js";
import { handleRequest } from "../../server/mockApi.js";

const DELAY = 500; // small delay so the loaders are visible, like the dev server

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
