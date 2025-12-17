import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthContext } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext) || {};

  return (
    <MainLayout title="Dashboard">
      <p className="text-sm text-gray-600 mb-6">
        Welcome to your e-Library dashboard. Choose a section to manage books, rentals, or your account.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/books"
          className="rounded-2xl border border-gray-200 px-5 py-4 hover:border-indigo-500 hover:shadow-md transition bg-gray-50"
        >
          <h2 className="font-semibold text-gray-900 mb-1">Books</h2>
          <p className="text-sm text-gray-600">
            Browse and manage books in the catalog.
          </p>
        </Link>

        <Link
          to="/rentals"
          className="rounded-2xl border border-gray-200 px-5 py-4 hover:border-indigo-500 hover:shadow-md transition bg-gray-50"
        >
          <h2 className="font-semibold text-gray-900 mb-1">Rentals</h2>
          <p className="text-sm text-gray-600">
            View and manage your rentals.
          </p>
        </Link>

        {user?.role === 'admin' ? (
          <Link
            to="/users"
            className="rounded-2xl border border-gray-200 px-5 py-4 hover:border-indigo-500 hover:shadow-md transition bg-gray-50"
          >
            <h2 className="font-semibold text-gray-900 mb-1">Users</h2>
            <p className="text-sm text-gray-600">
              Manage library members and roles.
            </p>
          </Link>
        ) : (
          <Link
            to="/profile"
            className="rounded-2xl border border-gray-200 px-5 py-4 hover:border-indigo-500 hover:shadow-md transition bg-gray-50"
          >
            <h2 className="font-semibold text-gray-900 mb-1">Profile</h2>
            <p className="text-sm text-gray-600">
              View your account details and role.
            </p>
          </Link>
        )}
      </div>
    </MainLayout>
  );
};
