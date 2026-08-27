import apiClient from './client';

export const loginApi = async ({ emailId, password }) => {
  const response = await apiClient.post('/login', { emailId, password });
  return response.data;
};

export const registerApi = async ({ firstName, lastName, emailId, password }) => {
  const response = await apiClient.post('/register', {
    firstName,
    lastName,
    emailId,
    password,
  });
  return response.data;
};

export const logoutApi = async () => {
  const response = await apiClient.post('/logout', {});
  return response.data;
};
