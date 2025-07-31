import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import ReactSelect from 'react-select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ADD_Fwl_DATA } from 'Constants/utils';
import { GET_FwlSearch_URL } from 'Constants/utils';
import { Fwl_LIST } from 'Constants/utils';
import { ADD_Religion_DATA } from 'Constants/utils';
import { GET_ReligionSearch_URL } from 'Constants/utils';
import { Religion_LIST } from 'Constants/utils';
import { UPDATE_Religion_URL } from 'Constants/utils';
import { UPDATE_Race_URL } from 'Constants/utils';
import { GET_RaceSearch_URL } from 'Constants/utils';
import { ADD_Race_DATA } from 'Constants/utils';
import { Race_LIST } from 'Constants/utils';
import { Nationality_LIST } from 'Constants/utils';
import { ADD_Nationality_DATA } from 'Constants/utils';
import { GET_NationalitySearch_URL } from 'Constants/utils';
import { UPDATE_Nationality_URL } from 'Constants/utils';
import { Education_LIST } from 'Constants/utils';
import { ADD_Education_DATA } from 'Constants/utils';
import { GET_EducationSearch_URL } from 'Constants/utils';
import { UPDATE_Education_URL } from 'Constants/utils';
import { Bank_LIST } from 'Constants/utils';
import { ADD_Bank_DATA } from 'Constants/utils';
import { GET_BankSearch_URL } from 'Constants/utils';
import { UPDATE_Bank_URL } from 'Constants/utils';
import { Career_LIST } from 'Constants/utils';
import { ADD_Career_DATA } from 'Constants/utils';
import { GET_CareerSearch_URL } from 'Constants/utils';
import { UPDATE_Career_URL } from 'Constants/utils';

// API endpoints configuration
const API_CONFIG = {
  RACE: {
    BASE: Race_LIST,
    ADD: ADD_Race_DATA,
    SEARCH: GET_RaceSearch_URL,
    UPDATE:UPDATE_Race_URL
  },
  RELIGION: {
    BASE: Religion_LIST,
    ADD: ADD_Religion_DATA,
    SEARCH: GET_ReligionSearch_URL,
    UPDATE:UPDATE_Religion_URL
  },
  NATIONALITY: {
    BASE: Nationality_LIST,
    ADD: ADD_Nationality_DATA,
    SEARCH: GET_NationalitySearch_URL,
    UPDATE:UPDATE_Nationality_URL
  },
  EDUCATION: {
    BASE: Education_LIST,
    ADD: ADD_Education_DATA,
    SEARCH: GET_EducationSearch_URL,
    UPDATE:UPDATE_Education_URL
  },
  FUND: {
    BASE: '/api/funds',
    ADD: '/api/funds/addFund',
    SEARCH: '/api/funds/search'
  },
  FWL: {
    BASE: Fwl_LIST,
    ADD: ADD_Fwl_DATA,
    SEARCH: GET_FwlSearch_URL
  },
  DAILY: {
    BASE: '/api/dailies',
    ADD: '/api/dailies/addDaily',
    SEARCH: '/api/dailies/search'
  },
  BANK: {
    BASE: Bank_LIST,
    ADD: ADD_Bank_DATA,
    SEARCH: GET_BankSearch_URL,
    UPDATE:UPDATE_Bank_URL
  },
  COMPONENT: {
    BASE: '/api/components',
    ADD: '/api/components/addComponent',
    SEARCH: '/api/components/search'
  },
  CAREER: {
    BASE: Career_LIST,
    ADD: ADD_Career_DATA,
    SEARCH: GET_CareerSearch_URL,
    UPDATE:UPDATE_Career_URL
  }
};

