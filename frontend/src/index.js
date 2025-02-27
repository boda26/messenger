import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./main.scss";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { positions, transitions } from "react-alert";
import { Provider as AlertProvider } from "react-alert/dist/esm/react-alert.js";
import alertTemplate from "react-alert-template-basic";

const options = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    transition: transitions.SCALE,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <AlertProvider template={alertTemplate} {...options}>
            <App />
        </AlertProvider>
    </Provider>
);