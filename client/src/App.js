import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login, { loader } from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";

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
    path: "/login",
    element: <Login />,
    loader: loader,
  },
  {
    path: "/register",
    element: <Register />,
    loader: loader,
  },
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
