import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import ReactSelect from 'react-select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { holiday_LIST } from 'Constants/utils';
import { ADD_holiday_DATA } from 'Constants/utils';
import { GET_holidaySearch_URL } from 'Constants/utils';
import { UPDATE_holiday_URL } from 'Constants/utils';
import { HolidayGroup_LIST } from 'Constants/utils';
import { ADD_HolidayGroup_DATA } from 'Constants/utils';
import { GET_HolidayGroupSearch_URL } from 'Constants/utils';
import { UPDATE_HolidayGroup_URL } from 'Constants/utils';

// API endpoints configuration (replace with your actual endpoints)
const API_CONFIG = {
  Holiday: {
    BASE: holiday_LIST,
    ADD: ADD_holiday_DATA,
    SEARCH: GET_holidaySearch_URL,
    UPDATE: UPDATE_holiday_URL
  },
  HolidayGroup: {
    BASE: HolidayGroup_LIST,
    ADD: ADD_HolidayGroup_DATA,
    SEARCH: GET_HolidayGroupSearch_URL,
    UPDATE: UPDATE_HolidayGroup_URL
  },
  AssignHoliday: {
    BASE: '/api/assign-holiday',
    ADD: '/api/assign-holiday',
    SEARCH: '/api/assign-holiday/search',
    UPDATE: '/api/assign-holiday',
    GET_EMPLOYEES: '/api/employees',
    GET_HOLIDAYS: '/api/holidays',
    GET_HOLIDAY_GROUPS: '/api/holiday-groups',
  },
};

