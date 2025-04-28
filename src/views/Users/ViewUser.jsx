import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { GET_ACTIVEUSERS } from 'Constants/utils';
import { GET_INACTIVEUSERS } from 'Constants/utils';


const ViewUser = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'inactive'
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch users from appropriate API based on activeTab
  const fetchUsers = useCallback(async (page = 0, search = '') => {
    try {
      const baseUrl = activeTab === 'active' ? GET_ACTIVEUSERS : GET_INACTIVEUSERS;
      const url = `${baseUrl}?page=${page - 1}&search=${search}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch ${activeTab} users`);

      const data = await response.json();
      
      setUsers(data?.content || []);
      setTotalItems(data?.totalElements || 0);
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab} users`);
      console.error(error);
    }
  }, [token, itemsPerPage, activeTab]);

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearchTerm);
  }, [fetchUsers, currentPage, debouncedSearchTerm]);

  // Debounce search input
  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1); // Reset to first page when searching
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceSearch(value);
  };

  // Pagination controls
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>

      {/* Active/Inactive Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('active');
            setCurrentPage(1); // Reset to first page when switching tabs
          }}
        >
          Active Users
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'inactive' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('inactive');
            setCurrentPage(1); // Reset to first page when switching tabs
          }}
        >
          Inactive Users
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text" 
          placeholder={`Search ${activeTab} users...`}
          className="w-full md:w-64 px-4 py-2 border rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Id</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.employeeId||0}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.phoneNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.roleName}</td>
              
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {users.length} of {totalItems} {activeTab} users
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;