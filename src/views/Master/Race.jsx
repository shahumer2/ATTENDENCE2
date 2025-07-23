import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

// API endpoints (replace with your actual endpoints)
const API_ENDPOINTS = {
  RACE: '/api/races',
  RELIGION: '/api/religions',
  NATIONALITY: '/api/nationalities',
  EDUCATION: '/api/educations',
  FUND: '/api/funds',
  FWL: '/api/fwls',
  DAILY: '/api/dailies',
  BANK: '/api/banks',
  COMPONENT: '/api/components',
  CAREER: '/api/careers'
};

const Race = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('race');
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Define columns for each tab
  const TAB_CONFIG = {
    race: {
      label: 'Race',
      columns: [
        { header: 'Race Code', key: 'raceCode' },
        { header: 'Race Name', key: 'raceName' }
      ]
    },
    religion: {
      label: 'Religion',
      columns: [
        { header: 'Religion Code', key: 'religionCode' },
        { header: 'Religion Name', key: 'religionName' }
      ]
    },
    nationality: {
      label: 'Nationality',
      columns: [
        { header: 'Nationality Code', key: 'nationalityCode' },
        { header: 'Nationality Name', key: 'nationalityName' }
      ]
    },
    education: {
      label: 'Education',
      columns: [
        { header: 'Education Code', key: 'educationCode' },
        { header: 'Education Name', key: 'educationName' }
      ]
    },
    fund: {
      label: 'Fund',
      columns: [
        { header: 'Fund Code', key: 'fundCode' },
        { header: 'Fund Name', key: 'fundName' }
      ]
    },
    fwl: {
      label: 'FWL',
      columns: [
        { header: 'FWL Code', key: 'fwlCode' },
        { header: 'FWL Name', key: 'fwlName' }
      ]
    },
    daily: {
      label: 'Daily',
      columns: [
        { header: 'Daily Code', key: 'dailyCode' },
        { header: 'Daily Name', key: 'dailyName' }
      ]
    },
    bank: {
      label: 'Bank',
      columns: [
        { header: 'Bank Code', key: 'bankCode' },
        { header: 'Bank Name', key: 'bankName' }
      ]
    },
    component: {
      label: 'Component',
      columns: [
        { header: 'Component Code', key: 'componentCode' },
        { header: 'Component Name', key: 'componentName' }
      ]
    },
    career: {
      label: 'Career',
      columns: [
        { header: 'Career Code', key: 'careerCode' },
        { header: 'Career Name', key: 'careerName' }
      ]
    }
  };

  // Fetch dropdown options for search filters
  const { data: dropdownOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['dropdownOptions', activeTab],
    queryFn: async () => {
      try {
        const response = await fetch(API_ENDPOINTS[activeTab.toUpperCase()], {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data?.content || [];
      } catch (error) {
        console.error(`Error fetching ${activeTab} options:`, error);
        throw error;
      }
    },
    enabled: !!token,
    select: (data) => {
      const codeKey = `${activeTab}Code`;
      const nameKey = `${activeTab}Name`;
      
      return {
        codes: [
          { label: 'Select', value: null },
          ...data.map(item => ({
            label: item[codeKey],
            value: item[codeKey]
          }))
        ],
        names: [
          { label: 'Select', value: null },
          ...data.map(item => ({
            label: item[nameKey],
            value: item[nameKey]
          }))
        ]
      };
    }
  });

  // Fetch table data
  const { data: tableData, isLoading, isError, error } = useQuery({
    queryKey: [activeTab, currentPage, searchParams],
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: 10,
        ...searchParams
      };

      const response = await fetch(`${API_ENDPOINTS[activeTab.toUpperCase()]}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) throw new Error(`Failed to fetch ${activeTab} data`);
      
      const data = await response.json();
      return data;
    },
    enabled: !!token,
    keepPreviousData: true
  });

  const handleSearchSubmit = (values) => {
    const codeKey = `${activeTab}Code`;
    const nameKey = `${activeTab}Name`;
    
    setSearchParams({
      [codeKey]: values[codeKey],
      [nameKey]: values[nameKey]
    });
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/admin/${activeTab}/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS[activeTab.toUpperCase()]}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Delete failed');
        
        toast.success('Record deleted successfully');
        // Invalidate queries to refresh data
        queryClient.invalidateQueries([activeTab]);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const totalPages = Math.ceil((tableData?.totalElements || 0) / 10);

  if (isError) {
    toast.error(error.message);
    return <div>Error loading {activeTab} data</div>;
  }

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{TAB_CONFIG[activeTab].label} Management</h2>
        <button
          onClick={() => navigate(`/admin/${activeTab}/add`)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add {TAB_CONFIG[activeTab].label}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          {Object.keys(TAB_CONFIG).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchParams({});
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {TAB_CONFIG[tab].label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search Form */}
      <div className='items-center justify-center'>
        <Formik
          initialValues={{
            [`${activeTab}Code`]: null,
            [`${activeTab}Name`]: null
          }}
          onSubmit={handleSearchSubmit}
        >
          {({ setFieldValue, values, handleSubmit }) => (
            <Form>
              <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                <div className="flex-1 min-w-[300px]">
                  <label className="mb-2.5 block text-black">{TAB_CONFIG[activeTab].label} Code</label>
                  <ReactSelect
                    name={`${activeTab}Code`}
                    value={dropdownOptions?.codes?.find(option => option.value === values[`${activeTab}Code`])}
                    onChange={(option) => setFieldValue(`${activeTab}Code`, option?.value || null)}
                    options={dropdownOptions?.codes || []}
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder={`Select ${TAB_CONFIG[activeTab].label} Code`}
                    isClearable
                    isLoading={optionsLoading}
                  />
                </div>
                <div className="flex-1 min-w-[300px]">
                  <label className="mb-2.5 block text-black">{TAB_CONFIG[activeTab].label} Name</label>
                  <ReactSelect
                    name={`${activeTab}Name`}
                    value={dropdownOptions?.names?.find(option => option.value === values[`${activeTab}Name`])}
                    onChange={(option) => setFieldValue(`${activeTab}Name`, option?.value || null)}
                    options={dropdownOptions?.names || []}
                    className="bg-white dark:bg-form-Field"
                    classNamePrefix="react-select"
                    placeholder={`Select ${TAB_CONFIG[activeTab].label} Name`}
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
                  {TAB_CONFIG[activeTab].columns.map(column => (
                    <th 
                      key={column.key}
                      className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold"
                    >
                      {column.header}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData?.content?.length > 0 ? (
                  tableData.content.map((item) => (
                    <tr key={item.id} className="even:bg-gray-50 hover:bg-gray-100">
                      {TAB_CONFIG[activeTab].columns.map(column => (
                        <td 
                          key={column.key} 
                          className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                        >
                          {item[column.key]}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <div className='flex flex-row gap-3'>
                          <CiEdit 
                            color='green' 
                            className='cursor-pointer' 
                            size={25} 
                            onClick={() => handleEdit(item.id)}
                          />
                          <MdDelete 
                            color='red' 
                            className='cursor-pointer' 
                            size={25}
                            onClick={() => handleDelete(item.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={TAB_CONFIG[activeTab].columns.length + 1} className="px-6 py-4 text-sm text-gray-500 text-center">
                      No {TAB_CONFIG[activeTab].label} records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {tableData?.content?.length > 0 && (
              <div className="flex justify-between items-center mt-4 p-4">
                <div className="text-sm text-gray-700">
                  Showing {tableData.content.length} of {tableData.totalElements} records
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

export default Race;