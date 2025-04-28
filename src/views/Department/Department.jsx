import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { DEPARTMENT_ADD } from 'Constants/utils';
import { DEPARTMENT_LIST } from 'Constants/utils';
import { DESIGNATION_ADD } from 'Constants/utils';
import { DESIGNATION_LIST } from 'Constants/utils';

// API endpoints configuration
const API_CONFIG = {
  department: {
    list: DEPARTMENT_LIST,
    add: DEPARTMENT_ADD,
    codeKey: 'departmentCode',
    nameKey: 'departmentName'
  },
  designation: {
    list: DESIGNATION_LIST,
    add: DESIGNATION_ADD,
    codeKey: 'designationCode',
    nameKey: 'designationName'
  },
  section: {
    list: 'SECTION_LIST_APIi',
    add: 'SECTION_ADD_API',
    codeKey: 'sectionCode',
    nameKey: 'sectionName'
  },
  category: {
    list: 'CATEGORY_LIST_API',
    add: 'CATEGORY_ADD_API',
    codeKey: 'categoryCode',
    nameKey: 'categoryName'
  },
  aws: {
    list: 'AWS_LIST_API',
    add: 'AWS_ADD_API',
    codeKey: 'awsCode',
    nameKey: 'awsName'
  }
};

const Department = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [activeTab, setActiveTab] = useState('department');
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_CONFIG[activeTab].list, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        setData(result?.content || []);
      } catch (error) {
        toast.error(`Failed to fetch ${activeTab} data`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, token]);

  // Debounce search input
  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceSearch(value);
  };

  const filteredData = data.filter((item) => {
    const codeKey = API_CONFIG[activeTab].codeKey;
    const nameKey = API_CONFIG[activeTab].nameKey;
    
    return (
      item[codeKey]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item[nameKey]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  });

  const initialValues = {
    code: '',
    name: '',
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required(`${activeTab} code is required`),
    name: Yup.string().required(`${activeTab} name is required`),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const newItem = {
      [API_CONFIG[activeTab].codeKey]: values.code,
      [API_CONFIG[activeTab].nameKey]: values.name,
    };

    try {
      const response = await fetch(API_CONFIG[activeTab].add, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`${activeTab} added successfully`);
        resetForm();
        setShowModal(false);
        // Refresh the list after adding
        setData((prev) => [...prev, newItem]);
      } else {
        toast.error(result.message || `Failed to add ${activeTab}`);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error(error);
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const codeKey = API_CONFIG[activeTab].codeKey;
                  const nameKey = API_CONFIG[activeTab].nameKey;
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {item[codeKey]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {item[nameKey]}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Add {activeTab}</h3>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        {activeTab} Code *
                      </label>
                      <Field
                        name="code"
                        type="text"
                        className="w-full px-3 py-2 border rounded"
                        placeholder={`Enter ${activeTab} code`}
                      />
                      <ErrorMessage
                        name="code"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        {activeTab} Name *
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="w-full px-3 py-2 border rounded"
                        placeholder={`Enter ${activeTab} name`}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;