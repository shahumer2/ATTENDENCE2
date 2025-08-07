import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { Shift_LIST } from 'Constants/utils';
import { GET_ShiftSearch_URL } from 'Constants/utils';
import { CiEdit } from "react-icons/ci";
import Select from 'react-select';
import { MdDelete } from "react-icons/md";
const Shift = () => {
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
    shiftCode: null,
    shiftName: null
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all shifts for dropdown options
  const { data: shiftOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['shiftOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${GET_ShiftSearch_URL}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data from API:', data); // This shows it's an array
        return data;
      } catch (error) {
        console.error('Error fetching shift options:', error);
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
          shiftNames: [{ label: 'Select', value: null }],
          shiftCodes: [{ label: 'Select', value: null }]
        };
      }

      const transformed = {
        shiftNames: [
          { label: 'Select', value: null },
          ...data.map(shift => ({
            label: shift.shiftName,
            value: shift.shiftName
          }))
        ],
        shiftCodes: [
          { label: 'Select', value: null },
          ...data.map(shift => ({
            label: shift.shiftCode,
            value: shift.shiftCode
          }))
        ]
      };

      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  // Fetch filtered shifts based on search params
  // Fetch filtered shifts based on search params
  const { data: shiftData, isLoading, isError, error } = useQuery({
    queryKey: ['shifts', currentPage, pageSize, searchParams], // it will re render if there are dep
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: pageSize,
        ...(searchParams.shiftCode && { shiftCode: searchParams.shiftCode }),
        ...(searchParams.shiftName && { shiftName: searchParams.shiftName })
      };

      const response = await fetch(`${Shift_LIST}?size=${pageSize}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to fetch shifts');

      const data = await response.json();
      console.log('Filtered shift data:', data);
      return data;
    },
    enabled: !!token,
    keepPreviousData: true
  });

  const handleSearchSubmit = (values) => {
    console.log('Search form submitted with values:', values);
    setSearchParams({
      shiftCode: values.shiftCode,
      shiftName: values.shiftName
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((shiftData?.totalElements || 0) / 10);

  if (isError) {
    toast.error(error.message);
    return <div>Error loading shifts</div>;
  }

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

      {/* Search Form */}
      <div className='items-center justify-center'>
        <Formik
          initialValues={{
            shiftCode: null,
            shiftName: null
          }}
          onSubmit={handleSearchSubmit}
        >
          {({ setFieldValue, values, handleSubmit }) => (
            <Form>
              <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                <div className="flex-1 min-w-[300px]">
                  <label className="mb-2.5 block text-black">Shift Code</label>
                  <ReactSelect
                    name="shiftCode"
                    value={shiftOptions?.shiftCodes?.find(option => option.value === values.shiftCode)}
                    onChange={(option) => {
                      console.log('Shift Code selected:', option);
                      setFieldValue('shiftCode', option?.value || null);
                    }}
                    options={shiftOptions?.shiftCodes || []}
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder="Select Shift Code"
                    isClearable
                    isLoading={optionsLoading}
                  />
                </div>
                <div className="flex-1 min-w-[300px]">
                  <label className="mb-2.5 block text-black ">Shift Name</label>
                  <ReactSelect
                    name="shiftName"
                    value={shiftOptions?.shiftNames?.find(option => option.value === values.shiftName)}
                    onChange={(option) => {
                      console.log('Shift Name selected:', option);
                      setFieldValue('shiftName', option?.value || null);
                    }}
                    options={shiftOptions?.shiftNames || []}
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder="Select Shift Name"
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
            <table className="min-w-full shadow-xl rounded-md border  divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                    Shift Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                    Shift Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                    Action
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

                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <div className='flex flex-row gap-3'>
                          <CiEdit color='green' className='cursor-pointer' size={25} onClick={() => navigate(`/admin/ShiftUpdate/${shift.id}`)} />
                          <MdDelete color='red' className='cursor-pointer' size={25} />

                        </div>
                      </td>
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
            {shiftData?.content?.length > 0 && (
              <div className="flex justify-between items-center mt-4 p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-700">
                    Showing {shiftData.content.length} of {shiftData.totalElements} shifts
                  </div>
                  <div className="w-24">
                    <Select
                      options={pageSizeOptions}
                      value={pageSizeOptions.find(option => option.value === pageSize)}
                      onChange={(selectedOption) => {
                        setPageSize(selectedOption.value);
                        setCurrentPage(1); // Reset to first page when changing page size
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

export default Shift;