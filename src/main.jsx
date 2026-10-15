import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./store/index.js";
import "./index.css";
import { registerServiceWorker } from "./registerSW.js";
import { startBrowserApi } from "./api/browserApi.js";

// Deployed build: there is no server, so the API runs inside the browser.
if (import.meta.env.PROD) startBrowserApi();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* BASE_URL is "/" normally and "/repo-name/" on GitHub Pages */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

registerServiceWorker();
