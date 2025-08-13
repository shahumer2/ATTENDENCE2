import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { debounce } from 'lodash';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Select from 'react-select';
import { 
  DEPARTMENT_ADD, 
  DEPARTMENT_LIST, 
  DEPARTMENT_UPDATE,
  DESIGNATION_ADD, 
  DESIGNATION_LIST, 
  DESIGNATION_UPDATE,
  SECTION_ADD,
  SECTION_LIST,
  SECTION_UPDATE,
  CATEGORY_ADD,
  CATEGORY_LIST,
  CATEGORY_UPDATE,
  AWS_ADD,
  AWS_LIST,
  AWS_UPDATE,
  GET_DEPARTMENT_LIST 
} from 'Constants/utils';

const API_CONFIG = {
  department: {
    list: DEPARTMENT_LIST,
    add: DEPARTMENT_ADD,
    update: DEPARTMENT_UPDATE,
    codeKey: 'departmentCode',
    nameKey: 'departmentName',
    fields: ['code', 'name']
  },
  designation: {
    list: DESIGNATION_LIST,
    add: DESIGNATION_ADD,
    update: DESIGNATION_UPDATE,
    codeKey: 'designationCode',
    nameKey: 'designationName',
    fields: ['code', 'name']
  },
  section: {
    list: SECTION_LIST,
    add: SECTION_ADD,
    update: SECTION_UPDATE,
    codeKey: 'sectionCode',
    nameKey: 'sectionName',
    fields: ['code', 'name','department']
  },
  category: {
    list: CATEGORY_LIST,
    add: CATEGORY_ADD,
    update: CATEGORY_UPDATE,
    codeKey: 'categoryCode',
    nameKey: 'categoryName',
    fields: ['code', 'name']
  },
  aws: {
    list: AWS_LIST,
    add: AWS_ADD,
    update: AWS_UPDATE,
    codeKey: 'awsCode',
    nameKey: 'awsName',
    fields: ['code', 'name']
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

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_CONFIG[activeTab].list, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setData(result?.content || []);
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab} data`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, token]);

  // Fetch department options for category dropdown
  // const { data: depOptions, isLoading: optionsLoading } = useQuery(
  //   ['depOptions'],
  //   async () => {
  //     try {
  //       const response = await fetch(GET_DEPARTMENT_LIST, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       if (!response.ok) throw new Error('Failed to fetch departments');
  //       const data = await response.json();
  //       return data?.content || [];
  //     } catch (error) {
  //       toast.error('Error fetching departments');
  //       throw error;
  //     }
  //   },
  //   { enabled: !!token }
  // );


  const { data: depOptions, isLoading: optionssddzLoading } = useQuery({
    queryKey: ['depOptions'],
    queryFn: async () => {
        try {
            const response = await fetch(`${GET_DEPARTMENT_LIST}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
         console.log(data,"leave cat_________________");
            return data;
        } catch (error) {
            console.error('Error fetching FWL options:', error);
            throw error;
        }
    },
    enabled: !!token,
    select: (data) => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data.content);
            return [
                { label: 'Select', value: null, id: null }
            ];
        }

        return [
            { label: 'Select', value: null, id: null },
            ...data.map(cat => ({
                label:cat.departmentName,
                value: cat.id,  // You can use fwl.id as value if preferred
                id: cat.id
            }))
        ];
    }
});





  // Debounce search
  const debounceSearch = useCallback(
    debounce((value) => setDebouncedSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };

  const filteredData = data.filter(item => {
    const { codeKey, nameKey } = API_CONFIG[activeTab];
    const search = debouncedSearchTerm.toLowerCase();
    return (
      item[codeKey]?.toLowerCase().includes(search) ||
      item[nameKey]?.toLowerCase().includes(search)
    );
  });

  // Form handling
  const getValidationSchema = () => {
    let schema = {
      code: Yup.string().required(`${activeTab} code is required`),
      name: Yup.string().required(`${activeTab} name is required`),
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
    };

    if (activeTab === 'section') {
      newItem.department = {id:values.department.value};
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
    };

    if (activeTab === 'section') {
      updatedItem.department = values.department.value;
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
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {Object.keys(API_CONFIG).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold capitalize">{activeTab} List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add {activeTab}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          className="w-full md:w-64 px-4 py-2 border rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const { codeKey, nameKey } = API_CONFIG[activeTab];
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
                })
              ) : (
                <tr>
                  <td colSpan={activeTab === 'section' ? 4 : 3} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <ModalForm
          title={`Add ${activeTab}`}
          initialValues={{
            code: '',
            name: '',
            department: activeTab === 'section' ? null : undefined
          }}
          validationSchema={getValidationSchema()}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          depOptions={depOptions}
          activeTab={activeTab}
        />
      )}

      {showModalUpdate && selectedItem && (
        <ModalForm
          title={`Update ${activeTab}`}
          initialValues={{
            code: selectedItem[API_CONFIG[activeTab].codeKey],
            name: selectedItem[API_CONFIG[activeTab].nameKey],
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
          depOptions={depOptions?.map(dep => ({
            value: dep.id,
            label: dep.departmentName
          }))}
          activeTab={activeTab}
          isUpdate
        />
      )}
    </div>
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