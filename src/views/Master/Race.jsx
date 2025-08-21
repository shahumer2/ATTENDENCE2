import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import ReactSelect from 'react-select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CiEdit, CiSearch } from "react-icons/ci";
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
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { UPDATEToggler_Race_URL } from 'Constants/utils';
import { UPDATETOGGLER_Religion_URL } from 'Constants/utils';
import { UPDATETOGGLER_Nationality_URL } from 'Constants/utils';
import { UPDATETOGGLER_Education_URL } from 'Constants/utils';
import { UPDATETOGGLER_Fwl_URL } from 'Constants/utils';
import { UPDATETOGGLER_Bank_URL } from 'Constants/utils';
import { UPDATETOGGLER_Career_URL } from 'Constants/utils';
import { FaEdit } from 'react-icons/fa';

// API endpoints configuration
const API_CONFIG = {
  RACE: {
    BASE: Race_LIST,
    ADD: ADD_Race_DATA,
    SEARCH: GET_RaceSearch_URL,
    UPDATE: UPDATE_Race_URL,
    statusUpdate: UPDATEToggler_Race_URL,
    statusKey: 'isActive',
  },
  RELIGION: {
    BASE: Religion_LIST,
    ADD: ADD_Religion_DATA,
    SEARCH: GET_ReligionSearch_URL,
    UPDATE: UPDATE_Religion_URL,
    statusUpdate: UPDATETOGGLER_Religion_URL,
    statusKey: 'isActive',
  },
  NATIONALITY: {
    BASE: Nationality_LIST,
    ADD: ADD_Nationality_DATA,
    SEARCH: GET_NationalitySearch_URL,
    UPDATE: UPDATE_Nationality_URL,
    statusUpdate: UPDATETOGGLER_Nationality_URL,
    statusKey: 'isActive',
  },
  EDUCATION: {
    BASE: Education_LIST,
    ADD: ADD_Education_DATA,
    SEARCH: GET_EducationSearch_URL,
    UPDATE: UPDATE_Education_URL,
    statusUpdate: UPDATETOGGLER_Education_URL,
    statusKey: 'isActive',
  },
  FUND: {
    BASE: Fwl_LIST,
    ADD: ADD_Fwl_DATA,
    SEARCH: GET_FwlSearch_URL,
    statusUpdate: UPDATETOGGLER_Fwl_URL,
    statusKey: 'isActive',
  },
  FWL: {
    BASE: Fwl_LIST,
    ADD: ADD_Fwl_DATA,
    SEARCH: GET_FwlSearch_URL,
    statusUpdate: UPDATETOGGLER_Fwl_URL,
    statusKey: 'isActive',
  },
  DAILY: {
    BASE: Bank_LIST,
    ADD: ADD_Bank_DATA,
    SEARCH: GET_BankSearch_URL,
    UPDATE: UPDATE_Bank_URL,
    statusUpdate: UPDATETOGGLER_Bank_URL,
    statusKey: 'isActive',
  },
  BANK: {
    BASE: Bank_LIST,
    ADD: ADD_Bank_DATA,
    SEARCH: GET_BankSearch_URL,
    UPDATE: UPDATE_Bank_URL,
    statusUpdate: UPDATETOGGLER_Bank_URL,
    statusKey: 'isActive',
  },
  COMPONENT: {
    BASE: Career_LIST,
    ADD: ADD_Career_DATA,
    SEARCH: GET_CareerSearch_URL,
    UPDATE: UPDATE_Career_URL,
    statusUpdate: UPDATETOGGLER_Career_URL,
    statusKey: 'isActive',
  },
  CAREER: {
    BASE: Career_LIST,
    ADD: ADD_Career_DATA,
    SEARCH: GET_CareerSearch_URL,
    UPDATE: UPDATE_Career_URL,
    statusUpdate: UPDATETOGGLER_Career_URL,
    statusKey: 'isActive',
  }
};

const Race = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const queryClient = useQueryClient();
  const [isActiveFilter, setIsActiveFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('race');
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: '',
    employees: []
  });
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
      initialValues: { nationCode: '', nationName: '', ir8ANationName: "" }
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
      initialValues: { educationCode: '', educationName: '', educationGroup: "", educationSubGroup: "" }
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  // Fetch dropdown options for search filters


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
      const result = await response.json();

      setTotalPages(result?.totalPages || 1);
      setTotalRecords(result?.totalElements || 0);
      return result

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
  //status toggler chnage

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
    const currentApi = API_CONFIG[activeTab.toUpperCase()];
    toggleStatus({ id, isActive: !currentStatus, statusKey: currentApi.statusKey });
  };



  return (
    <>
      <div className="flex justify-between pl-8 pt-2 pr-8">
        <h2 className="font-bold text-lg capitalize text-blue-900">{TAB_CONFIG[activeTab].label} Management</h2>
        <Breadcrumb className="pr-4" items={`Master, ${TAB_CONFIG[activeTab].label}`} />


      </div>
      <div className="p-4 bg-white mt-[5px] ml-8 mr-8 mb-8">
        {/* Header + Add Button */}


        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
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
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-b-2 border-blue-500 text-[#242424] text-md'
                  : 'text-[#242424] hover:text-gray-500'
                  }`}
              >
                {TAB_CONFIG[tab].label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex justify-between items-center mb-4">
          
          <div className="flex items-center mb-4 space-x-4 gap-12 text-sm">
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
              <span className="capitalize">InActive {activeTab}</span>
            </label>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add {TAB_CONFIG[activeTab].label}
            </button>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">


        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
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
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%] mr-[300px]"
                          >
                            {column.header}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80%] "></th>
                        <th className="text-left  py-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-[1%]">
                          Active / InActive
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[1%]">
                          Edit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[1%]">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData?.content?.length > 0 ? (
                        tableData.content.map((item) => {
                          const { statusKey } = API_CONFIG[activeTab.toUpperCase()];

                          return (
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
                                  className='cursor-pointer ml-8'

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
  {/* ✅ Pagination & Controls OUTSIDE table */}
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
                  {errorModal.open && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-[900px]">
                        <h2 className="text-lg font-semibold text-black-600 mb-4 capitalize rounded-md">{activeTab}</h2>
                        <hr></hr>
                        <p className="mb-4  text-white p-3" style={{ backgroundColor: '#d97777e3' }}>{errorModal.message}</p>

                        {errorModal.employees.length > 0 && (
                          <table
                            className="w-full border border-gray-300 overflow-scroll font-extralight"
                            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                          >
                            <thead className='text-sm'>
                              <tr className="bg-gray-100">
                                <th className="p-2 border font-sm w-[250px] text-left" style={{ fontWeight: "700" }}>Employee Code</th>
                                <th className="p-2 border w-[650px] text-left">Employee Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {errorModal.employees.map((emp, idx) => (
                                <tr key={idx}>
                                  <td className="p-2 border">{emp.employeeCode}</td>
                                  <td className="p-2 border">{emp.employeeName}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        <div className="flex justify-end mt-4 gap-2">
                          <button

                            className="px-8 border py-2 bg-white-500 text-black rounded"
                          >
                            Total Record: {errorModal.employeeCount}
                          </button>
                          <button
                            onClick={() => setErrorModal({ open: false, message: '', employees: [], employeeCount: 0 })}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Race;