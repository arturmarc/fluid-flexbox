import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./dom/FlexWrapDetectorElement.ts";

ReactDOM.createRoot(document.getElementById("react-root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
