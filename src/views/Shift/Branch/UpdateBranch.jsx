import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GET_BranchBYID_URL, UPDATE_Branch_URL, GET_ShiftSearch_URL } from 'Constants/utils';
import { FaEdit } from "react-icons/fa";
import { toast } from 'react-toastify';

const UpdateBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  // Tab configuration (same as AddBranch)
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShifts, setSelectedShifts] = useState([]);

  // Fetch Branch data
  const fetchBranchById = async (id) => {
    try {
      const response = await fetch(`${GET_BranchBYID_URL}/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data,"_________________");
      // Initialize selected shifts from the fetched data
      if (data.assignedShifts) {
        setSelectedShifts(data?.assignedShifts);
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Branch");
      throw error;
    }
  };

  const { data: branchData, isLoading, isError } = useQuery({
    queryKey: ['branch', id],
    queryFn: () => fetchBranchById(id),
    
  });


  console.log(branchData,"jumppppp");
  // Fetch shifts data
  const { data: shifts, isLoading: shiftsLoading } = useQuery({
    queryKey: ['shifts'],
    queryFn: async () => {
      const response = await fetch(GET_ShiftSearch_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    }
  });

  // Update Branch mutation
  const updateBranch = async ({ id, branchData }) => {
    const response = await fetch(`${UPDATE_Branch_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...branchData,
        assignedShifts: selectedShifts
      })
    });
    return response.json();
  };

  const { mutate: updateBranchMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(['branch', id]);
      toast.success('Branch updated successfully');
      navigate('/admin/ETMS/Branch');
    },
    onError: (error) => {
      toast.error('Failed to update branch');
      console.error('Error updating branch:', error);
    },
  });

  // Handle shift selection
  const handleShiftSelect = (shiftId) => {
    setSelectedShifts(prev =>
      prev.includes(shiftId)
        ? prev.filter(id => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    branchCode: Yup.string().required('Branch Code is required'),
    branchName: Yup.string().required('Branch Name is required'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading branch data</div>;

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Update Branch</h1>
        </div>

        <Formik
          initialValues={branchData || {
            branchCode:'',
            branchName: '',
            // Add other initial values as needed
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            updateBranchMutation({ id, branchData: values });
          }}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Branch Info Section */}
              <div className='flex flex-row items-end justify-between'>
                <div className='w-[300px]'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Code<span className='text-red-600'>*</span>
                  </label>
                  <Field
                    name="branchCode"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Branch code"
                  />
                  <ErrorMessage name="branchCode" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className='w-[300px]'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name <span className='text-red-600'>*</span>
                  </label>
                  <Field
                    name="branchName"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Branch name"
                  />
                  <ErrorMessage name="branchName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mt-6 space-x-4">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                    onClick={() => navigate('/admin/branch/view')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update Branch'}
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
                      className={`px-4 py-2 font-medium ${
                        activeTab === tab.key
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

              {/* Add any additional form sections from AddBranch as needed */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateBranch;