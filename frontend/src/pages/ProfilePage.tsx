import React, { useContext } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { BackButton } from '../components/layout/BackButton';
import { AuthContext } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useContext(AuthContext) || {};

  return (
    <MainLayout title="Profile">
      <BackButton to="/dashboard" />

      {!user ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">No user data available.</div>
        </div>
      ) : (
        <div className="mt-4 max-w-md bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account details
          </h2>

          <dl className="space-y-3 text-sm text-gray-700">
            <div>
              <dt className="font-medium text-gray-600">Full name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Role</dt>
              <dd className="capitalize">{user.role}</dd>
            </div>
          </dl>
        </div>
      )}
    </MainLayout>
  );
};
