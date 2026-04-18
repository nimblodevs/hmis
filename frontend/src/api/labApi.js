import axiosClient from './axiosClient';

export const labApi = {
  getOrders: () => axiosClient.get('/laboratory/orders'),
  createOrder: (data) => axiosClient.post('/laboratory/orders', data),
  updateOrderStatus: (id, status) => axiosClient.patch(`/laboratory/orders/${id}/status`, { status }),
  
  getResults: () => axiosClient.get('/laboratory/results'),
  addResult: (orderId, data) => axiosClient.post(`/laboratory/orders/${orderId}/results`, data),
};
