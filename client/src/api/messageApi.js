import axiosInstance from "./axiosInstance";

export const sendMessageRoute = (data) => {
  return axiosInstance.post("/api/message/send-message", data);
};

export const getMessagesRoute = (data) => {
  return axiosInstance.post(`/api/message/get-messages/`, data);
};
