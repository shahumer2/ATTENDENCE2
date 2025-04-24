import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { DEPARTMENT_ADD, DEPARTMENT_LIST } from 'Constants/utils';

const Department = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [activeTab, setActiveTab] = useState('department');
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(DEPARTMENT_LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // if (!response.ok) throw new Error('Failed to fetch departments');

        const data = await response.json();
        console.log(data,"hey");
        setDepartments(data?.content);
      } catch (error) {
        toast.error('Failed to fetch departments');
        console.error(error);
      }
    };

    fetchDepartments();
  }, []);

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

  console.log("departs:+++",departments);

  const filteredDepartments = departments?.filter((dept) =>
    dept.departmentCode?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    dept.departmentName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const initialValues = {
    code: '',
    name: '',
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required(`${activeTab} code is required`),
    name: Yup.string().required(`${activeTab} name is required`),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const newDepartment = {
      departmentCode: values.code,
      departmentName: values.name,
    };

    try {
      const response = await fetch(DEPARTMENT_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDepartment),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${activeTab} added successfully`);
        resetForm();
        setShowModal(false);

        // Refresh the list after adding
        setDepartments((prev) => [...prev, newDepartment]);
      } else {
        toast.error(data.message || 'Failed to add');
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
        {['department', 'designation', 'section', 'category', 'aws'].map((tab) => (
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
  {filteredDepartments.length > 0 ? (
    filteredDepartments.map((dept, index) => (
      <tr key={index}>
        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
          {dept.departmentCode}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
          {dept.departmentName}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center">
        No data available
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {/* Modal */}
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
