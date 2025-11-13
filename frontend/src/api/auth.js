import apiClient from './httpClient';

export const loginRequest = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
};

export const registerRequest = async (payload) => {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
};

export const logoutRequest = async () => {
  await apiClient.post('/auth/logout');
};

export const profileRequest = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};
