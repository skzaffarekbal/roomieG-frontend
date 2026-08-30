import apiClient from './client';

export const getUnreadChatsCountApi = async () => {
  const response = await apiClient.get('/user/unread-chats-count');
  return response.data;
};
