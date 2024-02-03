export const setAuthToken = (token) => {
  localStorage.setItem("chat-app-user-token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("chat-app-user-token");
};

export const getAuthToken = () => {
  return localStorage.getItem("chat-app-user-token");
};