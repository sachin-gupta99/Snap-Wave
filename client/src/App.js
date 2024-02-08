import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { LoginLoader } from "./pages/Auth";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: "/setAvatar",
        element: (
          <ProtectedRoute>
            <SetAvatar />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth", // /auth?mode=login or /auth?mode=register
    element: <AuthPage />,
    loader: LoginLoader,
  },
  // {
  //   path: "/auth?mode=register",
  //   element: <AuthPage />,
  //   loader: LoginLoader,
  // },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
