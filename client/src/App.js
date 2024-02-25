import React from "react";
import { useState, useEffect } from "react";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthPage, { LoginLoader } from "./pages/Auth";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import AddContact from "./pages/AddContact";
import socket from "./socket";

let router;

const App = () => {
  const [userOnline, setUserOnline] = useState([]);
  useEffect(() => {
    // const onUserOnline = ;

    const onUserOffline = (userId) => {
      setUserOnline((prev) => prev.filter((id) => id !== userId));
    };

    socket.current.on("user-online", (userId) => {
      if (userId) {
        setUserOnline((prev) => {
          if (!prev.includes(userId)) {
            console.log([...prev, userId]);
            return [...prev, userId];
          }
          return prev;
        });
        // setUserOnline(["65d03e88a53075016b4ec66e", "60d03e88a53075016b4ec66e"]);
      }
    });
    socket.current.on("user-offline", (userId) => onUserOffline(userId));

    return () => {
      if (socket.current.readyState === 1) {
        socket.current.off("user-online");
        socket.current.off("user-offline");
      }
    };
  }, []);

  router = createBrowserRouter([
    {
      path: "/auth", // /auth?mode=login or /auth?mode=register
      element: <AuthPage />,
      loader: LoginLoader,
    },
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
              <Chat userOnline={userOnline} socket={socket} />
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
export { router };
