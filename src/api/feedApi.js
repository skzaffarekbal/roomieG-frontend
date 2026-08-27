import apiClient from './client';

export const getFeedApi = async () => {
  const response = await apiClient.get('/feed');
  return response.data;
};
