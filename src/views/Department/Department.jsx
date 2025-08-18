import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { debounce } from 'lodash';
import { useQuery, useMutation } from '@tanstack/react-query';
import Select from 'react-select';
import { DEPARTMENT_LIST } from 'Constants/utils';
import { DEPARTMENT_ADD } from 'Constants/utils';
import { DEPARTMENT_UPDATE } from 'Constants/utils';
import { DESIGNATION_LIST } from 'Constants/utils';
import { DESIGNATION_ADD } from 'Constants/utils';
import { DESIGNATION_UPDATE } from 'Constants/utils';
import { SECTION_LIST } from 'Constants/utils';
import { SECTION_ADD } from 'Constants/utils';
import { SECTION_UPDATE } from 'Constants/utils';
import { CATEGORY_LIST } from 'Constants/utils';
import { CATEGORY_ADD } from 'Constants/utils';
import { CATEGORY_UPDATE } from 'Constants/utils';
import { AWS_LIST } from 'Constants/utils';
import { AWS_ADD } from 'Constants/utils';
import { AWS_UPDATE } from 'Constants/utils';
import { DEPARTMENT_SEARCH } from 'Constants/utils';
import { DEPARTMENT_STATUS_UPDATE } from 'Constants/utils';
import { DESIGNATIONS_Search } from 'Constants/utils';
import { CiSearch } from "react-icons/ci";

const API_CONFIG = {
  department: {
    list: DEPARTMENT_SEARCH,
    add: DEPARTMENT_ADD,
    update: DEPARTMENT_UPDATE,
    statusUpdate: DEPARTMENT_STATUS_UPDATE, // Add this for status updates
    codeKey: 'departmentCode',
    nameKey: 'departmentName',
    statusKey: 'isActive',
    fields: ['code', 'name', 'isActive']
  },
  designation: {
    list: DESIGNATIONS_Search,
    add: DESIGNATION_ADD,
    update: DESIGNATION_UPDATE,
    statusUpdate: DESIGNATION_UPDATE,
    codeKey: 'designationCode',
    nameKey: 'designationName',
    statusKey: 'isActive',
    fields: ['code', 'name', 'isActive']
  },
  section: {
    list: SECTION_LIST,
    add: SECTION_ADD,
    update: SECTION_UPDATE,
    statusUpdate: SECTION_UPDATE,
    codeKey: 'sectionCode',
    nameKey: 'sectionName',
    statusKey: 'isActive',
    fields: ['code', 'name', 'isActive', 'department']
  },
  category: {
    list: CATEGORY_LIST,
    add: CATEGORY_ADD,
    update: CATEGORY_UPDATE,
    statusUpdate: CATEGORY_UPDATE,
    codeKey: 'categoryCode',
    nameKey: 'categoryName',
    statusKey: 'isActive',
    fields: ['code', 'name', 'isActive']
  },
  aws: {
    list: AWS_LIST,
    add: AWS_ADD,
    update: AWS_UPDATE,
    statusUpdate: AWS_UPDATE,
    codeKey: 'awsCode',
    nameKey: 'awsName',
    statusKey: 'isActive',
    fields: ['code', 'name', 'isActive']
  }
};

const Department = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [activeTab, setActiveTab] = useState('department');
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isActiveFilter, setIsActiveFilter] = useState(null); // null = all, true = active, false = inactive
  // Add this inside your Department component, before the fetchData function
  const { data: departmentOptions } = useQuery({
    queryKey: ['departmentOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(DEPARTMENT_LIST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const result = await response.json();
        return result?.content || [];
      } catch (error) {
        toast.error('Error fetching departments');
        throw error;
      }
    },
    enabled: !!token && activeTab === 'section',
    select: (data) => {
      return [
        { label: 'Select Department', value: null },
        ...data.map(dep => ({
          label: dep.departmentName,
          value: dep.id
        }))
      ];
    }
  });
  // Fetch data with POST request and body
  const fetchData = useCallback(async () => {
    console.log(debouncedSearchTerm, isActiveFilter, "____________________=");
    setLoading(true);
    try {
      const response = await fetch(API_CONFIG[activeTab].list, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          searchTerm: debouncedSearchTerm || undefined,
          isActive: isActiveFilter !== null ? isActiveFilter : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${activeTab} data`);
      }

      const result = await response.json();
      setData(result?.content || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token, debouncedSearchTerm, isActiveFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Status toggle mutation
  const { mutate: toggleStatus } = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const response = await fetch(`${API_CONFIG[activeTab].statusUpdate}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Status updated successfully');
      fetchData();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleStatusChange = (id, currentStatus) => {
    toggleStatus({ id, isActive: !currentStatus });
  };

  // Debounce search
  const debounceSearch = useCallback(
    debounce((value) => setDebouncedSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };

  // Form handling
  const getValidationSchema = () => {
    let schema = {
      code: Yup.string().required(`${activeTab} code is required`),
      name: Yup.string().required(`${activeTab} name is required`),
      isActive: Yup.boolean().required('Status is required'),
    };

    if (activeTab === 'section') {
      schema.department = Yup.object().required('Department is required');
    }

    return Yup.object().shape(schema);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const config = API_CONFIG[activeTab];
    let newItem = {
      [config.codeKey]: values.code,
      [config.nameKey]: values.name,
      [config.statusKey]: values.isActive,
    };

    if (activeTab === 'section') {
      newItem.department = { id: values.department.value };
    }

    try {
      const response = await fetch(config.add, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        toast.success(`${activeTab} added successfully`);
        resetForm();
        setShowModal(false);
        fetchData();
      } else {
        throw new Error('Failed to add');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateSubmit = async (values, { resetForm }) => {
    if (!selectedItem) return;

    const config = API_CONFIG[activeTab];
    let updatedItem = {
      id: selectedItem.id,
      [config.codeKey]: values.code,
      [config.nameKey]: values.name,
      [config.statusKey]: values.isActive,
    };

    if (activeTab === 'section') {
      updatedItem.department = { id: values.department.value };
    }

    try {
      const response = await fetch(`${config.update}/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        toast.success(`${activeTab} updated successfully`);
        resetForm();
        setShowModalUpdate(false);
        fetchData();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <h2 className='mt-4 ml-7 mb-[-20px] font-semibold text-xl capitalize text-blue-900'>{activeTab}</h2>

      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">

        {/* Tabs */}
        <div className="flex border-b mb-6 mt-[-13px] ml-[-15px]">
          {Object.keys(API_CONFIG).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium capitalize ${activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => {
                setActiveTab(tab);
                setSearchTerm('');
                setDebouncedSearchTerm('');
                setIsActiveFilter(null);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Header + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center mb-4 space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="statusFilter"
                checked={isActiveFilter === null}
                onChange={() => setIsActiveFilter(null)}
              />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="statusFilter"
                checked={isActiveFilter === true}
                onChange={() => setIsActiveFilter(true)}
              />
              <span>Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="statusFilter"
                checked={isActiveFilter === false}
                onChange={() => setIsActiveFilter(false)}
              />
              <span>Inactive</span>
            </label>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add {activeTab}
          </button>
        </div>

        {/* Status Filter */}

        <div className="flex justify-between bg-blue-100 items-center">
  <h2 className="text-lg mt-3 text-blue-950 rounded-t-md ml-4 font-semibold capitalize">
    {activeTab} List
  </h2>

  <div className="relative mt-3 mr-2 mb-2 w-full md:w-[350px]">
    <input
      type="text"
      placeholder={`Search ${activeTab}...`}
      className="w-full pl-10 pr-4 py-2 border rounded-xl"
      value={searchTerm}
      onChange={handleSearchChange}
    />
    {/* Search Icon inside input */}
    <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
  </div>
</div>

        {/* Search */}


        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : data.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab} Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab} Name
                  </th>
                  {activeTab === 'section' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => {
                  const { codeKey, nameKey, statusKey } = API_CONFIG[activeTab];
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {item[codeKey]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {item[nameKey]}
                      </td>
                      {activeTab === 'section' && (
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {item.department?.departmentName}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item[statusKey]}
                            onChange={() => handleStatusChange(item.id, item[statusKey])}
                          />
                          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          <span className="ml-3 text-sm font-medium">
                            {item[statusKey] ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowModalUpdate(true);
                          }}
                        >
                          <FaEdit size="1.3rem" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Modals */}
        {showModal && (
          <ModalForm
            title={`Add ${activeTab}`}
            initialValues={{
              code: '',
              name: '',
              isActive: true,
              department: activeTab === 'section' ? null : undefined
            }}
            validationSchema={getValidationSchema()}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
            depOptions={departmentOptions}
            activeTab={activeTab}
          />
        )}

        {showModalUpdate && selectedItem && (
          <ModalForm
            title={`Update ${activeTab}`}
            initialValues={{
              code: selectedItem[API_CONFIG[activeTab].codeKey],
              name: selectedItem[API_CONFIG[activeTab].nameKey],
              isActive: selectedItem[API_CONFIG[activeTab].statusKey],
              department: activeTab === 'section' ? {
                value: selectedItem.department?.id,
                label: selectedItem.department?.departmentName
              } : undefined
            }}
            validationSchema={getValidationSchema()}
            onClose={() => {
              setShowModalUpdate(false);
              setSelectedItem(null);
            }}
            onSubmit={handleUpdateSubmit}
            depOptions={departmentOptions}
            activeTab={activeTab}
            isUpdate
          />
        )}
      </div>
    </>
  );
};

const ModalForm = ({
  title,
  initialValues,
  validationSchema,
  onClose,
  onSubmit,
  depOptions,
  activeTab,
  isUpdate
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Code *
                </label>
                <Field
                  name="code"
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter code"
                />
                <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter name"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <Field
                    type="checkbox"
                    name="isActive"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Active</span>
                </label>
                <ErrorMessage name="isActive" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {activeTab === 'section' && (
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Department *
                  </label>
                  <Select
                    name="department"
                    options={depOptions}
                    value={values.department}
                    onChange={(option) => setFieldValue('department', option)}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select department"
                  />
                  <ErrorMessage name="department" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isUpdate ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  </div>
);

export default Department;