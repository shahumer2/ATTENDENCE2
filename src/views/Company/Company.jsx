import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { COMPANY_ADD, COMPANY_LIST } from 'Constants/utils';

const Company = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [mobileAppLogoFile, setMobileAppLogoFile] = useState(null);
  const [paySlipLogoFile, setPaySlipLogoFile] = useState(null);
  const [previewMobileAppLogo, setPreviewMobileAppLogo] = useState('');
  const [previewPaySlipLogo, setPreviewPaySlipLogo] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch companies from API with pagination
  const fetchCompanies = useCallback(async (page=0, search = '') => {
   
    try {
      const url = `${COMPANY_LIST}?page=${page-1}`;
      console.log("url===",url);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,   
        },
      });

      if (!response.ok) throw new Error('Failed to fetch companies');

      const data = await response.json();
      console.log(data,"jamshedd");
      setCompanies(data?.content || []);
      setTotalItems(data?.totalElements || 0);
    } catch (error) {
      toast.error('Failed to fetch companies');
      console.error(error);
    }
  }, [token, itemsPerPage]);

  useEffect(() => {
    fetchCompanies(currentPage, debouncedSearchTerm);
  }, [fetchCompanies, currentPage, debouncedSearchTerm]);

  // Debounce search input
  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1); // Reset to first page when searching
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceSearch(value);
  };

  // Handle file uploads
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const initialValues = {
    companyCode: "",
    companyName: "",
    location: "",
    street: "",
    city: "",
    postalCode: "",
    mobileAppLogo: "",
    paySlipLogo: ""
  };

  const validationSchema = Yup.object().shape({
    companyCode: Yup.string().required('Company code is required'),
    companyName: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal code is required'),
    mobileAppLogo: Yup.mixed().required('Mobile app logo is required'),
    paySlipLogo: Yup.mixed().required('Payslip logo is required')
  });

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    // Create the nested 'company' object
    const companyData = {
      id: 0,
      companyCode: values.companyCode,
      companyName: values.companyName,
      location: values.location,
      street: values.street,
      city: values.city,
      postalCode: parseInt(values.postalCode),
      mobileAppLogo: values.mobileAppLogo.name, // Just the filename here
      paySlipLogo: values.paySlipLogo.name,     // Just the filename here
    };
  
    formData.append("company", JSON.stringify(companyData));
    formData.append("mobileAppLogo", values.mobileAppLogo);
    formData.append("paySlipLogo", values.paySlipLogo);

    try {
      const response = await fetch(COMPANY_ADD, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Company added successfully');
        resetForm();
        setShowModal(false);
        setMobileAppLogoFile(null);
        setPaySlipLogoFile(null);
        setPreviewMobileAppLogo('');
        setPreviewPaySlipLogo('');
        fetchCompanies(currentPage, debouncedSearchTerm);
      } else {
        toast.error(data.message || 'Failed to add company');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Company List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Company
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search company..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{company.companyCode}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{company.companyName}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{company.location}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{company.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {companies.length} of {totalItems} companies
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Company Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl ">
            <div className="p-6 ">
              <h3 className="text-lg font-medium mb-4">Add Company</h3>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                 <Form>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* Company Code */}
                   <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Company Code *</label>
                     <Field name="companyCode" type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter company code" />
                     <ErrorMessage name="companyCode" component="div" className="text-red-500 text-xs mt-1" />
                   </div>
               
                   {/* Company Name */}
                   <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Company Name *</label>
                     <Field name="companyName" type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter company name" />
                     <ErrorMessage name="companyName" component="div" className="text-red-500 text-xs mt-1" />
                   </div>
               
                   {/* Location */}
                   <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Location *</label>
                     <Field name="location" type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter location" />
                     <ErrorMessage name="location" component="div" className="text-red-500 text-xs mt-1" />
                   </div>
               
                   {/* Street */}
                   <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Street *</label>
                     <Field name="street" type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter street" />
                     <ErrorMessage name="street" component="div" className="text-red-500 text-xs mt-1" />
                   </div>
               
                   {/* City */}
                   <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">City *</label>
                     <Field name="city" type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter city" />
                     <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
                   </div>
               
                   {/* Postal Code */}
                   <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Postal Code *</label>
                     <Field name="postalCode" type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter postal code" />
                     <ErrorMessage name="postalCode" component="div" className="text-red-500 text-xs mt-1" />
                   </div>
               
                   {/* Mobile App Logo */}
                   <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Mobile App Logo *</label>
                     <input
                       name="mobileAppLogo"
                       type="file"
                       accept="image/*"
                       onChange={(e) => {
                         handleFileChange(e, setMobileAppLogoFile, setPreviewMobileAppLogo);
                         setFieldValue('mobileAppLogo', e.currentTarget.files[0]);
                       }}
                       className="w-full px-3 py-2 border rounded"
                     />
                     <ErrorMessage name="mobileAppLogo" component="div" className="text-red-500 text-xs mt-1" />
                     {previewMobileAppLogo && (
                       <div className="mt-2">
                         <img src={previewMobileAppLogo} alt="Mobile App Logo Preview" className="h-20 w-20 object-contain" />
                       </div>
                     )}
                   </div>
               
                   {/* Pay Slip Logo */}
                   <div className="mb-4">
                     <label className="block text-gray-700 text-sm font-bold mb-2">Pay Slip Logo *</label>
                     <input
                       name="paySlipLogo"
                       type="file"
                       accept="image/*"
                       onChange={(e) => {
                         handleFileChange(e, setPaySlipLogoFile, setPreviewPaySlipLogo);
                         setFieldValue('paySlipLogo', e.currentTarget.files[0]);
                       }}
                       className="w-full px-3 py-2 border rounded"
                     />
                     <ErrorMessage name="paySlipLogo" component="div" className="text-red-500 text-xs mt-1" />
                     {previewPaySlipLogo && (
                       <div className="mt-2">
                         <img src={previewPaySlipLogo} alt="Pay Slip Logo Preview" className="h-20 w-20 object-contain" />
                       </div>
                     )}
                   </div>
                 </div>
               
                 {/* Buttons */}
                 <div className="flex justify-end space-x-3 mt-4">
                   <button
                     type="button"
                     onClick={() => {
                       setShowModal(false);
                       setPreviewMobileAppLogo('');
                       setPreviewPaySlipLogo('');
                     }}
                     className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={isSubmitting}
                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                   >
                     {isSubmitting ? 'Saving...' : 'Save'}
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

export default Company;