const HolidayManagement = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('Holiday');
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Get API endpoints for current tab
  const currentApi = API_CONFIG[activeTab];
  const { data: HolidayGroupOptions, isLoading: optionssLoading } = useQuery({
    queryKey: ['HolidayGroupOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${HolidayGroup_LIST}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw data from API Holiday:', data); // This shows it's an array
        return data;
      } catch (error) {
        console.error('Error fetching DutyRoaster options:', error);
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
          HolidayGroup: [{ label: 'Select', value: null }],
       
        };
      }
  
      const transformed = {
        HolidayGroup: [
          { label: 'Select', value: null },
          ...data.map(holiday => ({
            label: holiday.holidayGrpName,
            value: holiday.holidayGrpName,
            id:holiday.id
          }))
        ],
      
      };
      
      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  console.log(HolidayGroupOptions,"jamshed");

  // Define columns and form fields for each tab
  const TAB_CONFIG = {
    Holiday: {
      label: 'Holiday',
      columns: [
        { header: 'Holiday Date', key: 'holidayDate' },
        { header: 'Holiday Name', key: 'holidayName' },
        { header: 'reasonName', key: 'reasonName' },
        { header: 'holidayGroup', key: 'holidayGroup' },
      ],
      fields: [
        { name: 'holidayDate', label: 'Holiday Date (dd-mm-yyyy)', type: 'date', required: true },
        { name: 'holidayName', label: 'Holiday Name', type: 'text', required: true },
        { name: 'reasonName', label: 'reasonName', type: 'text', required: false },
        { 
          name: 'holidayGroup', 
          label: 'Type', 
          type: 'select', 
          options: HolidayGroupOptions?.HolidayGroup || [],
          required: true 
        },
      ],
      initialValues: { 
        holidayDate: '', 
        holidayName: '', 
        reasonName: '', 
        holidayGroup: '' 
      }
    },
    HolidayGroup: {
      label: 'Holiday Group',
      columns: [
        { header: 'Holiday Group Code', key: 'holidayGrpCode' },
        { header: 'Holiday Group Name', key: 'holidayGrpName' },
      ],
      fields: [
        { name: 'holidayGrpCode', label: 'Holiday Group Code', type: 'text', required: true },
        { name: 'holidayGrpName', label: 'Holiday Group Name', type: 'text', required: true },
      ],
      initialValues: { 
        holidayGrpCode: '', 
        holidayGrpName: '' 
      }
    },
    AssignHoliday: {
      label: 'Assign Holiday',
      columns: [
        { header: 'Employee Code', key: 'employeeCode' },
        { header: 'Employee Name', key: 'employeeName' },
        { header: 'Holiday Group', key: 'holidayGrpCode' },
      ],
      fields: [
        { 
          name: 'employeeCode', 
          label: 'Employee', 
          type: 'select', 
          options: [], // Will be populated from API
          required: true 
        },
        { 
          name: 'holidayGrpCode', 
          label: 'Holiday Group', 
          type: 'select', 
          options: [], // Will be populated from API
          required: true 
        },
      ],
      initialValues: { 
        employeeCode: '', 
        holidayGrpCode: '' 
      }
    },
  };

  // Fetch dropdown options for search filters and form selects
  const { data: dropdownOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['dropdownOptions', activeTab],
    queryFn: async () => {
      try {
        // For AssignHoliday tab, we need to fetch additional data
        if (activeTab === 'AssignHoliday') {
          const [employeesRes, holidayGroupsRes] = await Promise.all([
            fetch(API_CONFIG.AssignHoliday.GET_EMPLOYEES, {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(API_CONFIG.AssignHoliday.GET_HOLIDAY_GROUPS, {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
          ]);
          
          if (!employeesRes.ok || !holidayGroupsRes.ok) {
            throw new Error('Failed to fetch dropdown options');
          }
          
          const employees = await employeesRes.json();
          const holidayGroups = await holidayGroupsRes.json();
          
          return {
            employees: employees.content || employees,
            holidayGroups: holidayGroups.content || holidayGroups,
          };
        } else {
          // For other tabs
          const response = await fetch(currentApi.BASE, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const data = await response.json();
          return data.content || data;
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} options:`, error);
        throw error;
      }
    },
    enabled: !!token,
    select: (data) => {
      if (activeTab === 'AssignHoliday') {
        return {
          employeeOptions: [
            { label: 'Select Employee', value: null },
            ...data.employees.map(emp => ({
              label: `${emp.employeeCode} - ${emp.employeeName}`,
              value: emp.employeeCode,
              name: emp.employeeName
            }))
          ],
          holidayGroupOptions: [
            { label: 'Select Holiday Group', value: null },
            ...data.holidayGroups.map(group => ({
              label: `${group.holidayGrpCode} - ${group.holidayGrpName}`,
              value: group.holidayGrpCode
            }))
          ]
        };
      } else {
        const codeKey = activeTab === 'Holiday' ? 'holidayName' : `${activeTab.toLowerCase()}Code`;
        const nameKey = activeTab === 'Holiday' ? 'holidayName' : `${activeTab.toLowerCase()}Name`;
        
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
      // For AssignHoliday, we need to transform the data
      if (activeTab === 'AssignHoliday') {
        const employee = dropdownOptions.employeeOptions.find(
          opt => opt.value === values.employeeCode
        );
        values.employeeName = employee?.name || '';
      }

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
    // Transform search values based on active tab
    let searchParams = {};
    
    if (activeTab === 'Holiday') {
      searchParams = {
        holidayName: values.holidayName,
        type: values.type
      };
    } else if (activeTab === 'HolidayGroup') {
      searchParams = {
        holidayGrpCode: values.holidayGrpCode,
        holidayGrpName: values.holidayGrpName
      };
    } else if (activeTab === 'AssignHoliday') {
      searchParams = {
        employeeCode: values.employeeCode,
        holidayGrpCode: values.holidayGrpCode
      };
    }
    
    setSearchParams(searchParams);
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
        <h2 className="text-xl font-semibold">Holiday Management</h2>
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
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TAB_CONFIG[activeTab].fields.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <ReactSelect
                          name={field.name}
                          value={
                            activeTab === 'AssignHoliday' 
                              ? dropdownOptions?.[`${field.name}Options`]?.find(opt => opt.value === values[field.name])
                              : field.options?.find(opt => opt.value === values[field.name])
                          }
                          onChange={(option) => setFieldValue(field.name, option?.value || '')}
                          options={
                            activeTab === 'AssignHoliday' 
                              ? dropdownOptions?.[`${field.name}Options`] || []
                              : field.options || []
                          }
                          className="w-full"
                          classNamePrefix="react-select"
                          placeholder={`Select ${field.label}`}
                          isClearable
                          isLoading={optionsLoading}
                        />
                      ) : (
                        <Field
                          name={field.name}
                          type={field.type}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required={field.required}
                        />
                      )}
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
              ...(activeTab === 'Holiday' ? { 
                holidayName: null,
                type: null 
              } : activeTab === 'HolidayGroup' ? { 
                holidayGrpCode: null,
                holidayGrpName: null 
              } : { 
                employeeCode: null,
                holidayGrpCode: null 
              })
            }}
            onSubmit={handleSearchSubmit}
          >
            {({ setFieldValue, values, handleSubmit }) => (
              <Form>
                <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                  {activeTab === 'Holiday' ? (
                    <>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black">Holiday Name</label>
                        <ReactSelect
                          name="holidayName"
                          value={dropdownOptions?.names?.find(option => option.value === values.holidayName)}
                          onChange={(option) => setFieldValue('holidayName', option?.value || null)}
                          options={dropdownOptions?.names || []}
                          className="bg-white"
                          classNamePrefix="react-select"
                          placeholder="Select Holiday Name"
                          isClearable
                          isLoading={optionsLoading}
                        />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black">Type</label>
                        <ReactSelect
                          name="type"
                          value={TAB_CONFIG.Holiday.fields.find(f => f.name === 'type')?.options?.find(opt => opt.value === values.type)}
                          onChange={(option) => setFieldValue('type', option?.value || null)}
                          options={TAB_CONFIG.Holiday.fields.find(f => f.name === 'type')?.options || []}
                          className="bg-white"
                          classNamePrefix="react-select"
                          placeholder="Select Type"
                          isClearable
                        />
                      </div>
                    </>
                  ) : activeTab === 'HolidayGroup' ? (
                    <>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black">Holiday Group Code</label>
                        <ReactSelect
                          name="holidayGrpCode"
                          value={dropdownOptions?.codes?.find(option => option.value === values.holidayGrpCode)}
                          onChange={(option) => setFieldValue('holidayGrpCode', option?.value || null)}
                          options={dropdownOptions?.codes || []}
                          className="bg-white"
                          classNamePrefix="react-select"
                          placeholder="Select Holiday Group Code"
                          isClearable
                          isLoading={optionsLoading}
                        />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black">Holiday Group Name</label>
                        <ReactSelect
                          name="holidayGrpName"
                          value={dropdownOptions?.names?.find(option => option.value === values.holidayGrpName)}
                          onChange={(option) => setFieldValue('holidayGrpName', option?.value || null)}
                          options={dropdownOptions?.names || []}
                          className="bg-white"
                          classNamePrefix="react-select"
                          placeholder="Select Holiday Group Name"
                          isClearable
                          isLoading={optionsLoading}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black">Employee</label>
                        <ReactSelect
                          name="employeeCode"
                          value={dropdownOptions?.employeeOptions?.find(option => option.value === values.employeeCode)}
                          onChange={(option) => setFieldValue('employeeCode', option?.value || null)}
                          options={dropdownOptions?.employeeOptions || []}
                          className="bg-white"
                          classNamePrefix="react-select"
                          placeholder="Select Employee"
                          isClearable
                          isLoading={optionsLoading}
                        />
                      </div>
                      <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black">Holiday Group</label>
                        <ReactSelect
                          name="holidayGrpCode"
                          value={dropdownOptions?.holidayGroupOptions?.find(option => option.value === values.holidayGrpCode)}
                          onChange={(option) => setFieldValue('holidayGrpCode', option?.value || null)}
                          options={dropdownOptions?.holidayGroupOptions || []}
                          className="bg-white"
                          classNamePrefix="react-select"
                          placeholder="Select Holiday Group"
                          isClearable
                          isLoading={optionsLoading}
                        />
                      </div>
                    </>
                  )}
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

export default HolidayManagement;