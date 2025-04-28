import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { debounce } from 'lodash';
import { DEPARTMENT_ADD, DEPARTMENT_LIST, DEPARTMENT_UPDATE } from 'Constants/utils';
import { DESIGNATION_ADD, DESIGNATION_LIST, DESIGNATION_UPDATE } from 'Constants/utils';

const API_CONFIG = {
  department: {
    list: DEPARTMENT_LIST,
    add: DEPARTMENT_ADD,
    update: DEPARTMENT_UPDATE,
    codeKey: 'departmentCode',
    nameKey: 'departmentName'
  },
  designation: {
    list: DESIGNATION_LIST,
    add: DESIGNATION_ADD,
    update: DESIGNATION_UPDATE,
    codeKey: 'designationCode',
    nameKey: 'designationName'
  },
  // Add other configurations as needed
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
  const validationSchema = Yup.object().shape({
    code: Yup.string().required(`${activeTab} code is required`),
    name: Yup.string().required(`${activeTab} name is required`),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const config = API_CONFIG[activeTab];
    const newItem = {
      [config.codeKey]: values.code,
      [config.nameKey]: values.name,
    };

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
    const updatedItem = {
      id: selectedItem.id,
      [config.codeKey]: values.code,
      [config.nameKey]: values.name,
    };

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
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
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
          initialValues={{ code: '', name: '' }}
          validationSchema={validationSchema}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      {showModalUpdate && selectedItem && (
        <ModalForm
          title={`Update ${activeTab}`}
          initialValues={{
            code: selectedItem[API_CONFIG[activeTab].codeKey],
            name: selectedItem[API_CONFIG[activeTab].nameKey],
          }}
          validationSchema={validationSchema}
          onClose={() => {
            setShowModalUpdate(false);
            setSelectedItem(null);
          }}
          onSubmit={handleUpdateSubmit}
          isUpdate
        />
      )}
    </div>
  );
};

const ModalForm = ({ title, initialValues, validationSchema, onClose, onSubmit, isUpdate }) => (
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
          {({ isSubmitting }) => (
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
              <div className="mb-6">
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