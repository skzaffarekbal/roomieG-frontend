import apiClient from './client';

export const sendRequestApi = async (status, userId) => {
  const response = await apiClient.post(`/request/send/${status}/${userId}`, {});
  return response.data;
};

export const getReceivedRequestsApi = async () => {
  const response = await apiClient.get('/user/request/received');
  return response.data;
};

export const reviewRequestApi = async (status, requestId) => {
  const response = await apiClient.post(`/request/review/${status}/${requestId}`, {});
  return response.data;
};
