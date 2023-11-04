import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import LogoutPage from "./components/LogoutPage.jsx";
import UserArticlesList from "./components/UserArticlesList.jsx";
import CreateArticle from "./components/CreateArticle.jsx";
import PostPage from "./components/PostPage.jsx";

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
          { path: "login", element: <LoginPage /> },
          { path: "logout", element: <LogoutPage /> },
          { path: "signup", element: <h2>Sign-up Page</h2> },
        ],
        errorElement: <ErrorPage />,
      },
      {
        path: "articles",
        children: [
          {
            path: "all",
            element: <UserArticlesList />,
            errorElement: <ErrorPage />,
          },
          {
            path: "new",
            element: <CreateArticle />,
          },
          {
            path: ":post_id",
            element: <PostPage />,
          },
        ],
      },
    ],
  },
]);
/********
 * 
 new article
 view article
 edit article
 */
// append redux provider here at root
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
