import React, { useEffect, useState, useContext } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { BackButton } from '../components/layout/BackButton';
import { rentalService, Rental } from '../services/rentalService';
import { AuthContext } from '../context/AuthContext';

type RentalWithRelations = Rental & {
  user?: { _id: string; name: string; email: string };
  book?: { _id: string; title: string };
};

export const RentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<RentalWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      let data: any[];
      if (user?.role === 'admin') {
        data = await rentalService.getAllRentals();
      } else {
        const userId = (user as any)?.id;
        data = await rentalService.getUserRentals(userId);
      }
      setRentals(data as RentalWithRelations[]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId: string) => {
    try {
      await rentalService.returnRental(rentalId);
      fetchRentals();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to return rental');
    }
  };

  const handleCancel = async (rentalId: string) => {
    try {
      await rentalService.cancelRental(rentalId);
      fetchRentals();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel rental');
    }
  };

  const formatUser = (rental: RentalWithRelations) => {
    if (rental.user) {
      return `${rental.user.name} (${rental.user.email})`;
    }
    if (typeof rental.userId === 'object' && rental.userId !== null) {
      const u: any = rental.userId;
      return `${u.name} (${u.email})`;
    }
    return rental.userId;
  };

  const formatBook = (rental: RentalWithRelations) => {
    if (rental.book) {
      return rental.book.title;
    }
    if (typeof rental.bookId === 'object' && rental.bookId !== null) {
      const b: any = rental.bookId;
      return b.title || b._id;
    }
    return rental.bookId;
  };

  return (
    <MainLayout title="Rentals">
      <BackButton to="/dashboard" />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading rentals...</div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {rentals.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-sm">
              No rentals found.
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">User</th>
                    <th className="px-4 py-2 border-b text-left">Book</th>
                    <th className="px-4 py-2 border-b text-left">Rented at</th>
                    <th className="px-4 py-2 border-b text-left">Due at</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((rental) => (
                    <tr key={rental.id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-2 border-b">
                        {formatUser(rental)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {formatBook(rental)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {new Date(rental.rentedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {rental.dueAt
                          ? new Date(rental.dueAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            rental.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : rental.status === 'returned'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {rental.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b text-right space-x-2">
                        {rental.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleReturn(rental.id)}
                              className="inline-flex items-center px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold"
                            >
                              Return
                            </button>
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => handleCancel(rental.id)}
                                className="inline-flex items-center px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                              >
                                Cancel
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};
