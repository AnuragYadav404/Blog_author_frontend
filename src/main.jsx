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
import EditPost from "./components/EditPost.jsx";
import SignUpPage from "./components/SignUpPage.jsx";

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
        path: "accounts/login",
        element: <LoginPage />,
      },
      {
        path: "accounts/logout",
        element: <LogoutPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "accounts/signup",
        element: <SignUpPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "articles/all",
        element: <UserArticlesList />,
        errorElement: <ErrorPage />,
      },
      {
        path: "articles/new",
        element: <CreateArticle />,
        errorElement: <ErrorPage />,
      },
      {
        path: "articles/:post_id",
        element: <PostPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "articles/:post_id/edit",
        element: <EditPost />,
        errorElement: <ErrorPage />,
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
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
