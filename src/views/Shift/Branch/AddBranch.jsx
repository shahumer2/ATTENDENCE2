import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { debounce } from 'lodash';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GET_ShiftSearch_URL } from 'Constants/utils';
import useBranch from 'hooks/useBranch';
import { useNavigate } from 'react-router-dom';

const AddBranch = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();

  // Tab configuration
  const TABS = {
    reader: {
      title: 'Reader',
      key: 'reader',
      columns: [
        { header: 'Reader ID', key: 'readerId' },
        { header: 'Reader Name', key: 'readerName' }
      ]
    },
    tablet: {
      title: 'Tablet',
      key: 'tablet',
      columns: [
        { header: 'Tablet ID', key: 'tabletId' },
        { header: 'Tablet Name', key: 'tabletName' }
      ]
    },
    thirdPartyReader: {
      title: 'Third Party Reader',
      key: 'thirdPartyReader',
      columns: [
        { header: 'Reader ID', key: 'readerId' },
        { header: 'Vendor', key: 'vendor' }
      ]
    },
    shiftAssignment: {
      title: 'Shift Assignment',
      key: 'shiftAssignment',
      columns: [
        { header: 'Shift Code', key: 'shiftCode' },
        { header: 'Shift Name', key: 'shiftName' },
        { header: 'Assign', key: 'assign' }
      ]
    }
  };

  const [activeTab, setActiveTab] = useState(TABS.reader.key);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedShifts, setSelectedShifts] = useState([]);

  // Fetch data with React Query
  const { data: shifts, isLoading: shiftsLoading } = useQuery({
    queryKey: ['shifts'], // Query key must be an array
    queryFn: async () => {
      try {
        const response = await fetch(`${GET_ShiftSearch_URL}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data from API:', data); // This shows it's an array
        return data;
      } catch (error) {
        console.error('Error fetching shift options:', error);
        throw error;
      }
    }

  });

  // Debounce search
  const debounceSearch = useCallback(
    debounce((value) => setDebouncedSearchTerm(value), 300),
    []
  );

  useEffect(() => {
    debounceSearch(searchTerm);
    return () => debounceSearch.cancel();
  }, [searchTerm, debounceSearch]);

  // Handle shift selection
  const handleShiftSelect = (shiftId) => {
    setSelectedShifts(prev =>
      prev.includes(shiftId)
        ? prev.filter(id => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  // Form validation schema
  const validationSchema = Yup.object().shape({
    BranchCode: Yup.string().required('Branch Code is required'),
    BranchName: Yup.string().required('Branch Name is required'),
  });
  const { handleSubmit } = useBranch(selectedShifts)


  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add Branch</h1>
        </div>

        <Formik
          initialValues={{ BranchCode: '', BranchName: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Branch Info Section */}
              <div className='flex flex-row  items-end justify-between '>
                <div className='w-[300px]'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Code<span className='text-red-600'>*</span>
                  </label>
                  <Field
                    name="BranchCode"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Branch code"
                  />
                  <ErrorMessage name="BranchCode" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className='w-[300px]'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name <span className='text-red-600'>*</span>
                  </label>
                  <Field
                    name="BranchName"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Branch name"
                  />
                  <ErrorMessage name="BranchName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mt-6  space-x-4">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                    onClick={() => navigate("/admin/ETMS/Branch")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Save Branch
                  </button>
                </div>
              </div>

              {/* Tab Section */}
              <div className="mt-8">
                <div className="flex border-b mb-6">
                  {Object.values(TABS).map((tab) => (
                    <button
                      type='button'
                      key={tab.key}
                      className={`px-4 py-2 font-medium ${activeTab === tab.key
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={`Search ${TABS[activeTab].title}...`}
                    className="w-full md:w-64 px-4 py-2 border rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {activeTab === TABS.shiftAssignment.key ? (
                    // Shift Assignment Table
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {TABS.shiftAssignment.columns.map((column) => (
                              <th
                                key={column.key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {column.header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {shiftsLoading ? (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-center">
                                Loading shifts...
                              </td>
                            </tr>
                          ) : (
                            shifts?.map((shift) => (
                              <tr key={shift.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {shift.shiftCode}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {shift.shiftName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <input
                                    type="checkbox"
                                    checked={selectedShifts.includes(shift.id)}
                                    onChange={() => handleShiftSelect(shift.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    // Other tabs content
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">
                        {TABS[activeTab].title} Configuration
                      </h3>
                      <p>Specific {TABS[activeTab].title.toLowerCase()} settings will be displayed here.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddBranch;