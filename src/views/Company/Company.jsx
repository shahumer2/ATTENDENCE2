import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { COMPANY_ADD, COMPANY_LIST, COMPANY_UPDATE, GET_COMPANY_id } from 'Constants/utils';
import { IMAGE } from 'Constants/utils';
import Tooltip from 'components/Tooltip/Tooltip';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { CiSearch } from 'react-icons/ci';
import { useQuery } from '@tanstack/react-query';
import { MdDelete } from 'react-icons/md';
import { COMPANY_SEARCH } from 'Constants/utils';

const Company = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
  // Fetch companies with pagination and search


  const {
    data: companyData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['companies', currentPage, debouncedSearchTerm, pageSize],
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: pageSize,
        searchTerm: debouncedSearchTerm || '',
      
      };

      const response = await fetch(`${COMPANY_SEARCH}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      console.log(data,"japan");
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);
      return data
    },
    enabled: !!token,
    keepPreviousData: true,
  });

  

  if (isError) {
    toast.error(error.message);
    return <div>Error loading companies</div>;
  }

  // Get single company by ID
  const getCompanyById = useCallback(async (id) => {
    try {
      const response = await fetch(`${GET_COMPANY_id}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch company');
      return await response.json();
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  }, [token]);



  // Debounce search

console.log(companyData,"lolo");

  // Form validation schema
  const validationSchema = Yup.object().shape({
    companyCode: Yup.string().required('Company code is required'),
    companyName: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal code is required'),
    mobileAppLogo: Yup.mixed().notRequired(),
    paySlipLogo: Yup.mixed().notRequired(),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    
    const companyData = {
      id: values.id || 0,
      companyCode: values.companyCode,
      companyName: values.companyName,
      location: values.location,
      street: values.street,
      city: values.city,
      postalCode: parseInt(values.postalCode),
    };

    formData.append("company", JSON.stringify(companyData));
    
    // Only append files if they exist (new files selected)
    if (values.mobileAppLogo instanceof File) {
      formData.append("mobileAppLogo", values.mobileAppLogo);
    }
    if (values.paySlipLogo instanceof File) {
      formData.append("paySlipLogo", values.paySlipLogo);
    }

    try {
      const url = values.id ? `${COMPANY_UPDATE}/${values.id}` : COMPANY_ADD;
      const method = values.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(`Company ${values.id ? 'updated' : 'added'} successfully`);
        resetForm();
        setShowModal(false);
        setShowModalUpdate(false);
        fetchCompanies(currentPage, debouncedSearchTerm);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.message || 'Operation failed');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update button click
  const handleUpdateClick = (company) => {
    setSelectedCompany(company);
    setShowModalUpdate(true);
  };

  // Pagination controls

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const debounceSearch = useCallback(

    debounce((value) => setDebouncedSearchTerm(value), 300),
    []
);

const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value); // ✅ will update debouncedSearchTerm
};

  return (
    <>
<div className="flex justify-between pl-8 pt-2 pr-8">

<div className="flex items-center">
    <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Company Master</h2>
   
</div>
<Breadcrumb className="pr-4" items={`Administration,Company`} />
</div>
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold"></h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Company
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
                    <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
                      Companies
                    </h2>

                    <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
                        <input
                            type="text"
                            placeholder={`Enter The Company Code or Company Name `}
                            className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {/* Search Icon inside input */}
                        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className='w-[50%]'></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companyData?.content?.length > 0 ? (
                companyData?.content.map((company) => (
                  <tr key={company.id}>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{company.companyCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{company.companyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{company.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{company.city}</td>
                    <td></td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      <button onClick={() => handleUpdateClick(company)} className="text-blue-500 hover:text-blue-700">
                      <FaEdit size="1.3rem" style={{ color: "#337ab7" }} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    <MdDelete style={{ color: "#d97777" }} size="1.3rem" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">
                    No companies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex w-full justify-end items-center mt-4 px-6">
                <div className="flex space-x-2 text-blue-500">
                    {page > 1 && (
                        <>
                            <button
                                onClick={() => setPage(1)}
                                className="px-3 py-1 border rounded"
                            >
                                First
                            </button>
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                className="px-3 py-1 border rounded"
                            >
                                Prev
                            </button>
                        </>
                    )}
                    {page <= totalPages && (
                        <>
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                className="px-3 py-1 border rounded"
                            >
                                Next
                            </button>
                            <button
                                onClick={() => setPage(totalPages)}
                                className="px-3 py-1 border rounded"
                            >
                                Last
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex w-full  items-center mt-4  gap-4 px-6 mb-2">
                {/* Page size selector */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Page Size:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        className="border rounded px-2 py-1 w-[100px] border-gray-400"
                    >
                        {[5, 10, 15, 20].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                {/* Pagination buttons */}


                {/* Go to page + info */}
                <div className="flex items-center space-x-2 gap-4">
                    <label className="text-sm font-medium">Go to Page:</label>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={page}
                        onChange={(e) => {
                            let val = Number(e.target.value);

                            // Prevent NaN or invalid numbers
                            if (!val || val < 1) {
                                setPage(1);
                            } else if (val > totalPages) {
                                setPage(totalPages);
                            } else {
                                setPage(val);
                            }
                        }}
                        className="border rounded w-[100px] px-2 py-1 border-gray-400 mr-4"
                    />


                    <span className="text-sm  font-semibold ml-4">
                        Page {page} of {totalPages}
                    </span>
                    <span className="text-sm gap-5 font-semibold">
                        Total: {totalRecords}
                    </span>
                </div>
            </div>

      {/* Add Company Modal */}
      {showModal && (
        <CompanyModalForm
          title="Add Company"
          initialValues={{
            id: null,
            companyCode: '',
            companyName: '',
            location: '',
            street: '',
            city: '',
            postalCode: '',
            mobileAppLogo: null,
            paySlipLogo: null
          }}
          validationSchema={validationSchema}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          isUpdate={false}
        />
      )}

      {/* Update Company Modal */}
      {showModalUpdate && selectedCompany && (
        <CompanyModalForm
          title="Update Company"
          initialValues={{
            id: selectedCompany.id,
            companyCode: selectedCompany.companyCode,
            companyName: selectedCompany.companyName,
            location: selectedCompany.location,
            street: selectedCompany.street,
            city: selectedCompany.city,
            postalCode: selectedCompany.postalCode?.toString() || '',
            mobileAppLogo: null,
            paySlipLogo: null
          }}
          validationSchema={validationSchema}
          onClose={() => {
            setShowModalUpdate(false);
            setSelectedCompany(null);
          }}
          onSubmit={handleSubmit}
          isUpdate={true}
          existingLogos={{
            mobileAppLogo: selectedCompany.mobileAppLogo,
            paySlipLogo: selectedCompany.paySlipLogo
          }}
        />
      )}
    </div>
    </>
  );
};

// Separate modal form component
const CompanyModalForm = ({
  title,
  initialValues,
  validationSchema,
  onClose,
  onSubmit,
  isUpdate,
  existingLogos
}) => {
  const [mobileAppLogoFile, setMobileAppLogoFile] = useState(null);
  const [paySlipLogoFile, setPaySlipLogoFile] = useState(null);
  const [previewMobileAppLogo, setPreviewMobileAppLogo] = useState('');
  const [previewPaySlipLogo, setPreviewPaySlipLogo] = useState('');

  const handleFileChange = (e, setFile, setPreview, setFieldValue, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFieldValue(fieldName, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFilePreviews = () => {
    setPreviewMobileAppLogo('');
    setPreviewPaySlipLogo('');
    setMobileAppLogoFile(null);
    setPaySlipLogoFile(null);
  };

  return (
    <>
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">{title}</h3>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
            validateOnMount
          >
            {({ isSubmitting, isValid, setFieldValue }) => (
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
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Mobile App Logo
                    </label>
                    <input
                      name="mobileAppLogo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(
                        e, 
                        setMobileAppLogoFile, 
                        setPreviewMobileAppLogo,
                        setFieldValue,
                        'mobileAppLogo'
                      )}
                      className="w-full px-3 py-2 border rounded"
                    />
                    <ErrorMessage name="mobileAppLogo" component="div" className="text-red-500 text-xs mt-1" />
                    {(previewMobileAppLogo || (isUpdate && existingLogos?.mobileAppLogo)) && (
                      <div className="mt-2">
                        <img 
                          src={previewMobileAppLogo || `${IMAGE}/${existingLogos.mobileAppLogo}`}
                          alt="Mobile App Logo Preview" 
                          className="h-20 w-20 object-contain" 
                        />
                      </div>
                    )}
                  </div>
              
                  {/* Pay Slip Logo */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Pay Slip Logo
                    </label>
                    <input
                      name="paySlipLogo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(
                        e, 
                        setPaySlipLogoFile, 
                        setPreviewPaySlipLogo,
                        setFieldValue,
                        'paySlipLogo'
                      )}
                      className="w-full px-3 py-2 border rounded"
                    />
                    <ErrorMessage name="paySlipLogo" component="div" className="text-red-500 text-xs mt-1" />
                    {(previewPaySlipLogo || (isUpdate && existingLogos?.paySlipLogo)) && (
                      <div className="mt-2">
                        <img 
                          src={previewPaySlipLogo || `${IMAGE}/${existingLogos.paySlipLogo}`}
                          alt="Pay Slip Logo Preview" 
                          className="h-20 w-20 object-contain" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              
                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetFilePreviews();
                    }}
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
    </>
  );
};

export default Company;
