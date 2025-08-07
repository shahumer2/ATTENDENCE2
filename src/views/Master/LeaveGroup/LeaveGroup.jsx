import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import ReactSelect from 'react-select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { LeaveGroup_LIST } from 'Constants/utils';
import { ADD_LeaveGroup_DATA } from 'Constants/utils';
import { GET_LeaveGroupSearch_URL } from 'Constants/utils';
import { UPDATE_LeaveGroup_URL } from 'Constants/utils';
import { Leavetype_LIST } from 'Constants/utils';
import { ADD_Leavetype_DATA } from 'Constants/utils';
import { GET_LeavetypeSearch_URL } from 'Constants/utils';
import { UPDATE_Leavetype_URL } from 'Constants/utils';

// API endpoints configuration
const API_CONFIG = {
  LeaveGroup: {
    BASE: LeaveGroup_LIST,
    ADD: ADD_LeaveGroup_DATA,
    SEARCH: GET_LeaveGroupSearch_URL,
    UPDATE: UPDATE_LeaveGroup_URL
  },
  LeaveType: {
    BASE: Leavetype_LIST,
    ADD: ADD_Leavetype_DATA,
    SEARCH: GET_LeavetypeSearch_URL,
    UPDATE: UPDATE_Leavetype_URL
  },
};

const LeaveGroup = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('LeaveGroup');
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Get API endpoints for current tab
  const currentApi = API_CONFIG[activeTab];

  // Define columns and form fields for each tab
  const TAB_CONFIG = {
    LeaveGroup: {
      label: 'Leave Group',
      columns: [
        { header: 'Leave Group Code', key: 'leaveGrpCode' },
        { header: 'Leave Group Name', key: 'leaveGrpName' },
        { header: 'Select Any Option', key: 'optionValue', },
        { header: 'Attachment Mandatory', key: 'isAttachmentMandatory', type: 'boolean' }
      ],
      fields: [
        { name: 'leaveGrpCode', label: 'Leave Group Code', type: 'text', required: true },
        { name: 'leaveGrpName', label: 'Leave Group Name', type: 'text', required: true },
        { 
          name: 'optionValue', 
          label: 'Select', 
          type: 'select', 
          options: [
            { label: 'Select', value: null },
            { label: 'Allow leave AnyTime', value: 'Allow leave AnyTime' },
            { label: 'Allow leave after confirmation', value: 'Allow leave after confirmation' },
            { label: 'Allow leave If Employee Has Served At Least 3 Months', value: 'Allow leave If Employee Has Served At Least 3 Months' }
          ],
          required: true 
        },
        { 
          name: 'isAttachmentMandatory', 
          label: 'Is Attachment Mandatory?', 
          type: 'select', 
          options: [
            { label: 'Select', value: null },
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          required: true 
        }
      ],
      initialValues: { 
        leaveGrpCode: '', 
        leaveGrpName: '',
        optionValue: '',
        isAttachmentMandatory: null
      }
    },
    LeaveType: {
      label: 'Leave Type',
      columns: [
        { header: 'Leave Type Code', key: 'leaveTypeCode' },
        { header: 'Leave Type Name', key: 'leaveTypeName' },
        { header: 'Is Leave?', key: 'isLeave', type: 'boolean' },
        { header: 'Pay Type', key: 'payType' },
        { header: 'Leave Group', key: 'leaveGroupName' },
        { header: 'Active', key: 'active', type: 'boolean' }
      ],
      fields: [
        { name: 'leaveTypeCode', label: 'Leave Type Code', type: 'text', required: true },
        { name: 'leaveTypeName', label: 'Leave Type Name', type: 'text', required: true },
        { 
          name: 'isLeave', 
          label: 'Is Leave?', 
          type: 'select', 
          options: [
            { label: 'Select', value: null },
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ],
          required: true 
        },
        { 
          name: 'payType', 
          label: 'Pay Type', 
          type: 'select', 
          options: [
            { label: 'Select', value: null },
            { label: 'PAID', value: 'PAID' },
            { label: 'UNPAID', value: 'UNPAID' }
          ],
          required: true 
        },
        { 
          name: 'leaveGroup', 
          label: 'Leave Group', 
          type: 'select', 
          options: [], // Will be populated dynamically
          required: true 
        },
        { 
          name: 'active', 
          label: 'Active', 
          type: 'checkbox' 
        }
      ],
      initialValues: { 
        leaveTypeCode: '', 
        leaveTypeName: '',
        isLeave: null,
        payType: null,
        leaveGroup: {id: null},
        active: true
      }
    }
  };

  // Fetch dropdown options for search filters and leave groups for Leave Type
  const { data: dropdownOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['dropdownOptions', activeTab],
    queryFn: async () => {
      try {
        // First fetch leave groups (needed for both tabs)
        const leaveGroupsResponse = await fetch(API_CONFIG.LeaveGroup.BASE, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!leaveGroupsResponse.ok) throw new Error(`HTTP error! status: ${leaveGroupsResponse.status}`);
        const leaveGroups = await leaveGroupsResponse.json();
        
        // For LeaveType tab, we also need to fetch leave types for search options
        if (activeTab === 'LeaveType') {
          const leaveTypesResponse = await fetch(API_CONFIG.LeaveType.BASE, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!leaveTypesResponse.ok) throw new Error(`HTTP error! status: ${leaveTypesResponse.status}`);
          const leaveTypes = await leaveTypesResponse.json();
          console.log(leaveGroups,"inisde slect");
          return {
            leaveGroups: leaveGroups.content.map(group => ({
              label: group.leaveGrpName,
              value: group.id
            })),
            leaveTypeCodes: [
              { label: 'Select Leave Type Code', value: null },
              ...leaveTypes.content.map(item => ({
                label: item.leaveTypeCode,
                value: item.leaveTypeCode
              }))
            ],
            leaveTypeNames: [
              { label: 'Select Leave Type Name', value: null },
              ...leaveTypes.content.map(item => ({
                label: item.leaveTypeName,
                value: item.leaveTypeName
              }))
            ]
          };
        }
        
        // For LeaveGroup tab
        return {
          leaveGroupCodes: [
            { label: 'Select Leave Group Code', value: null },
            ...leaveGroups.content.map(item => ({
              label: item.leaveGrpCode,
              value: item.leaveGrpCode
            }))
          ],
          leaveGroupNames: [
            { label: 'Select Leave Group Name', value: null },
            ...leaveGroups.content.map(item => ({
              label: item.leaveGrpName,
              value: item.leaveGrpName
            }))
          ],
          leaveGroups: leaveGroups.content.map(group => ({
            label: group.leaveGrpName,
            value: group.id
          }))
        };
      } catch (error) {
        console.error(`Error fetching ${activeTab} options:`, error);
        throw error;
      }
    },
    enabled: !!token
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
      console.log(values,"jamshed");
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
    console.log(values,"search");
    // For LeaveGroup tab
    if (activeTab === 'LeaveGroup') {
      setSearchParams({
        leaveGrpCode: values.leaveGrpCode,
        leaveGrpName: values.leaveGrpName
      });
    } 
    // For LeaveType tab
    else {
      setSearchParams({
        leaveTypeCode: values.leaveTypeCode,
        leaveTypeName: values.leaveTypeName,
        active: values.active
      });
    }
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

  const renderField = (field, formikProps) => {
    const { setFieldValue, values } = formikProps;
    
    switch (field.type) {
      case 'select':
        if (field.name === 'leaveGroup') {
          return (
            <ReactSelect
              name={field.name}
              value={dropdownOptions?.leaveGroups?.find(option => option.value === values.leaveGroup?.id)}
              onChange={(option) => setFieldValue('leaveGroup', {id: option?.value || null})}
              options={dropdownOptions?.leaveGroups}
              className="w-full"
              classNamePrefix="react-select"
              placeholder={field.label}
              isClearable
              isLoading={optionsLoading}
            />
          );
        }
        return (
          <ReactSelect
            name={field.name}
            value={field.options.find(option => option.value === values[field.name])}
            onChange={(option) => setFieldValue(field.name, option?.value || null)}
            options={field.name === 'leaveGroup' ? dropdownOptions?.leaveGroups : field.options}
            className="w-full"
            classNamePrefix="react-select"
            placeholder={field.label}
            isClearable
            isLoading={optionsLoading}
          />
        );
      case 'checkbox':
        return (
          <Field
            name={field.name}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        );
      default:
        return (
          <Field
            name={field.name}
            type={field.type}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={field.required}
          />
        );
    }
  };

  const renderTableCell = (item, column) => {
    if (column.type === 'boolean') {
      return item[column.key] ? 'Yes' : 'No';
    }
    return item[column.key];
  };

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
            {(formikProps) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TAB_CONFIG[activeTab].fields.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {renderField(field, formikProps)}
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
                    disabled={formikProps.isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {formikProps.isSubmitting ? 'Saving...' : 'Save'}
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
              // Initialize based on active tab
              ...(activeTab === 'LeaveGroup' ? {
                leaveGrpCode: null,
                leaveGrpName: null
              } : {
                leaveTypeCode: null,
                leaveTypeName: null,
                active: undefined
              })
            }}
            onSubmit={handleSearchSubmit}
          >
            {({ setFieldValue, values, handleSubmit }) => (
              <Form>
                <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                  {/* Code Select */}
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black">
                      {activeTab === 'LeaveGroup' ? 'Leave Grp Code' : 'Leave Type Code'}
                    </label>
                    <ReactSelect
                      name={activeTab === 'LeaveGroup' ? 'leaveGrpCode' : 'leaveTypeCode'}
                      value={
                        activeTab === 'LeaveGroup' 
                          ? dropdownOptions?.leaveGroupCodes?.find(option => option.value === values.leaveGroupCode)
                          : dropdownOptions?.leaveTypeCodes?.find(option => option.value === values.leaveTypeCode)
                      }
                      onChange={(option) => 
                        setFieldValue(
                          activeTab === 'LeaveGroup' ? 'leaveGrpCode' : 'leaveTypeCode', 
                          option?.value || null
                        )
                      }
                      options={
                        activeTab === 'LeaveGroup' 
                          ? dropdownOptions?.leaveGroupCodes 
                          : dropdownOptions?.leaveTypeCodes
                      }
                      className="bg-white dark:bg-form-Field"
                      classNamePrefix="react-select"
                      placeholder={`Select ${activeTab === 'LeaveGroup' ? 'Leave Group' : 'Leave Type'} Code`}
                      isClearable
                      isLoading={optionsLoading}
                    />
                  </div>
                  
                  {/* Name Select */}
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black">
                      {activeTab === 'LeaveGroup' ? 'Leave Group Name' : 'Leave Type Name'}
                    </label>
                    <ReactSelect
                      name={activeTab === 'LeaveGroup' ? 'leaveGrpName' : 'leaveTypeName'}
                      value={
                        activeTab === 'LeaveGroup' 
                          ? dropdownOptions?.leaveGroupNames?.find(option => option.value === values.leaveGroupName)
                          : dropdownOptions?.leaveTypeNames?.find(option => option.value === values.leaveTypeName)
                      }
                      onChange={(option) => 
                        setFieldValue(
                          activeTab === 'LeaveGroup' ? 'leaveGrpName' : 'leaveTypeName', 
                          option?.value || null
                        )
                      }
                      options={
                        activeTab === 'LeaveGroup' 
                          ? dropdownOptions?.leaveGroupNames 
                          : dropdownOptions?.leaveTypeNames
                      }
                      className="bg-white dark:bg-form-Field"
                      classNamePrefix="react-select"
                      placeholder={`Select ${activeTab === 'LeaveGroup' ? 'Leave Group' : 'Leave Type'} Name`}
                      isClearable
                      isLoading={optionsLoading}
                    />
                  </div>
                  
                  {/* Active Status (only for LeaveType) */}
                  {activeTab === 'LeaveType' && (
                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black">Active</label>
                      <ReactSelect
                        name="active"
                        value={[
                          { label: 'All', value: undefined },
                          { label: 'Yes', value: true },
                          { label: 'No', value: false }
                        ].find(option => option.value === values.active)}
                        onChange={(option) => setFieldValue('active', option?.value)}
                        options={[
                          { label: 'All', value: undefined },
                          { label: 'Yes', value: true },
                          { label: 'No', value: false }
                        ]}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select Active Status"
                        isClearable
                      />
                    </div>
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
                            {renderTableCell(item, column)}
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

export default LeaveGroup;