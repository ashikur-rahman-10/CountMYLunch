import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./Pages/Login&Registration/Login";
import routers from "./Pages/routes/routers";
import "./firebase/firebase.config";
import app from "./firebase/firebase.config";
import AuthProviders from "./Providers/AuthProviders";
import { HelmetProvider } from "react-helmet-async";

console.log(app)


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProviders>
            <HelmetProvider>
                <RouterProvider router={routers} />
                {/* <App></App> */}
            </HelmetProvider>
        </AuthProviders>
  </React.StrictMode>
);
