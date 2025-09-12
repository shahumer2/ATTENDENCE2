import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { GET_ACTIVEUSERS } from 'Constants/utils';
import { GET_INACTIVEUSERS } from 'Constants/utils';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { CiSearch } from 'react-icons/ci';
import { FaEdit } from 'react-icons/fa';
import { SENDRESENDEMAIL } from 'Constants/utils';
import { useNavigate } from 'react-router-dom';


const ViewUser = () => {
  const [loadinguserId, setloadinguserId] = useState(null)
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'inactive'
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);


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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleResend = async (user) => {
    setloadinguserId(user.id)
    try {
      const response = await fetch(
        `${SENDRESENDEMAIL}/${user.id}/send-welcome-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success(`Email resent successfully to ${user.email}`);
        setloadinguserId(null)
      } else {
        const errorData = await response.json();
        toast.error(errorData.details || "Error while resending email");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  return (
    <>
      <div className="flex justify-between pl-8 pt-2 pr-8">
        <h2 className="font-bold text-lg capitalize text-blue-900">User Creation </h2>
        <Breadcrumb className="pr-4" items={`Administration,User Creation `} />


      </div>

      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
        {/* Header */}


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
        <div className="mb-4 flex mr-2 justify-end">
        <div>
              <button
                onClick={() => navigate("/admin/user/add")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add User
              </button>
            </div>
        </div>

        <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
          <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
            Users
          </h2>

          <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
            <input
              type="text"
              placeholder={`Enter The Employee Code or Employee Name `}
              className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
            // value={searchTerm}
            // onChange={handleSearchChange}
            />
            {/* Search Icon inside input */}
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-scroll">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">Edit</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold whitespace-nowrap">Employee Code</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold whitespace-nowrap">Display Name</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold whitespace-nowrap">Email</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold whitespace-nowrap">Mobile Number</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold whitespace-nowrap">Email Sent</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold whitespace-nowrap">Last Logged In</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-tight font-semibold whitespace-nowrap">Resend Welcome Email</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">Delete</th>
                <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">Deactivate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    <div className='flex flex-row gap-3'>
                      <FaEdit size="1rem" style={{ color: "#337ab7" }}  />


                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.employeeId || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    <button
                      className="bg-blue-500 px-2 py-1 disabled:bg-gray-500 rounded-md text-xs text-white"
                      disabled={loadinguserId === user.id}
                      onClick={() => handleResend(user)}
                    >
                      {loadinguserId === user.id ? "Sending..." : "Resend Email"}
                    </button>
                  </td>


                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{user.phoneNumber}</td>

                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex w-full justify-end items-center mt-4 px-6">
            <div className="flex space-x-2 text-blue-500">
              {page > 1 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className="px-3 py-1 border rounded pag"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1 border rounded pag"
                  >
                    Prev
                  </button>
                </>
              )}
              {page <= totalPages && (
                <>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1 border rounded pag"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="px-3 py-1 border rounded pag"
                  >
                    Last
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex w-full  items-center mt-4  gap-4 px-6 mb-2">
            {/* Page size selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Page Size:</label>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border rounded px-2 py-1 w-[100px] border-gray-400"
              >
                {[5, 10, 15, 20].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Pagination buttons */}


            {/* Go to page + info */}
            <div className="flex items-center space-x-2 gap-4">
              <label className="text-sm font-medium">Go to Page:</label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={page}
                onChange={(e) => {
                  let val = Number(e.target.value);

                  // Prevent NaN or invalid numbers
                  if (!val || val < 1) {
                    setPage(1);
                  } else if (val > totalPages) {
                    setPage(totalPages);
                  } else {
                    setPage(val);
                  }
                }}
                className="border rounded w-[100px] px-2 py-1 border-gray-400 mr-4"
              />


              <span className="text-sm  font-semibold ml-4">
                Page {page} of {totalPages}
              </span>
              <span className="text-sm gap-5 font-semibold">
                Total: {totalRecords}
              </span>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default ViewUser;