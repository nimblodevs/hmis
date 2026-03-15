import axiosClient from './axiosClient';

export const patientApi = {
  getPatients: () => axiosClient.get('/patients'),
  getPatientById: (id) => axiosClient.get(`/patients/${id}`),
  createPatient: (data) => axiosClient.post('/patients', data),
  updatePatient: (id, data) => axiosClient.put(`/patients/${id}`, data),
};
