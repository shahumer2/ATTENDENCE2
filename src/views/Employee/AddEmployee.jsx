import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useEmployee from 'hooks/useEmployee';

const AddEmployee = () => {

  const [children, setChildren] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePic, setprofilePic] = useState(null)
  const [startDate, setStartDate] = useState(null);
  const [confirmationDate, setConfirmationDate] = useState(null);
  const [leaveCalDate, setleaveCalDate] = useState(null);
  const [resignationDate, setResignationDate] = useState(null);

  // Initial form values
  const { initialValues, handleSubmit } = useEmployee({ profilePic, startDate, confirmationDate, leaveCalDate, resignationDate, profileImage, children })


  // Validation schema
  const validationSchema = Yup.object().shape({
    employeeCode: Yup.string().required('Employee Code is required'),
    employeeName: Yup.string().required('Employee Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Mobile number is required'),
  });

  // Handle child addition
  const addChild = () => {
    setChildren([...children, { name: '', dob: null, gender: '', birthCertNo: '', isSingaporeCitizen: false }]);
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
        setprofilePic(file)
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(profilePic, "profilepiccccccccccccc");

  // Handle form submission


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-blue-600">Employee Basic Details</h1>
        <div className="w-64">
          {/* <Field
            as="select"
            name="appAccess"
            className="w-full p-2 border rounded"
          >
            <option value="">Select App Access</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </Field> */}
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Basic Details Section */}
            <div className="mb-8 bg-white">
              <div className="bg-blue-500 text-white p-2 rounded-t">
                <h2 className="text-lg font-semibold">Basic Details</h2>
              </div>
              <div className="border border-gray-200 rounded-b p-4">
                <div className="flex">
                  <div className="w-3/4 pr-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Employee Code*</label>
                        <Field
                          name="employeeCode"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage name="employeeCode" component="div" className="text-red-500 text-xs" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Employee Name*</label>
                        <Field
                          name="employeeName"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage name="employeeName" component="div" className="text-red-500 text-xs" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <Field
                          as="select"
                          name="gender"
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Field>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                        <Field
                          as="select"
                          name="maritalStatus"
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                        </Field>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email*</label>
                        <Field
                          name="email"
                          type="email"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number*</label>
                        <Field
                          name="phoneNumber"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3  mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Join Date</label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          className="w-[280px] p-2 border rounded"
                          placeholderText="Select date"
                        />
                      </div>
                      <div className=''>
                        <label className="block text-sm font-medium text-gray-700">Confirmation Date</label>
                        <DatePicker
                          selected={confirmationDate}
                          onChange={(date) => setConfirmationDate(date)}
                          className="w-[290px] p-2 border rounded"
                          placeholderText="Select date"
                        />
                      </div>
                      <div className='pl-3'>
                        <label className="block text-sm font-medium text-gray-700">Probation Months</label>
                        <Field
                          name="probationMonths"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fingerprint ID</label>
                        <Field
                          name="fingerPrint"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Face ID</label>
                        <Field
                          name="faceId"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Leave Calculation Date</label>
                        <DatePicker
                          selected={leaveCalDate}
                          onChange={(date) => setleaveCalDate(date)}
                          className="w-full p-2 border rounded"
                          placeholderText="Select date"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Resignation Date</label>
                        <DatePicker
                          selected={resignationDate}
                          onChange={(date) => setResignationDate(date)}
                          className="w-full p-2 border rounded"
                          placeholderText="Select date"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Resignation Reason</label>
                        <Field
                          name="resignationReason"
                          type="text"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-1/4 pl-4">
                    <div className="border border-gray-200 rounded p-4 flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Section */}
            <div className="mb-8 bg-white">
              <div className="bg-blue-500 text-white p-2 rounded-t">
                <h2 className="text-lg font-semibold">Department Section</h2>
              </div>
              <div className="border border-gray-200 rounded-b p-4">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <Field
                      as="select"
                      name="department"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Department</option>
                      <option value="hr">HR</option>
                      <option value="it">IT</option>
                      <option value="finance">Finance</option>
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <Field
                      as="select"
                      name="designation"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Designation</option>
                      <option value="manager">Manager</option>
                      <option value="developer">Developer</option>
                      <option value="analyst">Analyst</option>
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">AWS</label>
                    <Field
                      as="select"
                      name="aws"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select AWS</option>
                      <option value="aws1">AWS 1</option>
                      <option value="aws2">AWS 2</option>
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Holiday Group</label>
                    <Field
                      as="select"
                      name="holidayGroup"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Holiday Group</option>
                      <option value="group1">Group 1</option>
                      <option value="group2">Group 2</option>
                    </Field>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hours Worked Per Day</label>
                    <Field
                      as="select"
                      name="hoursWorkedPerDay"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select</option>
                      <option value="8">8 Hours</option>
                      <option value="9">9 Hours</option>
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Days Worked Per Week</label>
                    <Field
                      as="select"
                      name="daysWorkedPerWeek"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select</option>
                      <option value="5">5 Days</option>
                      <option value="6">6 Days</option>
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hours Worked Per Year</label>
                    <Field
                      as="select"
                      name="hoursWorkedPerYear"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select</option>
                      <option value="2080">2080 Hours</option>
                      <option value="2340">2340 Hours</option>
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Part Time</label>
                    <Field
                      as="select"
                      name="partTime"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Field>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Category</option>
                      <option value="category1">Category 1</option>
                      <option value="category2">Category 2</option>
                    </Field>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Leave Category</label>
                    <Field
                      as="select"
                      name="leaveCategory"
                      className="w-full p-2 border rounded"
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
            <div className="mb-8 bg-white">
              <div className="bg-blue-100 text-blue-800 p-2 rounded-t flex justify-between items-center">
                <h2 className="text-lg font-semibold">Children Detail</h2>
                <button
                  type="button"
                  onClick={addChild}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Add Child
                </button>
              </div>
              <div className="border border-gray-200 rounded-b p-4">
                {children.length === 0 ? (
                  <p className="text-gray-500">No children added</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Cert No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Singapore Citizen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {children.map((child, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={child.name}
                              onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                              className="w-full p-1 border rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <DatePicker
                              selected={child.dob}
                              onChange={(date) => handleChildChange(index, 'dob', date.toISOString().split('T')[0] || "")}
                              className="w-full p-1 border rounded"
                              placeholderText="Select date" 
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={child.gender}
                              onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                              className="w-full p-1 border rounded"
                            >
                              <option value="">Select</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={child.birthCertNo}
                              onChange={(e) => handleChildChange(index, 'birthCertNo', e.target.value)}
                              className="w-full p-1 border rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={child.isSingaporeCitizen}
                              onChange={(e) => handleChildChange(index, 'isSingaporeCitizen', e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => removeChild(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Save Employee
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;