import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/setAvatar",
        element: <SetAvatar />,
      }
    ],
  },
]);

const App = () => {
  return <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
};

export default App;
