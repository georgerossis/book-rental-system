import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const bookService = {
  getAllBooks: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/books`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createBook: async (bookData: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/books`, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateBook: async (id: string, bookData: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE}/books/${id}`, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteBook: async (id: string) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
