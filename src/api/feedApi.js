import apiClient from './client';

export const getFeedApi = async () => {
  const response = await apiClient.get('/feed');
  return response.data;
};

export const getTargetUserProfileApi = async (targetUserId) => {
  const response = await apiClient.get(`/user/profile/${targetUserId}`);
  return response.data;
};
