import apiClient from './client';

export const getConnectionsApi = async () => {
  const response = await apiClient.get('/user/connections');
  return response.data;
};
