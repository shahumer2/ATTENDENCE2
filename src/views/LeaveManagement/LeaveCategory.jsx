import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { LeaveCategory_LIST } from 'Constants/utils';
import { GET_LeaveCategorySearch_URL } from 'Constants/utils';
import { CiEdit, CiSearch } from "react-icons/ci";
import Select from 'react-select';
import { MdDelete } from "react-icons/md";
import { LeaveCategory_DROP } from 'Constants/utils';
import Tooltip from 'components/Tooltip/Tooltip';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { FaEdit } from 'react-icons/fa';

const LeaveCategory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isActiveFilter, setIsActiveFilter] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const token = currentUser?.token;
  const navigate = useNavigate();


  const pageSizeOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];

  const [searchParams, setSearchParams] = useState({
    LeaveCategoryCode: "",
    LeaveCategoryName: ""
  });


  // Fetch all LeaveCategorys for dropdown options
  const { data: LeaveCategoryOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['LeaveCategoryOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${LeaveCategory_DROP}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data from API:', data);
        return data;
      } catch (error) {
        console.error('Error fetching LeaveCategory options:', error);
        throw error;
      }
    },
    enabled: !!token,
    select: (data) => {
      console.log('Data in select function cat:', data);

      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return {
          LeaveCategoryNames: [{ label: 'Select', value: "" }],
          LeaveCategoryCodes: [{ label: 'Select', value: "" }]
        };
      }

      const transformed = {
        LeaveCategoryNames: [
          { label: 'Select', value: "" },
          ...data.map(LeaveCategory => ({
            label: LeaveCategory.leaveCategoryName,
            value: LeaveCategory.leaveCategoryName
          }))
        ],
        LeaveCategoryCodes: [
          { label: 'Select', value: null },
          ...data.map(LeaveCategory => ({
            label: LeaveCategory.leaveCategoryCode,
            value: LeaveCategory.leaveCategoryCode
          }))
        ]
      };

      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  // Fetch filtered LeaveCategorys based on search params
  const { data: LeaveCategoryData, isLoading, isError, error } = useQuery({
    queryKey: ['LeaveCategorys',currentPage, debouncedSearchTerm, isActiveFilter,page, pageSize],
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: 10,
        searchTerm: debouncedSearchTerm || "",   // ✅ single search field
        isActive: isActiveFilter,            // ✅ active/inactive filter
    };
      console.log(requestBody, "pakki");
      const response = await fetch(`${LeaveCategory_LIST}?page=${page - 1}&size=${pageSize}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to fetch LeaveCategorys');

      const data = await response.json();
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);
      console.log('Filtered LeaveCategory data:', data);
      return data;
    },
    enabled: !!token,
    keepPreviousData: true
  });
  console.log(LeaveCategoryData, 'jamshe');
  const handleSearchSubmit = (values) => {
    console.log('Search form submitted with values:', values);
    setSearchParams({
      LeaveCategoryCode: values.LeaveCategoryCode,
      LeaveCategoryName: values.LeaveCategoryName
    });
    setCurrentPage(1);
  };



  if (isError) {
    toast.error(error.message);
    return <div>Error loading LeaveCategorys</div>;
  }
  const TOOLTIP_CONTENT = {
    leave: (
      <div>
        <p className="mb-2">
          Leave Category lets you specify the annual leave entitlement of annual leave, medical leave and other leave groups for the employees in your company.</p>
        <p>You can assign leave category to the individual staff at:</p>
        <p>Master {">"} Employee Basic Details {">"} General tab</p>




      </div >
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
          <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Leave Category </h2>
          <Tooltip content={TOOLTIP_CONTENT.leave} />
        </div>
        <Breadcrumb className="pr-4" items={`Leave Management,Leave Category`} />
      </div>
      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
        {/* Header + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold"></h2>
          <button
            onClick={() => navigate("/admin/LeaveCategory/add")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Leave Category
          </button>
        </div>

        {/* Search Form */}
        <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
          <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
            Leave Category List
          </h2>

          <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
            <input
              type="text"
              placeholder={`Enter The Leave Category Code or LeaveCategory Name `}
              className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {/* Search Icon inside input */}
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <>
              <table className="min-w-full shadow-xl rounded-md border divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Category Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Medical Claim Limit (per year)
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Medical Claim Limit (per visit)
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Dental Claim Limit (per year)
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Dental Claim Limit (per visit)
                    </th>
                    <th className='w-[50%]'></th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Edit
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {LeaveCategoryData?.content?.length > 0 ? (
                    LeaveCategoryData.content.map((LeaveCategory) => (
                      <tr key={LeaveCategory.id} className="even:bg-gray-50 hover:bg-gray-100">
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {LeaveCategory.leaveCategoryCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {LeaveCategory.leaveCategoryName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {LeaveCategory.medicalClaimLimitPerYear || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {LeaveCategory.medicalClaimLimitPerVisit || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {LeaveCategory.dentalClaimLimitPerYear || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {LeaveCategory.dentalClaimLimitPerVisit || 'N/A'}
                        </td>
                        <td></td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <FaEdit size="1.3rem" style={{ color: "#337ab7" }}
                            color='green'
                            className='cursor-pointer'
                           
                            onClick={() => navigate(`/admin/LeaveCategoryUpdate/${LeaveCategory.id}`)}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <MdDelete style={{ color: "#d97777" }} size="1.3rem" 
                           
                            className='cursor-pointer'
                         
                            onClick={() => {
                              // Add delete functionality here
                              console.log('Delete clicked for:', LeaveCategory.id);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-sm text-gray-500 text-center">
                        No Leave Categories found
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

export default LeaveCategory;