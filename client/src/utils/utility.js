export const setAuthToken = (token) => {
  localStorage.setItem("chat-app-user-token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("chat-app-user-token");
};

export const getAuthToken = () => {
  return localStorage.getItem("chat-app-user-token");
};

export const toastOptions = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  progress: undefined,
};