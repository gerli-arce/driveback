import apiClient from './httpClient';

export const fetchPassengerTrips = async () => {
  const { data } = await apiClient.get('/passenger/trips');
  return data;
};

export const requestTrip = async (payload) => {
  const { data } = await apiClient.post('/passenger/trips', payload);
  return data;
};

export const rateTrip = async (tripId, rating) => {
  const { data } = await apiClient.post(`/passenger/trips/${tripId}/rate`, { rating });
  return data;
};
