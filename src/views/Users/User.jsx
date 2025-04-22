import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUser from 'hooks/useUser';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
const User = () => {

  const { handleFinalSubmit, sections, getDepartment, getCompany, department, company } = useUser()
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [activeSection, setActiveSection] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Info
    employeeId: null,
    username: "",
    password: "",
    name: '',
    email: '',
    phoneNumber: '',

    // App Access
    // appAccess: '',
    // allowMobileLogin: false,

    // Company Access
    selectedCompanies: [],

    // Department Access
    selectedDepartments: [],

    // Children
    // children: []
  });







  const handleSectionSubmit = (sectionId, values) => {
    setFormData(prev => ({
      ...prev,
      ...values
    }));

    // Move to next section
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };


  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Create New User</h2>
      </div>

      <div className="flex border-b mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`px-4 py-2 font-medium ${activeSection === section.id
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
          <BasicInfoSection
            initialValues={formData}
            onSubmit={(values) => handleSectionSubmit('basic', values)}
          />
        )}

        {activeSection === 'app-access' && (
          <AppAccessSection
            initialValues={formData}
            onSubmit={(values) => handleSectionSubmit('app-access', values)}
            onBack={() => setActiveSection('basic')}
          />
        )}

        {activeSection === 'company-access' && (
          <CompanyAccessSection
            initialValues={formData}
            onSubmit={(values) => handleSectionSubmit('company-access', values)}
            onBack={() => setActiveSection('app-access')}
          />
        )}

        {activeSection === 'department-access' && (
          <DepartmentAccessSection
            initialValues={formData}
            onSubmit={handleFinalSubmit}
            onBack={() => setActiveSection('company-access')}
          />
        )}
        {/*         
        {activeSection === 'children' && (
          <ChildrenSection 
            initialValues={formData} 
            onSubmit={handleFinalSubmit} 
            onBack={() => setActiveSection('department-access')}
          />
        )} */}
      </div>
    </div>
  );
};

// Basic Info Section
const BasicInfoSection = ({ initialValues, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setprofilePic] = useState(null)
  const validationSchema = Yup.object().shape({
    employeeId: Yup.string().required('Employee ID is required'),
    name: Yup.string().required('Employee name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Mobile number is required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <div className="flex">
            {/* Left side - Form fields */}
            <div className="w-3/4 pr-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID*</label>
                  <Field type="number" name="employeeId" className="w-full p-2 border rounded" />
                  <ErrorMessage name="employeeId" component="div" className="text-red-500 text-xs" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee Name*</label>
                  <Field name="name" className="w-full p-2 border rounded" />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Name</label>
                  <Field name="username" className="w-full p-2 border rounded" />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-xs" />
                </div>
                <div className="relative">
                  <Field
                  name="password"
                   
                    type={showPassword ? 'text' : 'password'}
                    className="w-full p-2 mt-5 border rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
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
                    <img
                      src={values.profileImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
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
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFieldValue("profileImage", reader.result); // base64 preview
                          setprofilePic(file);
                          setFieldValue("profilePicFile", file); // 👈 for FormData
                        };
                        reader.readAsDataURL(file);
                      }
                    }}

                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next: App Access
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// App Access Section
const AppAccessSection = ({ initialValues, onSubmit, onBack }) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
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
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next: Company Access
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// Company Access Section
const CompanyAccessSection = ({ initialValues, onSubmit, onBack }) => {
  const { getCompany, company } = useUser()
  useEffect(() => {
    getCompany(); // Fetch 
  }, []);

  console.log("company", company);


  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
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
                {company?.map(company => (
                  <tr key={company.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={values.selectedCompanies.some(c => c.id === company.id)}
                        onChange={() => {
                          const newCompanies = values.selectedCompanies.some(c => c.id === company.id)
                            ? values.selectedCompanies.filter(c => c.id !== company.id)
                            : [...values.selectedCompanies, company];
                          setFieldValue('selectedCompanies', newCompanies);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.companyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.companyName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next: Department Access
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// Department Access Section
const DepartmentAccessSection = ({ initialValues, onSubmit, onBack }) => {
  const { getDepartment, department } = useUser()
  useEffect(() => {
    getDepartment(); // Fetch departments
  }, []);

  console.log("+++++++++++++++++", department);



  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
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
                {department?.map(department => (
                  <tr key={department.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={values.selectedDepartments.some(d => d.id === department.id)}
                        onChange={() => {
                          const newDepartments = values.selectedDepartments.some(d => d.id === department.id)
                            ? values.selectedDepartments.filter(d => d.id !== department.id)
                            : [...values.selectedDepartments, department];
                          setFieldValue('selectedDepartments', newDepartments);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department?.departmentCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department?.departmentName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type='submit'
              // onClick={() => onSubmit({ children })}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save All User Data
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// Children Section


export default User;