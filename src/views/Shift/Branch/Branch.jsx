import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { Branch_LIST } from 'Constants/utils';
import { GET_BranchSearch_URL } from 'Constants/utils';
import { CiEdit, CiSearch } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Tooltip from 'components/Tooltip/Tooltip';
import { debounce } from 'lodash';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { FaEdit } from 'react-icons/fa';
const Branch = () => {
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

  const [searchParams, setSearchParams] = useState({
    branchCode: null,
    branchName: null
  });


  // Fetch all Branchs for dropdown options
  const { data: BranchOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['BranchOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${Branch_LIST}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data from API:', data); // This shows it's an array
        return data?.content;
      } catch (error) {
        console.error('Error fetching Branch options:', error);
        throw error;
      }
    },
    enabled: !!token,
    select: (data) => {
      console.log('Data in select function:', data); // Should log the array

      // Since data is directly the array, we don't need data.content
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return {
          BranchNames: [{ label: 'Select', value: null }],
          BranchCodes: [{ label: 'Select', value: null }]
        };
      }

      const transformed = {
        BranchNames: [
          { label: 'Select', value: null },
          ...data.map(Branch => ({
            label: Branch.branchName,
            value: Branch.branchName
          }))
        ],
        BranchCodes: [
          { label: 'Select', value: null },
          ...data.map(Branch => ({
            label: Branch.branchCode,
            value: Branch.branchCode
          }))
        ]
      };

      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  // Fetch filtered Branchs based on search params
  // Fetch filtered Branchs based on search params
  const { data: BranchData, isLoading, isError, error } = useQuery({
    queryKey: ['Branchs', currentPage, debouncedSearchTerm, isActiveFilter,page, pageSize],
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: 10,
        searchTerm: debouncedSearchTerm || "",   // ✅ single search field
        isActive: isActiveFilter,            // ✅ active/inactive filter
    };

      const response = await fetch(`${GET_BranchSearch_URL}?page=${page - 1}&size=${pageSize}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to fetch Branchs');

      const data = await response.json();
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);
      console.log('Filtered Branch data:', data);
      return data;
    },
    enabled: !!token,
    keepPreviousData: true
  });

  const handleSearchSubmit = (values) => {
    console.log('Search form submitted with values:', values);
    setSearchParams({
      branchCode: values.branchCode,
      branchName: values.branchName
    });
    setCurrentPage(1);
  };



  if (isError) {
    toast.error(error.message);
    return <div>Error loading Branchs</div>;
  }

  const TOOLTIP_CONTENT = {
    branch: (
      <div>
        <p className="mb-2">
          This page lets you setup branches and the shifts associated with it.</p>

        <p>If you intend to use the Employee Schedule function (Shift Settings {">"} Employee Schedule), you’ll need to setup at least 1 branch (example: OFFICE).</p>




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
          <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Branch</h2>
          <Tooltip content={TOOLTIP_CONTENT.branch} />
        </div>
        <Breadcrumb className="pr-4" items={`Shift Settings,BranchSetup,Branch`} />
      </div>
      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
        {/* Header + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold"></h2>
          <button
            onClick={() => navigate("/admin/ETMS/Branch/add")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Branch
          </button>
        </div>

        {/* Search Form */}
        <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
          <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
            Branch List
          </h2>

          <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
            <input
              type="text"
              placeholder={`Enter The Branch Code or Branch Name `}
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
              <table className="min-w-full shadow-xl rounded-md border  divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Branch Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Branch Name
                    </th>
                    <th className='w-[60%]'></th>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Edit
                    </th>
                    <th className="px-3 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {BranchData?.content?.length > 0 ? (
                    BranchData.content.map((Branch) => (
                      <tr key={Branch.id} className="even:bg-gray-50 hover:bg-gray-100">
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {Branch.branchCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {Branch.branchName}
                        </td>
                        <td></td>

                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          <div className='flex flex-row gap-3'>
                          <FaEdit size="1.3rem" style={{ color: "#337ab7" }} color='green' className='cursor-pointer'  onClick={() => navigate(`/admin/ETMS/BranchUpdate/${Branch.id}`)} />
                          

                          </div>
                        </td>
                        <td><MdDelete style={{ color: "#d97777" }} size="1.3rem"  color='red' className='cursor-pointer'  /></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center">
                        No Branchs found
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Branch;