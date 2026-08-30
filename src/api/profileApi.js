import apiClient from './client';

export const viewProfileApi = async () => {
  const response = await apiClient.get('/profile/view');
  return response.data;
};

export const getProfileCompletionApi = async () => {
  const response = await apiClient.get('/profile/completion');
  return response.data;
};

export const updateBasicProfileApi = async (data) => {
  const response = await apiClient.patch('/profile/basic', data);
  return response.data;
};

export const updateOccupationApi = async (data) => {
  const response = await apiClient.patch('/profile/occupation', data);
  return response.data;
};

export const updateLocationApi = async (data) => {
  const response = await apiClient.patch('/profile/location', data);
  return response.data;
};

export const updateLifestyleApi = async (data) => {
  const response = await apiClient.patch('/profile/lifestyle', data);
  return response.data;
};

export const updateHousingApi = async (data) => {
  const response = await apiClient.patch('/profile/housing', data);
  return response.data;
};

export const updatePhotoApi = async (data) => {
  const response = await apiClient.patch('/profile/photo', data);
  return response.data;
};

export const updatePreferencesApi = async (data) => {
  const response = await apiClient.patch('/profile/preferences', data);
  return response.data;
};

export const updatePrivacyApi = async (data) => {
  const response = await apiClient.patch('/profile/privacy', data);
  return response.data;
};

export const updatePasswordApi = async (data) => {
  const response = await apiClient.patch('/profile/password', data);
  return response.data;
};

export const editProfileApi = async (profileData) => {
  const response = await apiClient.patch('/profile/edit', profileData);
  return response.data;
};
