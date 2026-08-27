import apiClient from './client';

export const verifyPremiumApi = async () => {
  const response = await apiClient.get('/premium/verify');
  return response.data;
};

export const createPaymentOrderApi = async (membershipType) => {
  const response = await apiClient.post('/payment/create', { membershipType });
  return response.data;
};
