import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { Shift_LIST } from 'Constants/utils';
import { GET_ShiftSearch_URL } from 'Constants/utils';
import { CiEdit, CiSearch } from "react-icons/ci";
import Select from 'react-select';
import { MdDelete } from "react-icons/md";
import Tooltip from 'components/Tooltip/Tooltip';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { debounce } from 'lodash';
import { FaEdit } from 'react-icons/fa';
const Shift = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const navigate = useNavigate();

  const [isActiveFilter, setIsActiveFilter] = useState(null); 
  const pageSizeOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];


  const [searchParams, setSearchParams] = useState({
    shiftCode: null,
    shiftName: null
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // Fetch all shifts for dropdown options


  // Fetch filtered shifts based on search params
  // Fetch filtered shifts based on search params
  const { data: shiftData, isLoading, isError, error } = useQuery({
    queryKey: ['shifts', currentPage, debouncedSearchTerm, isActiveFilter], // it will re render if there are dep
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: 10,
        searchTerm: debouncedSearchTerm || "",   // ✅ single search field
        isActive: isActiveFilter,            // ✅ active/inactive filter
    };

      const response = await fetch(`${Shift_LIST}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to fetch shifts');

      const data = await response.json();
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);
      console.log('Filtered shift data:', data);
      return data;
    },
    enabled: !!token,
    keepPreviousData: true
  });

 



  if (isError) {
    toast.error(error.message);
    return <div>Error loading shifts</div>;
  }
  const TOOLTIP_CONTENT = {
    shift: (
      <div>
        <p className="mb-2">
        This page lets you setup shift(s) according to your company's needs.


        </p>
      
      </div>
    ),
  };
  
  const debounceSearch = useCallback(

    debounce((value) => setDebouncedSearchTerm(value), 300),
    []
);

const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value); // ✅ will update debouncedSearchTerm
};

  return (
    <>
      <div className="flex justify-between pl-8 pt-2 pr-8">

        <div className="flex items-center">
          <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Shift</h2>
          <Tooltip className="ml-8"  content={TOOLTIP_CONTENT.shift}/>
        </div>
        <Breadcrumb className="pr-4" items={`Shift Settings,Shift `} />
      </div>
      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      <div>
                <div className="flex justify-between items-center mb-4">
                    {/* ✅ Left side: show filters only for Leave Type */}
                   
                        <div className="flex items-center space-x-4 gap-12 text-sm">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    checked={isActiveFilter === null}
                                    onChange={() => setIsActiveFilter(null)}
                                    className="accent-[#337ab7]"
                                />
                                <span className="capitalize">All Shifts</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    checked={isActiveFilter === true}
                                    onChange={() => setIsActiveFilter(true)}
                                    className="accent-[#337ab7]"
                                />
                                <span className="capitalize">Active Shifts</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    checked={isActiveFilter === false}
                                    onChange={() => setIsActiveFilter(false)}
                                    className="accent-[#337ab7]"
                                />
                                <span className="capitalize">Inactive Shifts</span>
                            </label>
                        </div>
                  

                    {/* ✅ Right side: Add button is always here */}
                   
                        <div>
                            <button
                                 onClick={() => navigate("/admin/shift/add")}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Add Shift
                            </button>
                        </div>
                   
                </div>
















                <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
                    <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
                      Shift
                    </h2>

                    <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
                        <input
                            type="text"
                            placeholder={`Enter The Shift Code or Shift Name `}
                            className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {/* Search Icon inside input */}
                        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>












            </div>
        {/* Header + Add Button */}
       

        {/* Search Form */}
     









        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <>
              <table className="min-w-full shadow-xl rounded-md border  divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Shift Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Shift Name
                    </th>
                    <th className='w-[50%]'></th>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Edit
                    </th>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shiftData?.content?.length > 0 ? (
                    shiftData.content.map((shift) => (
                      <tr key={shift.id} className="even:bg-gray-50 hover:bg-gray-100">
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {shift.shiftCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {shift.shiftName}
                        </td>
                        <td></td>

                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          <div className='flex flex-row gap-3'>
                          <FaEdit size="1.3rem" style={{ color: "#337ab7" }} onClick={() => navigate(`/admin/ShiftUpdate/${shift.id}`)} />
                            

                          </div>
                        </td>
                        <td><MdDelete style={{ color: "#d97777" }} size="1.3rem" /></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center">
                        No shifts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex w-full justify-end items-center mt-4 px-6">
                <div className="flex space-x-2 text-blue-500">
                    {page > 1 && (
                        <>
                            <button
                                onClick={() => setPage(1)}
                                className="px-3 py-1 border rounded"
                            >
                                First
                            </button>
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                className="px-3 py-1 border rounded"
                            >
                                Prev
                            </button>
                        </>
                    )}
                    {page <= totalPages && (
                        <>
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                className="px-3 py-1 border rounded"
                            >
                                Next
                            </button>
                            <button
                                onClick={() => setPage(totalPages)}
                                className="px-3 py-1 border rounded"
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Shift;