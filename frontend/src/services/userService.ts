import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  active?: boolean;
};

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const res = await axios.get(`${API_BASE}/users`, { headers: authHeader() });
    return res.data;
  },

  createUser: async (data: { name: string; email: string; password: string; role: 'customer' | 'admin' }): Promise<User> => {
    const res = await axios.post(`${API_BASE}/users`, data, { headers: authHeader() });
    return res.data;
  },

  updateUser: async (id: string, data: Partial<Omit<User, 'id'>> & { password?: string }): Promise<User> => {
    const res = await axios.put(`${API_BASE}/users/${id}`, data, { headers: authHeader() });
    return res.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/users/${id}`, { headers: authHeader() });
  },
};
