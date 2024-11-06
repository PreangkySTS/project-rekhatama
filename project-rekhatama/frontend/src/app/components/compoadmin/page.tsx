"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: string;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<{ name: string; email: string; password: string; role_id: string }>({
    name: '',
    email: '',
    password: '',
    role_id: '',
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<string>('name'); // State untuk opsi penyortiran

  const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Sesuaikan dengan base URL yang sama
  });

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get<User[]>('/users'); // Mengambil data pengguna
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log('User Data:', newUser); // Menampilkan data user yang akan dikirim
      await apiClient.post('/register', newUser); // Mendaftar pengguna baru
      fetchUsers();
      setNewUser({ name: '', email: '', password: '', role_id: '' });
      setIsModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error registering user:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, password: '', role_id: user.role_id });
    setIsModalOpen(true);
  };

  const handleEditUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingUser) {
      try {
        await apiClient.put(`/users/${editingUser.id}`, {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role_id: newUser.role_id,
        });
        fetchUsers();
        setEditingUser(null);
        setNewUser({ name: '', email: '', password: '', role_id: '' });
        setIsModalOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error updating user:', error.response?.data || error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await apiClient.delete(`/users/${id}`); // Menghapus pengguna
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // Melakukan penyortiran berdasarkan opsi yang dipilih
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'email') {
      return a.email.localeCompare(b.email);
    } else if (sortOption === 'role_id') {
      return Number(a.role_id) - Number(b.role_id); // Gunakan perbandingan numerik
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex  items-center mb-4 pt-[3rem] gap-5">
        <button
          onClick={() => {
            setEditingUser(null);
            setNewUser({ name: '', email: '', password: '', role_id: '' });
            setIsModalOpen(true);
          }}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200 shadow-lg"
        >
          Add New User
        </button>
  {/* Dropdown untuk memilih opsi penyortiran */}
  <select
  value={sortOption}
  onChange={(e) => setSortOption(e.target.value)}
  className="border border-blue-500 rounded-md py-2.5 px-3 ml-2 bg-blue-500 text-white font-bold hover:bg-blue-600 focus:outline-none   transition duration-200 shadow-lg"
>
  <option value="name" className="bg-gray-200  text-gray-500 font-semibold ">Sort by Name</option>
  <option value="email" className="bg-gray-200 text-gray-500 font-semibold ">Sort by Email</option>
  <option value="role_id" className="bg-gray-200  text-gray-500 font-semibold ">Sort by Role ID</option>
</select>



        <input
          type="text"
          placeholder="Search Users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-1/3 ml-[30rem]"
        />

      
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">No</th>
              <th className="py-3 px-6 text-center">Name</th>
              <th className="py-3 px-6 text-center">Email</th>
              <th className="py-3 px-6 text-center">Role ID</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light ">
            {sortedUsers.map((user, index) => (
              <tr key={user.id} className="border-b border-gray-300 hover:bg-gray-100">
                <td className="py-3 px-6 text-center border">{index + 1}</td>
                <td className="py-3 px-6 text-center border">{user.name}</td>
                <td className="py-3 px-6 text-center border">{user.email}</td>
                <td className="py-3 px-6 text-center border">{user.role_id}</td>
                <td className="py-3 px-6 text-center border">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => startEditing(user)}
                      className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-200 shadow-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-200 shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for User Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={editingUser ? handleEditUser : handleRegister}>
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Role ID"
                value={newUser.role_id}
                onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                required
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
