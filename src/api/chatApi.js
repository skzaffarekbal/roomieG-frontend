import apiClient from './client';

export const getTargetUserProfileApi = async (targetUserId) => {
  const response = await apiClient.get(`/user/profile/${targetUserId}`);
  return response.data;
};

export const getUnreadChatsCountApi = async () => {
  const response = await apiClient.get('/user/unread-chats-count');
  return response.data;
};
