import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from './store';
import { Provider } from 'react-redux'
import "./index.scss";
import "./styles.scss"
import ContextProviders from "./context";

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <Provider store={store}>

      <ContextProviders>
        <App />
      </ContextProviders>
    </Provider>
  </BrowserRouter>
);