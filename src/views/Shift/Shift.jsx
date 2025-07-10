import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
// import { Shift_ADD, Shift_LIST } from 'Constants/utils';
import { useNavigate } from 'react-router-dom';

const Shift = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch companies from API with pagination
//   const fetchCompanies = useCallback(async (page=0, search = '') => {
   
//     try {
      
//       const url = `${Shift_LIST}?page=${page-1}`;
//       console.log("url===",url);
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,   
//         },
//       });

//       if (!response.ok) throw new Error('Failed to fetch companies');

//       const data = await response.json();
//       console.log(data,"jamshedd");
//       setCompanies(data?.content || []);
//       setTotalItems(data?.totalElements || 0);
//     } catch (error) {
//       toast.error('Failed to fetch companies');
//       console.error(error);
//     }
//   }, [token, itemsPerPage]);

//   useEffect(() => {
//     fetchCompanies(currentPage, debouncedSearchTerm);
//   }, [fetchCompanies, currentPage, debouncedSearchTerm]);

//   // Debounce search input
//   const debounceSearch = useCallback(
//     debounce((value) => {
//       setDebouncedSearchTerm(value);
//       setCurrentPage(1); // Reset to first page when searching
//     }, 300),
//     []
//   );

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     debounceSearch(value);
//   };

  // Handle file uploads




 



  // Pagination controls
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Shift List</h2>
        <button
          onClick={() => navigate("/admin/shift/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Shift
        </button>
      </div>

      {/* Search */}
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search Shift..."
          className="w-full md:w-64 px-4 py-2 border rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Name</th>

            </tr>
          </thead>
          {/* <tbody className="bg-white divide-y divide-gray-200">
  {companies.length > 0 ? (
    companies.map((Shift, index) => (
      <tr key={index}>
        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{Shift.ShiftCode}</td>
        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{Shift.ShiftName}</td>
        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{Shift.location}</td>
        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{Shift.city}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 text-center">
        No data found
      </td>
    </tr>
  )}
</tbody> */}

        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {companies.length} of {totalItems} companies
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
      </div> */}

      {/* Add Shift Modal */}
   
    </div>
  );
};

export default Shift;