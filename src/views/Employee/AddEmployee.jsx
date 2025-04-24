import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useEmployee from 'hooks/useEmployee';
import { User, Calendar, Briefcase, Users, X } from 'lucide-react';

const AddEmployee = () => {
  const [children, setChildren] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePic, setprofilePic] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [confirmationDate, setConfirmationDate] = useState(null);
  const [leaveCalDate, setleaveCalDate] = useState(null);
  const [resignationDate, setResignationDate] = useState(null);

  // Initial form values
  const { initialValues, handleSubmit } = useEmployee({ 
    profilePic, 
    startDate, 
    confirmationDate, 
    leaveCalDate, 
    resignationDate, 
    profileImage, 
    children 
  });

  // Validation schema
  const validationSchema = Yup.object().shape({
    employeeCode: Yup.string().required('Required'),
    employeeName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phoneNumber: Yup.string().required('Required'),
  });

  // Handle child addition
  const addChild = () => {
    setChildren([...children, { 
      name: '', 
      dob: null, 
      gender: '', 
      birthCertificateNo: '', 
      singaporeCitizen: false 
    }]);
  };

  // Handle child removal
  const removeChild = (index) => {
    const updatedChildren = [...children];
    updatedChildren.splice(index, 1);
    setChildren(updatedChildren);
  };

  // Handle child field change
  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...children];
    updatedChildren[index][field] = value;
    setChildren(updatedChildren);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setprofilePic(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Registration</h1>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Basic Details Section */}
              <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-4 flex items-center">
                  <User className="mr-2" size={20} />
                  <h2 className="text-lg font-semibold">Basic Details</h2>
                </div>
                <div className="p-6">
                  <div className="flex">
                    <div className="w-3/4 pr-6">
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code*</label>
                          <Field
                            name="employeeCode"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter code"
                          />
                          <ErrorMessage name="employeeCode" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name*</label>
                          <Field
                            name="employeeName"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter full name"
                          />
                          <ErrorMessage name="employeeName" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <Field
                            as="select"
                            name="gender"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Field>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                          <Field
                            as="select"
                            name="martialStatus"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                          </Field>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                          <Field
                            name="email"
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="email@example.com"
                          />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number*</label>
                          <Field
                            name="phoneNumber"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter phone number"
                          />
                          <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholderText="Select date"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Date</label>
                          <DatePicker
                            selected={confirmationDate}
                            onChange={(date) => setConfirmationDate(date)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholderText="Select date"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Probation Months</label>
                          <Field
                            name="probationMonths"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter months"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fingerprint ID</label>
                          <Field
                            name="fingerPrint"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter ID"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Face ID</label>
                          <Field
                            name="faceId"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter ID"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Leave Calculation Date</label>
                          <DatePicker
                            selected={leaveCalDate}
                            onChange={(date) => setleaveCalDate(date)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholderText="Select date"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-1/4 pl-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-40 h-40 bg-gray-100 rounded-full mb-4 overflow-hidden border-4 border-gray-200 shadow-md">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <User size={64} />
                            </div>
                          )}
                        </div>
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm text-sm font-medium">
                          Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2 text-center">JPEG or PNG, max 1MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resignation Date</label>
                      <DatePicker
                        selected={resignationDate}
                        onChange={(date) => setResignationDate(date)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholderText="Select date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resignation Reason</label>
                      <Field
                        name="resignationReason"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter reason if applicable"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Section */}
              <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-4 flex items-center">
                  <Briefcase className="mr-2" size={20} />
                  <h2 className="text-lg font-semibold">Department Details</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <Field
                        as="select"
                        name="department"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Department</option>
                        <option value="hr">HR</option>
                        <option value="it">IT</option>
                        <option value="finance">Finance</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                      <Field
                        as="select"
                        name="designation"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Designation</option>
                        <option value="manager">Manager</option>
                        <option value="developer">Developer</option>
                        <option value="analyst">Analyst</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">AWS</label>
                      <Field
                        as="select"
                        name="aws"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select AWS</option>
                        <option value="aws1">AWS 1</option>
                        <option value="aws2">AWS 2</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Group</label>
                      <Field
                        as="select"
                        name="holidayGroup"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Holiday Group</option>
                        <option value="group1">Group 1</option>
                        <option value="group2">Group 2</option>
                      </Field>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked Per Day</label>
                      <Field
                        as="select"
                        name="hoursWorkedPerDay"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Hours</option>
                        <option value="8">8 Hours</option>
                        <option value="9">9 Hours</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Days Worked Per Week</label>
                      <Field
                        as="select"
                        name="daysWorkedPerWeek"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Days</option>
                        <option value="5">5 Days</option>
                        <option value="6">6 Days</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked Per Year</label>
                      <Field
                        as="select"
                        name="hoursWorkedPerYear"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Hours</option>
                        <option value="2080">2080 Hours</option>
                        <option value="2340">2340 Hours</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Part Time</label>
                      <Field
                        as="select"
                        name="partTime"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Field>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <Field
                        as="select"
                        name="category"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        <option value="category1">Category 1</option>
                        <option value="category2">Category 2</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Leave Category</label>
                      <Field
                        as="select"
                        name="leaveCategory"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Leave Category</option>
                        <option value="annual">Annual</option>
                        <option value="sick">Sick</option>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>

              {/* Children Details Section */}
              <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="mr-2" size={20} />
                    <h2 className="text-lg font-semibold">Children Details</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addChild}
                    className="bg-white text-blue-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-50 transition duration-150 ease-in-out shadow-sm"
                  >
                    Add Child
                  </button>
                </div>
                <div className="p-6">
                  {children.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      <Users size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No children added yet</p>
                      <button 
                        type="button"
                        onClick={addChild}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Add a child record
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Cert No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SG Citizen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {children.map((child, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  value={child.name}
                                  onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Child name"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <DatePicker
                                  selected={child.dob}
                                  onChange={(date) => handleChildChange(index, 'dob', date.toISOString().split('T')[0] || "")}
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholderText="Select date"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={child.gender}
                                  onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  value={child.birthCertificateNo}
                                  onChange={(e) => handleChildChange(index, 'birthCertificateNo', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Certificate number"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  checked={child.singaporeCitizen}
                                  onChange={(e) => handleChildChange(index, 'singaporeCitizen', e.target.checked)}

                                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => removeChild(index)}
                                  className="flex items-center text-red-600 hover:text-red-800"
                                >
                                  <X size={16} className="mr-1" /> Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out shadow-sm mr-4 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition duration-150 ease-in-out shadow-md font-medium"
                >
                  Save Employee
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEmployee;