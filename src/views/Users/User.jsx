import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Select from 'react-select';
import useUser from 'hooks/useUser';
import 'react-datepicker/dist/react-datepicker.css';

const User = () => {
  const { handleFinalSubmit, sections, getDepartment, getCompany, department, company, getEmployee, Employee } = useUser();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [activeSection, setActiveSection] = useState('basic');

  const initialValues = {
    // Basic Info
    employeeId: null,
    username: '',
    password: '',
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '', 
    profilePicFile: null,

    // App Access
    // appAccess: '',
    // allowMobileLogin: false,

    // Company Access
    selectedCompanies: [],

    // Department Access
    selectedDepartments: [],
  };

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Create New User</h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          employeeId: Yup.string().required('Employee ID is required'),
          name: Yup.string().required('Employee name is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          phoneNumber: Yup.string().required('Mobile number is required'),
        })}
        onSubmit={handleFinalSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Section Tabs */}
            <div className="flex border-b mb-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeSection === section.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-4">
              {activeSection === 'basic' && (
                <BasicInfoSection values={values} setFieldValue={setFieldValue} Employee={Employee} getEmployee={getEmployee} />
              )}

              {activeSection === 'app-access' && (
                <AppAccessSection values={values} setFieldValue={setFieldValue} onBack={() => setActiveSection('basic')} />
              )}

              {activeSection === 'company-access' && (
                <CompanyAccessSection
                  values={values}
                  setFieldValue={setFieldValue}
                  company={company}
                  getCompany={getCompany}
                  onBack={() => setActiveSection('app-access')}
                />
              )}

              {activeSection === 'department-access' && (
                <DepartmentAccessSection
                  values={values}
                  setFieldValue={setFieldValue}
                  department={department}
                  getDepartment={getDepartment}
                  onBack={() => setActiveSection('company-access')}
                />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// ========================== Basic Info Section ==========================
const BasicInfoSection = ({ values, setFieldValue, Employee, getEmployee }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    getEmployee();
  }, []);

  const formattedEmployee = (Employee || []).map((employee) => ({
    label: employee?.employeeName,
    value: employee?.id,
  }));

  return (
    <div className="flex">
      {/* Left side - Form fields */}
      <div className="w-3/4 pr-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee*</label>
            {formattedEmployee.length > 0 ? (
              <Select
                name="employeeId"
                options={formattedEmployee}
                value={formattedEmployee.find((option) => option.value === values.employeeId)}
                onChange={(selectedOption) => setFieldValue('employeeId', selectedOption.value)}
              />
            ) : (
              <div className="text-sm text-gray-500">Loading employees...</div>
            )}
            <ErrorMessage name="employeeId" component="div" className="text-red-500 text-xs" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name*</label>
            <Field name="name" className="w-full p-2 border rounded" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">User Name</label>
            <Field name="username" className="w-full p-2 border rounded" />
            <ErrorMessage name="username" component="div" className="text-red-500 text-xs" />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Field
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-10 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
            <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email*</label>
            <Field name="email" type="email" className="w-full p-2 border rounded" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number*</label>
            <Field name="phoneNumber" className="w-full p-2 border rounded" />
            <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs" />
          </div>
        </div>
      </div>

      {/* Right side - Image upload */}
      <div className="w-1/4 pl-4">
        <div className="border border-gray-200 rounded p-4 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 overflow-hidden">
            {values.profileImage ? (
              <img src={values.profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
            )}
          </div>
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFieldValue('profileImage', reader.result); // base64 preview
                    setProfilePic(file);
                    setFieldValue('profilePicFile', file); // for FormData
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

// ========================== App Access Section ==========================
const AppAccessSection = ({ values, setFieldValue, onBack }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">App Access Level</label>
        <Field as="select" name="appAccess" className="w-full p-2 border rounded">
          <option value="">Select access level</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">Regular User</option>
        </Field>
      </div>

      <div className="mb-4 flex items-center">
        <Field type="checkbox" name="allowMobileLogin" className="mr-2" />
        <label className="text-sm text-gray-700">Allow mobile login</label>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
          Back
        </button>
      </div>
    </>
  );
};

// ========================== Company Access Section ==========================
const CompanyAccessSection = ({ values, setFieldValue, company, getCompany, onBack }) => {
  useEffect(() => {
    getCompany();
  }, []);

  return (
    <>
      <div className="mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {company && company.length > 0 ? (
              company.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={values.selectedCompanies.some((comp) => comp.id === c.id)}
                      onChange={() => {
                        const newCompanies = values.selectedCompanies.some((comp) => comp.id === c.id)
                          ? values.selectedCompanies.filter((comp) => comp.id !== c.id)
                          : [...values.selectedCompanies, c];
                        setFieldValue('selectedCompanies', newCompanies);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.companyCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.companyName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No company available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
          Back
        </button>
      </div>
    </>
  );
};

// ========================== Department Access Section ==========================
const DepartmentAccessSection = ({ values, setFieldValue, department, getDepartment, onBack }) => {
  useEffect(() => {
    getDepartment();
  }, []);

  return (
    <>
      <div className="mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {department && department.length > 0 ? (
              department.map((d) => (
                <tr key={d.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={values.selectedDepartments.some((dep) => dep.id === d.id)}
                      onChange={() => {
                        const newDepartments = values.selectedDepartments.some((dep) => dep.id === d.id)
                          ? values.selectedDepartments.filter((dep) => dep.id !== d.id)
                          : [...values.selectedDepartments, d];
                        setFieldValue('selectedDepartments', newDepartments);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.departmentCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.departmentName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No department available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
          Back
        </button>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Save All User Data
        </button>
      </div>
    </>
  );
};

export default User;
