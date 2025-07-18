import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';


import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { GET_AutoShiftSearch_URL } from 'Constants/utils';
const AutoShift = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    AutoShiftCode: null,
    AutoShiftName: null
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all AutoShifts for dropdown options
  const { data: AutoShiftOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['AutoShiftOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${GET_AutoShiftSearch_URL}`, {
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
        console.error('Error fetching AutoShift options:', error);
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
          AutoShiftNames: [{ label: 'Select', value: null }],
          AutoShiftCodes: [{ label: 'Select', value: null }]
        };
      }
  
      const transformed = {
        AutoShiftNames: [
          { label: 'Select', value: null },
          ...data.map(AutoShift => ({
            label: AutoShift.AutoShiftName,
            value: AutoShift.AutoShiftName
          }))
        ],
        AutoShiftCodes: [
          { label: 'Select', value: null },
          ...data.map(AutoShift => ({
            label: AutoShift.AutoShiftCode,
            value: AutoShift.AutoShiftCode
          }))
        ]
      };
      
      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  // Fetch filtered AutoShifts based on search params
// Fetch filtered AutoShifts based on search params
const { data: AutoShiftData, isLoading, isError, error } = useQuery({
  queryKey: ['AutoShifts', currentPage, searchParams],
  queryFn: async () => {
    const requestBody = {
      page: currentPage - 1,
      size: 10,
      ...(searchParams.AutoShiftCode && { AutoShiftCode: searchParams.AutoShiftCode }),
      ...(searchParams.AutoShiftName && { AutoShiftName: searchParams.AutoShiftName })
    };

    const response = await fetch(AutoShift_LIST, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) throw new Error('Failed to fetch AutoShifts');
    
    const data = await response.json();
    console.log('Filtered AutoShift data:', data);
    return data;
  },
  enabled: !!token,
  keepPreviousData: true
});

  const handleSearchSubmit = (values) => {
    console.log('Search form submitted with values:', values);
    setSearchParams({
      AutoShiftCode: values.AutoShiftCode,
      AutoShiftName: values.AutoShiftName
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((AutoShiftData?.totalElements || 0) / 10);

  if (isError) {
    toast.error(error.message);
    return <div>Error loading AutoShifts</div>;
  }

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">AutoShift List</h2>
        <button
          onClick={() => navigate("/admin/ETMS/AutoShift/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add AutoShift
        </button>
      </div>

      {/* Search Form */}
      <div className='items-center justify-center'>
        <Formik
          initialValues={{
            AutoShiftCode: null,
            AutoShiftName: null
          }}
          onSubmit={handleSearchSubmit}
        >
          {({ setFieldValue, values, handleSubmit }) => (
            <Form>
              <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                <div className="flex-1 min-w-[300px]">
                  <label className="mb-2.5 block text-black">AutoShift Code</label>
                  <ReactSelect
                    name="AutoShiftCode"
                    value={AutoShiftOptions?.AutoShiftCodes?.find(option => option.value === values.AutoShiftCode)}
                    onChange={(option) => {
                      console.log('AutoShift Code selected:', option);
                      setFieldValue('AutoShiftCode', option?.value || null);
                    }}
                    options={AutoShiftOptions?.AutoShiftCodes || []}
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder="Select AutoShift Code"
                    isClearable
                    isLoading={optionsLoading}
                  />
                </div>
                <div className="flex-1 min-w-[300px]">
                  <label className="mb-2.5 block text-black ">AutoShift Name</label>
                  <ReactSelect
                    name="AutoShiftName"
                    value={AutoShiftOptions?.AutoShiftNames?.find(option => option.value === values.AutoShiftName)}
                    onChange={(option) => {
                      console.log('AutoShift Name selected:', option);
                      setFieldValue('AutoShiftName', option?.value || null);
                    }}
                    options={AutoShiftOptions?.AutoShiftNames || []}
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder="Select AutoShift Name"
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
                    AutoShift Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                    AutoShift Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                   Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {AutoShiftData?.content?.length > 0 ? (
                  AutoShiftData.content.map((AutoShift) => (
                    <tr key={AutoShift.id} className="even:bg-gray-50 hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {AutoShift.AutoShiftCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {AutoShift.AutoShiftName}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <div className='flex flex-row gap-3'>
                        <CiEdit color='green' className='cursor-pointer' size={25} onClick={()=>navigate(`/admin/AutoShiftUpdate/${AutoShift.id}`)}/>
                        <MdDelete color='red' className='cursor-pointer' size={25}/>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center">
                      No AutoShifts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {AutoShiftData?.content?.length > 0 && (
              <div className="flex justify-between items-center mt-4 p-4">
                <div className="text-sm text-gray-700">
                  Showing {AutoShiftData.content.length} of {AutoShiftData.totalElements} AutoShifts
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

export default AutoShift;