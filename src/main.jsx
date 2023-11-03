import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import HomePage from "./components/HomePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "accounts",
        children: [
          { path: "login", element: <h2>Login Page</h2> },
          { path: "logout", element: <h2>Logout Page</h2> },
          { path: "signup", element: <h2>Sign-up Page</h2> },
        ],
        errorElement: <ErrorPage />,
      },
      {
        path: "articles",
        children: [
          {
            path: "all",
            element: <h2>List of all the articles by the user</h2>,
          },
          {
            path: "new",
            element: <h2>New Article route</h2>,
          },
        ],
      },
    ],
  },
]);

// append redux provider here at root
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
