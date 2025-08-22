import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import ReactSelect from 'react-select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CiEdit, CiSearch } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { holiday_LIST } from 'Constants/utils';
import { ADD_holiday_DATA } from 'Constants/utils';
import { debounce } from 'lodash';
import { GET_holidaySearch_URL } from 'Constants/utils';
import { UPDATE_holiday_URL } from 'Constants/utils';
import { HolidayGroup_LIST } from 'Constants/utils';
import { ADD_HolidayGroup_DATA } from 'Constants/utils';
import { GET_HolidayGroupSearch_URL } from 'Constants/utils';
import { UPDATE_HolidayGroup_URL } from 'Constants/utils';
import Tooltip from 'components/Tooltip/Tooltip';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { FaEdit } from 'react-icons/fa';

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isActiveFilter, setIsActiveFilter] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [activeTab, setActiveTab] = useState('Holiday');
  const [searchParams, setSearchParams] = useState({});
 
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
            value: holiday.id,
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
        holidayGroup: {id:""}
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
    queryKey: [activeTab, currentPage, debouncedSearchTerm, isActiveFilter],
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
      
        searchTerm: debouncedSearchTerm || "",   // ✅ single search field
        isActive: isActiveFilter,            // ✅ active/inactive filter
    };

      const response = await fetch(`${currentApi.SEARCH}?page=${page - 1}&size=${pageSize}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) throw new Error(`Failed to fetch ${activeTab} data`);
      
      const data = await response.json();
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);
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
      if (activeTab === 'Holiday') {
               values.holidayGroup = { id: values.holidayGroup }; // ✅ wrap id in object
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



  if (isError) {
    toast.error(error.message);
    return <div>Error loading {activeTab} data</div>;
  }

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
  <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Holiday / Holiday Group</h2>
 
</div>
<Breadcrumb className="pr-4" items={`Master,Holiday / Holiday Group`} />
</div>
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
        
        <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
        <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
        Holiday Group List
        </h2>

        <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
          <input
            type="text"
            placeholder={`Enter The Holiday Group Code or Holiday Group Name `}
            className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* Search Icon inside input */}
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
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
                    <th className='w-[50%]'></th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                    Edit
                    </th>
                    <th className="px-3 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                    Delete
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
                        <td></td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          <div className='flex flex-row gap-3'>
                          <FaEdit size="1.3rem" style={{ color: "#337ab7" }}
                              color='green' 
                              className='cursor-pointer' 
                             
                              onClick={() => handleEdit(item)}
                            />
                           
                          </div>
                        </td>
                        <td>
                        <MdDelete style={{ color: "#d97777" }} size="1.3rem" 
                              color='red' 
                              className='cursor-pointer' 
                           
                              onClick={() => handleDelete(item.id)}
                            />
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
      )}
    </div>
    </>
  );
};

export default HolidayManagement;