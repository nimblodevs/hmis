import axiosClient from './axiosClient';

const tokenApi = {
  // Issue a new token
  issueToken: (data) => {
    return axiosClient.post('/tokens', data);
  },

  // Quick register a walk-in patient
  registerWalkIn: (data) => {
    return axiosClient.post('/walkins', data);
  },

  // Get active queue for a department
  getQueueByDept: (dept, status = 'waiting') => {
    return axiosClient.get(`/tokens?dept=${dept}&status=${status}`);
  },

  // Call a patient (triggers TTS and real-time updates)
  callToken: (id) => {
    return axiosClient.patch(`/tokens/${id}/call`);
  },

  // Complete consultation and optionally set next service point
  completeToken: (id, nextServicePoint = null) => {
    return axiosClient.patch(`/tokens/${id}/complete`, { 
      status: 'done', 
      nextServicePoint 
    });
  },

  // Update token status (e.g., mark as in_progress)
  updateStatus: (id, status) => {
    return axiosClient.patch(`/tokens/${id}/complete`, { status });
  },

  // Get aggregated stats for depts
  getStats: () => {
    return axiosClient.get('/tokens/stats');
  }
};

export default tokenApi;
