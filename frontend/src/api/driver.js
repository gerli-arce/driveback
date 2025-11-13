import apiClient from './httpClient';

const unwrap = (payload) => (payload?.data ? payload.data : payload);

export const toggleAvailability = async (isAvailable) => {
  const { data } = await apiClient.post('/driver/availability', { is_available: isAvailable });
  return unwrap(data);
};

export const fetchAvailableTrips = async () => {
  const { data } = await apiClient.get('/driver/trips/available');
  return data;
};

export const fetchAssignedTrips = async () => {
  const { data } = await apiClient.get('/driver/trips/assigned');
  return data;
};

export const fetchDriverTrip = async (tripId) => {
  const { data } = await apiClient.get(`/driver/trips/${tripId}`);
  return data;
};

export const acceptTrip = async (tripId) => {
  const { data } = await apiClient.post(`/driver/trips/${tripId}/accept`);
  return data;
};

export const rejectTrip = async (tripId) => {
  const { data } = await apiClient.post(`/driver/trips/${tripId}/reject`);
  return data;
};

export const startTrip = async (tripId) => {
  const { data } = await apiClient.post(`/driver/trips/${tripId}/start`);
  return data;
};

export const completeTrip = async (tripId) => {
  const { data } = await apiClient.post(`/driver/trips/${tripId}/complete`);
  return data;
};
