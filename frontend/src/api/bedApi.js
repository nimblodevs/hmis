import axiosClient from './axiosClient';

export const bedApi = {
  getWards: () => axiosClient.get('/wards'),
  createWard: (data) => axiosClient.post('/wards', data),
  
  getBeds: (wardId = '') => axiosClient.get(wardId ? `/beds?ward=${wardId}` : '/beds'),
  createBed: (data) => axiosClient.post('/beds', data),
  updateBedStatus: (id, status) => axiosClient.patch(`/beds/${id}`, { status }),
  
  getAdmissions: () => axiosClient.get('/admissions'),
  admitPatient: (data) => axiosClient.post('/admissions', data),
  dischargePatient: (id) => axiosClient.post(`/admissions/${id}/discharge`),
};
