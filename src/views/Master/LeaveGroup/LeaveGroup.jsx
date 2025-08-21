import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import ReactSelect from 'react-select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CiEdit, CiSearch } from "react-icons/ci";
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
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { debounce } from 'lodash';
import { UPDATETOGGLER_Leavetype_URL } from 'Constants/utils';
import { FaEdit } from 'react-icons/fa';
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
    UPDATE: UPDATE_Leavetype_URL,
    statusKey: 'isActive',
    statusUpdate: UPDATETOGGLER_Leavetype_URL
  },
};

const LeaveGroup = () => {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const queryClient = useQueryClient();
  const [isActiveFilter, setIsActiveFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('LeaveGroup');
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
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
        leaveGroup: { id: null },
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
          console.log(leaveGroups, "inisde slect");
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
    queryKey: [activeTab, currentPage, debouncedSearchTerm, isActiveFilter],
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: 10,
        searchTerm: debouncedSearchTerm || "",   // ✅ single search field
        isActive: isActiveFilter,            // ✅ active/inactive filter
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
      console.log(values, "jamshed");
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
    console.log(values, "search");
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
              onChange={(option) => setFieldValue('leaveGroup', { id: option?.value || null })}
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
  console.log(TAB_CONFIG[activeTab].label, "labe___");

  const debounceSearch = useCallback(

    debounce((value) => setDebouncedSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value); // ✅ will update debouncedSearchTerm
  };

  const { mutate: toggleStatus } = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const response = await fetch(`${currentApi.statusUpdate}/${id}/active`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) {
        // parse backend error instead of throwing a plain Error
        const errorData = await response.json();
        // throw structured error so onError can use it
        throw { status: response.status, ...errorData };
      }

      return response.json();



    },
    onSuccess: () => {
      toast.success('Status updated successfully');

      //for refetch
      queryClient.invalidateQueries([activeTab]);

    },
    onError: async (error) => {
      console.log(error, "))((");
      let errorMsg = error.message;
      const employeeData = error.employees || [];




      setErrorModal({
        open: true,
        message: errorMsg,
        employees: employeeData,
        employeeCount: employeeData.length || 0
      });
    }

  });

  const handleStatusChange = (id, currentStatus) => {
    const currentApi = API_CONFIG[activeTab];
    toggleStatus({ id, isActive: !currentStatus, statusKey: currentApi.statusKey });
  };
  return (
    <>
      <div className="flex justify-between pl-8 pt-2 pr-8">
        <h2 className="font-bold text-lg capitalize text-blue-900">{TAB_CONFIG[activeTab].label} </h2>
        <Breadcrumb className="pr-4" items={`Master, ${TAB_CONFIG[activeTab].label}`} />


      </div>

      <div className="p-4 bg-white mt-[5px] ml-8 mr-8 mb-8">
        <div className="border-b border-gray-200 mb-2">
          <nav className="flex -mb-px space-x-8">
            {Object.keys(TAB_CONFIG).map((tab) => (
              <button
                style={{ fontWeight: "600" }}
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchParams({});
                  setCurrentPage(1);
                  resetFormState();
                }}
                className={`whitespace-nowrap py-1 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-b-2 border-blue-500 text-[#242424] text-md'
                  : 'text-[#242424] hover:text-gray-500'
                  }`}
              >
                {TAB_CONFIG[tab].label}
              </button>
            ))}
          </nav>
        </div>
        {/* Header + Add Button */}
        <div className="flex justify-between items-center mb-4">
          {/* Left side: filters only show for Leave Type, else keep empty div */}
          <div>
            {!isAdding && TAB_CONFIG[activeTab].label === "Leave Type" && (
              <div className="flex items-center space-x-4 gap-12 text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={isActiveFilter === null}
                    onChange={() => setIsActiveFilter(null)}
                    className="accent-[#337ab7]"
                  />
                  <span className="capitalize">All {activeTab}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={isActiveFilter === true}
                    onChange={() => setIsActiveFilter(true)}
                    className="accent-[#337ab7]"
                  />
                  <span className="capitalize">Active {activeTab}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={isActiveFilter === false}
                    onChange={() => setIsActiveFilter(false)}
                    className="accent-[#337ab7]"
                  />
                  <span className="capitalize">Inactive {activeTab}</span>
                </label>
              </div>
            )}
          </div>

          {/* Right side: Add button always fixed on the right */}
          {!isAdding && (
            <div>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add {TAB_CONFIG[activeTab].label}
              </button>
            </div>
          )}
        </div>





        {/* Tabs Navigation */}





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
        {/* Add/Edit Form */}


        {/* Search Form */}


        {/* Table */}
        {!isAdding && (

          <>
            <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
              <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
                {activeTab} List
              </h2>

              <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
                <input
                  type="text"
                  placeholder={`Enter The ${activeTab} Code or ${activeTab} Name `}
                  className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {/* Search Icon inside input */}
                <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
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
                            className="  px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold w-[14%]"
                          >
                            {column.header}
                          </th>
                        ))}
                        <th className='w-[60%]'></th>
                        {!isAdding && TAB_CONFIG[activeTab].label === "Leave Type" && (

                          <th className="text-left  py-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-[1%]">
                            Active / InActive
                          </th>
                        )
                        }

                        <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold w-[3%]">
                          Edit
                        </th>
                        <th className="px-2 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold w-[3%]">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData?.content?.length > 0 ? (
                        tableData.content.map((item) => {
                          const { statusKey } = API_CONFIG[activeTab];
                          return (


                            <tr key={item.id} className="even:bg-gray-50 hover:bg-gray-100">
                              {TAB_CONFIG[activeTab].columns.map(column => (
                                <td
                                  key={column.key}
                                  className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                                >
                                  {renderTableCell(item, column)}
                                </td>
                              ))}
                              <td></td>
                              {!isAdding && TAB_CONFIG[activeTab].label === "Leave Type" && (
                                <td className=" py-4 whitespace-nowrap">
                                  <label className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={item[statusKey]}
                                      onChange={() => handleStatusChange(item.id, item[statusKey])}
                                    />
                                    {/* ✅ Smaller size switch */}
                                    <div className="relative w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 
                       after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                       after:h-3 after:w-3 after:transition-all"></div>
                                    <span className="ml-2 text-xs font-medium">
                                      {/* {item[statusKey] ? 'Active' : 'InActive'} */}
                                    </span>
                                  </label>
                                </td>

                              )}
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
                          )
                        })
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
          </>
        )}
      </div>
    </>

  );
};

export default LeaveGroup;