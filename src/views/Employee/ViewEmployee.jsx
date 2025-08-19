import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { MdDelete } from "react-icons/md";
import { GET_ALL_EMPLOYEE_DATA } from 'Constants/utils';
import { GET_ACTIVE_EMPLOYEE_DATA } from 'Constants/utils';
import { GET_RESIGNED_EMPLOYEE_DATA } from 'Constants/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DELETE_EMPLOYEE_DATA } from 'Constants/utils';
import { IoAdd } from 'react-icons/io5';
import { useNavigate, } from 'react-router-dom';

const ViewEmployee = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', or 'resigned'
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch employees from appropriate API based on activeTab
  const fetchEmployees = useCallback(async (page = 1) => {
    try {
      let baseUrl;
      switch(activeTab) {
        case 'all':
          baseUrl = GET_ALL_EMPLOYEE_DATA;
          break;
        case 'active':
          baseUrl = GET_ACTIVE_EMPLOYEE_DATA;
          break;
        case 'resigned':
          baseUrl = GET_RESIGNED_EMPLOYEE_DATA;
          break;
        default:
          baseUrl = GET_ALL_EMPLOYEE_DATA;
      }
      
      const url = `${baseUrl}?page=${page }`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response,"hjj");

      if (!response.ok) throw new Error(`Failed to fetch ${activeTab} employees`);

      const data = await response.json();
      console.log("employee data++++",data,baseUrl);
      setEmployees(data.content || []);
      setTotalItems(data?.totalElements || 0);
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab} employees`);
      console.error(error);
    }
  }, [token, itemsPerPage, activeTab]);

  useEffect(() => {
    fetchEmployees(currentPage, debouncedSearchTerm);
  }, [fetchEmployees, currentPage, debouncedSearchTerm]);
console.log(employees,"jamshedpur");
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

  const deleteMutation = useMutation({
    mutationFn: async (employeeId) => {
      const response = await fetch(`${DELETE_EMPLOYEE_DATA}/${employeeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Employee deleted successfully');
      queryClient.invalidateQueries(['employees', activeTab]); // This will refetch the data
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee Management</h2>
      </div>

      {/* All/Active/Resigned Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('all');
            setCurrentPage(1);
          }}
        >
          All Employees
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('active');
            setCurrentPage(1);
          }}
        >
          Active Employees
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'resigned' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('resigned');
            setCurrentPage(1);
          }}
        >
          Resigned Employees
        </button>
      </div>

      {/* Search */}
      <div className=" flex justify-between mb-4">
        <input
          type="text"
          placeholder={`Search ${activeTab} employees...`}
          className="w-full md:w-64 px-4 py-2 border rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <IoAdd onClick={()=>navigate("/admin/employee/add")} style={{backgroundColor:"#337ab7"}} className=' h-[30px] w-[90px] rounded-lg cursor-pointer' color='white '/>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{employee?.employeeCode}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{employee?.employeeName}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{employee?.employeeName}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{employee?.gender}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{employee?.fingerPrint}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{employee?.section}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    employee.active == 'true' ? 'bg-green-100 text-green-800' : 
                    employee.blocked == 'true' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {employee?.status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"><MdDelete size={25} color='red' onClick={()=>handleDelete(employee.id)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {employees.length} of {totalItems} {activeTab} employees
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

export default ViewEmployee;