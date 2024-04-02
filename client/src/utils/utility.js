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

export const userAvatar = (userData) => {
  const avatarImage = userData
    ? userData.avatarImage
      ? `data:image/svg+xml;base64,${userData.avatarImage}`
      : "https://www.gravatar.com/avatar/000?d=mp"
    : "https://www.gravatar.com/avatar/000?d=mp";
  return avatarImage;
};

export const statOptions = {
  backgroundColor: [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
  ],
  borderColor: [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ],
};
