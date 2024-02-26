import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import AuthPage, { LoginLoader } from "./pages/Auth";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AddContact from "./pages/AddContact";
import socket from "./socket";
import { userActions } from "./store/user";

let router;

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const onUserOnline = (userId) => {
      if (userId) {
        dispatch(userActions.addUserOnline(userId));
        dispatch(userActions.removeUserOffline(userId));
      }
    };

    const onUserOffline = (userId) => {
      if (userId) {
        dispatch(userActions.removeUserOnline(userId));
        dispatch(userActions.addUserOffline(userId));
      }
    };

    socket.current.on("user-online", onUserOnline);
    socket.current.on("user-offline", onUserOffline);

    return () => {
      if (socket.current.readyState === 1) {
        socket.current.off("user-online");
        socket.current.off("user-offline");
      }
    };
  }, [dispatch]);

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
              <Chat />
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
