import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { LeaveCategory_LIST } from 'Constants/utils';
import { GET_LeaveCategorySearch_URL } from 'Constants/utils';
import { CiEdit } from "react-icons/ci";
import Select from 'react-select';
import { MdDelete } from "react-icons/md";

const LeaveCategory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);

  const pageSizeOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];

  const [searchParams, setSearchParams] = useState({
    LeaveCategoryCode: null,
    LeaveCategoryName: null
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all LeaveCategorys for dropdown options
  const { data: LeaveCategoryOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['LeaveCategoryOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${GET_LeaveCategorySearch_URL}`, {
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
      console.log('Data in select function:', data);

      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return {
          LeaveCategoryNames: [{ label: 'Select', value: null }],
          LeaveCategoryCodes: [{ label: 'Select', value: null }]
        };
      }

      const transformed = {
        LeaveCategoryNames: [
          { label: 'Select', value: null },
          ...data.map(LeaveCategory => ({
            label: LeaveCategory.LeaveCategoryName,
            value: LeaveCategory.LeaveCategoryName
          }))
        ],
        LeaveCategoryCodes: [
          { label: 'Select', value: null },
          ...data.map(LeaveCategory => ({
            label: LeaveCategory.LeaveCategoryCode,
            value: LeaveCategory.LeaveCategoryCode
          }))
        ]
      };

      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  // Fetch filtered LeaveCategorys based on search params
  const { data: LeaveCategoryData, isLoading, isError, error } = useQuery({
    queryKey: ['LeaveCategorys', currentPage, pageSize, searchParams],
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: pageSize,
        ...(searchParams.LeaveCategoryCode && { LeaveCategoryCode: searchParams.LeaveCategoryCode }),
        ...(searchParams.LeaveCategoryName && { LeaveCategoryName: searchParams.LeaveCategoryName })
      };

      const response = await fetch(`${LeaveCategory_LIST}?size=${pageSize}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to fetch LeaveCategorys');

      const data = await response.json();
      console.log('Filtered LeaveCategory data:', data);
      return data;
    },
    enabled: !!token,
    keepPreviousData: true
  });

  const handleSearchSubmit = (values) => {
    console.log('Search form submitted with values:', values);
    setSearchParams({
      LeaveCategoryCode: values.LeaveCategoryCode,
      LeaveCategoryName: values.LeaveCategoryName
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((LeaveCategoryData?.totalElements || 0) / pageSize);

  if (isError) {
    toast.error(error.message);
    return <div>Error loading LeaveCategorys</div>;
  }

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Leave Category List</h2>
        <button
          onClick={() => navigate("/admin/LeaveCategory/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Leave Category
        </button>
      </div>

      {/* Search Form */}
      <div className='items-center justify-center'>
        <Formik
          initialValues={{
            LeaveCategoryCode: null,
            LeaveCategoryName: null
          }}
          onSubmit={handleSearchSubmit}
        >
          {({ setFieldValue, values, handleSubmit }) => (
            <Form>
              <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                <div className="flex-1 min-w-[300px]">
                  <label className="mb-2.5 block text-black">Category Code</label>
                  <ReactSelect
                    name="LeaveCategoryCode"
                    value={LeaveCategoryOptions?.LeaveCategoryCodes?.find(option => option.value === values.LeaveCategoryCode)}
                    onChange={(option) => {
                      console.log('LeaveCategory Code selected:', option);
                      setFieldValue('LeaveCategoryCode', option?.value || null);
                    }}
                    options={LeaveCategoryOptions?.LeaveCategoryCodes || []}
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder="Select Category Code"
                    isClearable
                    isLoading={optionsLoading}
                  />
                </div>
                <div className="flex-1 min-w-[300px]">
                  <label className="mb-2.5 block text-black">Category Name</label>
                  <ReactSelect
                    name="LeaveCategoryName"
                    value={LeaveCategoryOptions?.LeaveCategoryNames?.find(option => option.value === values.LeaveCategoryName)}
                    onChange={(option) => {
                      console.log('LeaveCategory Name selected:', option);
                      setFieldValue('LeaveCategoryName', option?.value || null);
                    }}
                    options={LeaveCategoryOptions?.LeaveCategoryNames || []}
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder="Select Category Name"
                    isClearable
                    isLoading={optionsLoading}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-semibold md:text-sm text-white text-xl hover:bg-opacity-90 bg-blue-500 m-5"
                >
                  Search
                </button>
              </div>
            </Form>
          )}
        </Formik>
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
                        {LeaveCategory.LeaveCategoryCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {LeaveCategory.LeaveCategoryName}
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
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <CiEdit 
                          color='green' 
                          className='cursor-pointer' 
                          size={25} 
                          onClick={() => navigate(`/admin/LeaveCategoryUpdate/${LeaveCategory.id}`)} 
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <MdDelete 
                          color='red' 
                          className='cursor-pointer' 
                          size={25} 
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
            {LeaveCategoryData?.content?.length > 0 && (
              <div className="flex justify-between items-center mt-4 p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-700">
                    Showing {LeaveCategoryData.content.length} of {LeaveCategoryData.totalElements} Leave Categories
                  </div>
                  <div className="w-24">
                    <Select
                      options={pageSizeOptions}
                      value={pageSizeOptions.find(option => option.value === pageSize)}
                      onChange={(selectedOption) => {
                        setPageSize(selectedOption.value);
                        setCurrentPage(1);
                      }}
                      isSearchable={false}
                      menuPlacement="auto"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveCategory;