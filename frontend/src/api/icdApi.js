import axiosClient from './axiosClient';

export const icdApi = {
  searchCodes: (query) => axiosClient.get(`/icd10/search?q=${encodeURIComponent(query)}`),
};
