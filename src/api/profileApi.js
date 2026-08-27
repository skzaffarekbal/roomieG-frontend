import apiClient from './client';

export const viewProfileApi = async () => {
  const response = await apiClient.get('/profile/view');
  return response.data;
};

export const editProfileApi = async (profileData) => {
  const response = await apiClient.patch('/profile/edit', profileData);
  return response.data;
};

export const getProfileCompletionApi = async () => {
  const response = await apiClient.get('/profile/completion');
  return response.data;
};
