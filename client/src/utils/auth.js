import { redirect } from "react-router-dom";

export const setAuthToken = (token) => {
  localStorage.setItem("chat-app-user-token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("chat-app-user-token");
};

export const getAuthToken = () => {
  return localStorage.getItem("chat-app-user-token");
};

export const checkAuthToken = () => {
  const token = getAuthToken();
  if (!token) {
    return redirect("/login");
  } else {
    return redirect("/");
  }
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (token) {
    return redirect("/");
  }
  return token ? true : false;
};
