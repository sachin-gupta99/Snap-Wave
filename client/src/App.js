import React, { useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthPage, { LoginLoader } from "./pages/Auth";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import AddContact from "./pages/AddContact";

const App = () => {
  const socket = useRef();
  const router = createBrowserRouter([
    {
      path: "/",
      id: "root",
      element: (
        <ProtectedRoute>
          <Home socket={socket}/>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/chat",
          element: (
            <ProtectedRoute>
              <Chat socket={socket} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/add-contact",
          element: (
            <ProtectedRoute>
              <AddContact />
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
    {
      path: "*",
      element: <div>Not Found</div>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
