import React, { useContext, useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { BackButton } from '../components/layout/BackButton';
import { userService, User } from '../services/userService';
import { AuthContext } from '../context/AuthContext';

type EditMode = {
  isEditing: boolean;
  userId: string | null;
};

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>({
    isEditing: false,
    userId: null,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer' as 'customer' | 'admin',
  });

  const { user: currentUser } = useContext(AuthContext) || {};

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer',
    });
    setEditMode({ isEditing: false, userId: null });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      resetForm();
      setCreating(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMode.userId) return;

    try {
      const payload: Partial<User> & { password?: string } = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      await userService.updateUser(editMode.userId, payload);
      alert('User updated successfully');
      resetForm();
      setCreating(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id: string) => {
    // 1. Μην αφήνεις να διαγράψεις τον εαυτό σου
    if (currentUser && currentUser.id === id) {
      alert('You cannot delete your own account while logged in.');
      return;
    }

    // 2. Μην αφήνεις να διαγραφεί ο τελευταίος ενεργός admin
    const admins = users.filter((u) => u.role === 'admin' && u.active);
    const deleting = users.find((u) => u.id === id);

    if (deleting?.role === 'admin' && admins.length <= 1) {
      alert('You cannot delete the last active admin user.');
      return;
    }

    if (!window.confirm('Delete this user?')) return;

    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleEditUser = (u: User) => {
    setCreating(true);
    setEditMode({ isEditing: true, userId: u.id });
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    if (editMode.isEditing) {
      return handleUpdate(e);
    }
    return handleCreate(e);
  };

  return (
    <MainLayout title="Users">
      <BackButton to="/dashboard" />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading users...</div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Library users</h2>
            <button
              onClick={() => {
                if (creating && editMode.isEditing) {
                  resetForm();
                }
                setCreating(!creating);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
            >
              {creating ? 'Cancel' : '+ Add user'}
            </button>
          </div>

          {creating && (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-6 text-sm">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                {editMode.isEditing ? 'Edit user' : 'Create new user'}
              </h3>
              <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    {editMode.isEditing ? 'New password (optional)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required={!editMode.isEditing}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'customer' | 'admin',
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end space-x-2">
                  {editMode.isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
                  >
                    {editMode.isEditing ? 'Update user' : 'Save user'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {users.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-sm">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Role</th>
                    <th className="px-4 py-2 border-b text-left">Active</th>
                    <th className="px-4 py-2 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-2 border-b">{u.name}</td>
                      <td className="px-4 py-2 border-b">{u.email}</td>
                      <td className="px-4 py-2 border-b capitalize">{u.role}</td>
                      <td className="px-4 py-2 border-b">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            u.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b text-right space-x-2">
                        <button
                          onClick={() => handleEditUser(u)}
                          className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="inline-flex items-center px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                        >
                          Delete
                        </button>
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
