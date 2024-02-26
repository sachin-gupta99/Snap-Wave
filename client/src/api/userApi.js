import axiosInstance from "./axiosInstance";

export const setAvatarRoute = (userId, avatar) => {
  return axiosInstance.post(`/api/user/set-avatar/${userId}`, avatar);
};

export const getAllUsersRoute = () => {
  return axiosInstance.get("/api/user/users");
};

export const getUserRoute = (userId) => {
  return axiosInstance.get(`/api/user/user/${userId}`);
};

export const addContactRoute = (userId, contactId) => {
  return axiosInstance.post(`/api/user/add-contact/${userId}`, contactId);
};

export const searchUserRoute = (email) => {
  return axiosInstance.get(`/api/user/email/${email}`);
};

export const getUserBasicRoute = (userId) => {
  return axiosInstance.get(`/api/user/user/basic/${userId}`);
};

export const getContactsRoute = (userId) => {
  return axiosInstance.get(`/api/user/contacts/${userId}`);
};
