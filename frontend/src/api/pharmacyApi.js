import axiosClient from './axiosClient';

export const pharmacyApi = {
  getDrugs: () => axiosClient.get('/pharmacy/drugs'),
  addDrug: (data) => axiosClient.post('/pharmacy/drugs', data),
  updateStock: (id, quantity) => axiosClient.patch(`/pharmacy/drugs/${id}/stock`, { quantity }),
  
  getDispenseRecords: () => axiosClient.get('/pharmacy/dispense'),
  dispenseMedication: (data) => axiosClient.post('/pharmacy/dispense', data),
};
