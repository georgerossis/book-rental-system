import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await axios.get(`${API_BASE}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