const Race = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('race');
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Get API endpoints for current tab
  const currentApi = API_CONFIG[activeTab.toUpperCase()];

  // Define columns and form fields for each tab
  const TAB_CONFIG = {
    race: {
      label: 'Race',
      columns: [
        { header: 'Race Code', key: 'raceCode' },
        { header: 'Race Name', key: 'raceName' }
      ],
      fields: [
        { name: 'raceCode', label: 'Race Code', type: 'text', required: true },
        { name: 'raceName', label: 'Race Name', type: 'text', required: true }
      ],
      initialValues: { raceCode: '', raceName: '' }
    },
    religion: {
      label: 'Religion',
      columns: [
        { header: 'Religion Code', key: 'religionCode' },
        { header: 'Religion Name', key: 'religionName' }
      ],
      fields: [
        { name: 'religionCode', label: 'Religion Code', type: 'text', required: true },
        { name: 'religionName', label: 'Religion Name', type: 'text', required: true }
      ],
      initialValues: { religionCode: '', religionName: '' }
    },
    nationality: {
      label: 'Nationality',
      columns: [
        { header: 'Nationality Code', key: 'nationCode' },
        { header: 'Nationality Name', key: 'nationName' },
        { header: 'ir8A Nation Name', key: 'ir8ANationName' }
      ],
      fields: [
        { name: 'nationCode', label: 'Nationality Code', type: 'text', required: true },
        { name: 'nationName', label: 'Nationality Name', type: 'text', required: true },
        { name: 'ir8ANationName', label: 'ir8A Nation Name', type: 'text', required: true }
      ],
      initialValues: { nationCode: '', nationName: '',ir8ANationName:"" }
    },
    education: {
      label: 'Education',
      columns: [
        { header: 'Education Code', key: 'educationCode' },
        { header: 'Education Name', key: 'educationName' },
        { header: 'education Group', key: 'educationGroup' },
        { header: 'education SubGroup', key: 'educationSubGroup' }
      ],
      fields: [
        { name: 'educationCode', label: 'Education Code', type: 'text', required: true },
        { name: 'educationName', label: 'Education Name', type: 'text', required: true },
        { name: 'educationGroup', label: 'education Group', type: 'text', required: true },
        { name: 'educationSubGroup', label: 'education SubGroup', type: 'text', required: true }
      ],
      initialValues: { educationCode: '', educationName: '',educationGroup:"",educationSubGroup:"" }
    },
    fund: {
      label: 'Fund',
      columns: [
        { header: 'Fund Code', key: 'fundCode' },
        { header: 'Fund Name', key: 'fundName' }
      ],
      fields: [
        { name: 'fundCode', label: 'Fund Code', type: 'text', required: true },
        { name: 'fundName', label: 'Fund Name', type: 'text', required: true }
      ],
      initialValues: { fundCode: '', fundName: '' }
    },
    fwl: {
      label: 'FWL',
      columns: [
        { header: 'FWL Code', key: 'fwlCode' },
        { header: 'FWL Name', key: 'fwlName' },
        { header: 'Daily', key: 'daily' },
        { header: 'Max /Month', key: 'maxPerMonth' }
      ],
      fields: [
        { name: 'fwlCode', label: 'FWL Code', type: 'text', required: true },
        { name: 'fwlName', label: 'FWL Name', type: 'text', required: true },
        { name: 'maxPerMonth', label: 'Max Per Month', type: 'number', required: false },
        { name: 'daily', label: 'Daily', type: 'number', required: false }
      ],
      initialValues: { fwlCode: '', fwlName: '', maxPerMonth: 0, daily: 0 }
    },
    daily: {
      label: 'Daily',
      columns: [
        { header: 'Daily Code', key: 'dailyCode' },
        { header: 'Daily Name', key: 'dailyName' }
      ],
      fields: [
        { name: 'dailyCode', label: 'Daily Code', type: 'text', required: true },
        { name: 'dailyName', label: 'Daily Name', type: 'text', required: true }
      ],
      initialValues: { dailyCode: '', dailyName: '' }
    },
    bank: {
      label: 'Bank',
      columns: [
        { header: 'Bank Code', key: 'bankCode' },
        { header: 'Bank Name', key: 'bankName' }
      ],
      fields: [
        { name: 'bankCode', label: 'Bank Code', type: 'text', required: true },
        { name: 'bankName', label: 'Bank Name', type: 'text', required: true }
      ],
      initialValues: { bankCode: '', bankName: '' }
    },
    component: {
      label: 'Component',
      columns: [
        { header: 'Component Code', key: 'componentCode' },
        { header: 'Component Name', key: 'componentName' }
      ],
      fields: [
        { name: 'componentCode', label: 'Component Code', type: 'text', required: true },
        { name: 'componentName', label: 'Component Name', type: 'text', required: true }
      ],
      initialValues: { componentCode: '', componentName: '' }
    },
    career: {
      label: 'Career',
      columns: [
        { header: 'Career Code', key: 'careerCode' },
        { header: 'Career Name', key: 'careerName' }
      ],
      fields: [
        { name: 'careerCode', label: 'Career Code', type: 'text', required: true },
        { name: 'careerName', label: 'Career Name', type: 'text', required: true }
      ],
      initialValues: { careerCode: '', careerName: '' }
    }
  };

  // Fetch dropdown options for search filters
  const { data: dropdownOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['dropdownOptions', activeTab],
    queryFn: async () => {
      try {
        const response = await fetch(currentApi.BASE, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data || [];
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
          ...data.content.map(item => ({
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

      const response = await fetch(currentApi.SEARCH, {
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

  // Mutation for adding/editing records
  const mutation = useMutation({
    mutationFn: async (values) => {
      const url = editingId 
        ? `${currentApi.UPDATE}/${editingId}`
        : currentApi.ADD;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (editingId ? 'Update failed' : 'Create failed'));
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success(editingId ? 'Record updated successfully' : 'Record added successfully');
      queryClient.invalidateQueries([activeTab]);
      resetFormState();
    },
    onError: (error) => {
      toast.error(error.message);
    }
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

  const handleEdit = (item) => {
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`${currentApi.BASE}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Delete failed');
        
        toast.success('Record deleted successfully');
        queryClient.invalidateQueries([activeTab]);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const resetFormState = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleFormSubmit = (values) => {
    mutation.mutate(values);
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
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add {TAB_CONFIG[activeTab].label}
          </button>
        )}
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
                resetFormState();
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

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {editingId ? 'Edit' : 'Add'} {TAB_CONFIG[activeTab].label}
            </h3>
            <button
              onClick={resetFormState}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>
          
          <Formik
            initialValues={editingId 
              ? tableData?.content?.find(item => item.id === editingId) || TAB_CONFIG[activeTab].initialValues
              : TAB_CONFIG[activeTab].initialValues
            }
            onSubmit={handleFormSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TAB_CONFIG[activeTab].fields.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <Field
                        name={field.name}
                        type={field.type}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetFormState}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Search Form */}
      {!isAdding && (
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
      )}

      {/* Table */}
      {!isAdding && (
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
                              onClick={() => handleEdit(item)}
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
      )}
    </div>
  );
};

export default Race;