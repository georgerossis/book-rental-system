import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export type Rental = {
  id: string;
  userId: string;
  bookId: string;
  rentedAt: string;
  dueAt?: string;
  returnedAt?: string;
  status: 'active' | 'returned' | 'canceled';
};

export const rentalService = {
  // Customer action: rent a book
  rentBook: async (bookId: string, userId: string): Promise<Rental> => {
    const res = await axios.post(
      `${API_BASE}/rentals`,
      { bookId, userId },
      { headers: authHeader() }
    );
    return res.data;
  },

  // Customer action: list own rentals
  getUserRentals: async (userId: string): Promise<Rental[]> => {
    const res = await axios.get(`${API_BASE}/rentals`, {
      params: { userId },
      headers: authHeader(),
    });
    return res.data;
  },

  // Admin action: list all rentals
  getAllRentals: async (): Promise<Rental[]> => {
    const res = await axios.get(`${API_BASE}/rentals`, {
      headers: authHeader(),
    });
    return res.data;
  },

  //Admin action: list user rental
  getRentalsForUserAsAdmin: async (userId: string): Promise<Rental[]> => {
  const res = await axios.get(`${API_BASE}/rentals`, {
    params: { userId },
    headers: authHeader(),
  });
  return res.data;
},

  // Return a rental (customer or admin)
  returnRental: async (rentalId: string): Promise<Rental> => {
    const res = await axios.post(
      `${API_BASE}/rentals/${rentalId}/return`,
      {},
      { headers: authHeader() }
    );
    return res.data;
  },

  // Cancel a rental (e.g., admin or before pickup)
  cancelRental: async (rentalId: string): Promise<void> => {
    await axios.post(
      `${API_BASE}/rentals/${rentalId}/cancel`,
      {},
      { headers: authHeader() }
    );
  },
};
