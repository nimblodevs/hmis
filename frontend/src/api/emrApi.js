import axiosClient from './axiosClient';

export const emrApi = {
  getNotes: (patientId) => axiosClient.get(`/emr/${patientId}/notes`),
  addNote: (patientId, data) => axiosClient.post(`/emr/${patientId}/notes`, data),
  
  getVitals: (patientId) => axiosClient.get(`/emr/${patientId}/vitals`),
  addVitals: (patientId, data) => axiosClient.post(`/emr/${patientId}/vitals`, data),
  
  getDiagnoses: (patientId) => axiosClient.get(`/emr/${patientId}/diagnoses`),
  addDiagnosis: (patientId, data) => axiosClient.post(`/emr/${patientId}/diagnoses`, data),
  
  getMedications: (patientId) => axiosClient.get(`/emr/${patientId}/medications`),
  addMedication: (patientId, data) => axiosClient.post(`/emr/${patientId}/medications`, data),
};
