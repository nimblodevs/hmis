import axiosClient from './axiosClient';

export const billingApi = {
  getInvoices: () => axiosClient.get('/billing/invoices'),
  createInvoice: (data) => axiosClient.post('/billing/invoices', data),
  
  getPayments: () => axiosClient.get('/billing/payments'),
  recordPayment: (data) => axiosClient.post('/billing/payments', data),
};
