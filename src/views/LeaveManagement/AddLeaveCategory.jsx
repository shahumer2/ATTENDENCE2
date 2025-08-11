import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { LeaveGroup_LIST } from 'Constants/utils';
import { ADD_LeaveCategory_DATA } from 'Constants/utils';
import { LeaveGroup } from 'Constants/utils';
import { useSelector } from 'react-redux';

const AddLeaveCategory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  // Fetch leave groups for step 4
  const { data: leaveGroups, isLoading: loadingLeaveGroups } = useQuery({
    queryKey: ['leaveGroups'],
    queryFn: async () => {
    

      const response = await fetch(LeaveGroup, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      
      });
      if (!response.ok) throw new Error('Failed to fetch leave groups');
      const data = await response.json();
      console.log('Raw data from API:', data); // This shows it's an array
      return data
    
    }
  });
console.log(leaveGroups,"strrrrr");
  // Mutation for submitting the form
  const { mutate: addLeaveCategory } = useMutation({
    mutationFn: async (formData) => {
      console.log(formData,"jjhhjjhh");
      const response = await fetch(ADD_LeaveCategory_DATA, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add leave category');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Leave category added successfully');
      navigate('/admin/ELeave/LeaveCategory');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Initial form values
  const getInitialValues = () => {
    return {
      leaveCategoryCode: '',
      leaveCategoryName: '',
      
      // Annual Leave Fields (5 ranges)
      annualLeaveFromYear1: 0,
      annualLeaveToYear1: null,
      annualLeaveEntitlement1: 0,
      annualLeaveFromYear2: 1,
      annualLeaveToYear2: null,
      annualLeaveEntitlement2: 0,
      annualLeaveFromYear3: 2,
      annualLeaveToYear3: null,
      annualLeaveEntitlement3: 0,
      annualLeaveFromYear4: 3,
      annualLeaveToYear4: null,
      annualLeaveEntitlement4: 0,
      annualLeaveFromYear5: 4,
      annualLeaveToYear5: null,
      annualLeaveEntitlement5: 0,
      
      // Medical Leave Fields (5 ranges)
      medicalLeaveFromYear1: 0,
      medicalLeaveToYear1: 1,
      medicalLeaveEntitlement1: 0,
      medicalLeaveFromYear2: 1,
      medicalLeaveToYear2: 2,
      medicalLeaveEntitlement2: 0,
      medicalLeaveFromYear3: 2,
      medicalLeaveToYear3: 3,
      medicalLeaveEntitlement3: 0,
      medicalLeaveFromYear4: 3,
      medicalLeaveToYear4: 4,
      medicalLeaveEntitlement4: 0,
      medicalLeaveFromYear5: 4,
      medicalLeaveToYear5: 99,
      medicalLeaveEntitlement5: 0,
      
      leaveCategories: leaveGroups?.map(group => ({
        leaveGroupCode: group?.leaveGrpCode,
        leaveGroupId: group?.id,
        entitlementInDay: "0",
        perIncident: false,
        selected: false
      })) || []
    };
  };

  // Validation schemas for each step
  const step1Schema = Yup.object().shape({
    leaveCategoryCode: Yup.string()
      .required('Required')
      .matches(/^[A-Za-z0-9]{6}$/, 'Must be exactly 6 alphanumeric characters'),
    leaveCategoryName: Yup.string().required('Required')
  });

  const step2Schema = Yup.object().shape({
    annualLeaveEntitlement1: Yup.number().required('Required').min(0, 'Must be at least 0'),
    annualLeaveEntitlement2: Yup.number().required('Required').min(0, 'Must be at least 0'),
    annualLeaveEntitlement3: Yup.number().required('Required').min(0, 'Must be at least 0'),
    annualLeaveEntitlement4: Yup.number().required('Required').min(0, 'Must be at least 0'),
    annualLeaveEntitlement5: Yup.number().required('Required').min(0, 'Must be at least 0')
  });

  const step3Schema = Yup.object().shape({
    medicalLeaveEntitlement1: Yup.number().required('Required').min(0, 'Must be at least 0'),
    medicalLeaveEntitlement2: Yup.number().required('Required').min(0, 'Must be at least 0'),
    medicalLeaveEntitlement3: Yup.number().required('Required').min(0, 'Must be at least 0'),
    medicalLeaveEntitlement4: Yup.number().required('Required').min(0, 'Must be at least 0'),
    medicalLeaveEntitlement5: Yup.number().required('Required').min(0, 'Must be at least 0')
  });

  const step4Schema = Yup.object().shape({
    leaveCategories: Yup.array().of(
      Yup.object().shape({
        entitlementInDay: Yup.string().required('Required').matches(/^\d+$/, 'Must be a number'),
        perIncident: Yup.boolean()
      })
    )
  });

  const handleSubmit = (values) => {
    // Filter out only selected leave categories
    const filteredValues = {
      ...values,
      leaveCategories: values.leaveCategories.filter(cat => cat.selected)
    };
    console.log(filteredValues,"sammms");
    addLeaveCategory(filteredValues);
  };

  const nextStep = () => setActiveStep(prev => prev + 1);
  const prevStep = () => setActiveStep(prev => prev - 1);

 

  // Modify the table cells for Annual Leave to make To Year editable
 

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Stepper */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${activeStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {step}
            </div>
            <span className={`mt-2 text-sm ${activeStep >= step ? 'font-semibold text-blue-500' : 'text-gray-500'}`}>
              {step === 1 && 'Basic Info'}
              {step === 2 && 'Annual Leave'}
              {step === 3 && 'Medical Leave'}
              {step === 4 && 'Other Groups'}
            </span>
          </div>
        ))}
      </div>
     

      <Formik
        enableReinitialize={true}
        initialValues={getInitialValues()}
        validationSchema={
          activeStep === 1 ? step1Schema :
            activeStep === 2 ? step2Schema :
              activeStep === 3 ? step3Schema :
                step4Schema
        }
        onSubmit={activeStep === 4 ? handleSubmit : nextStep}
      >
        {({ values, setFieldValue, isValid }) => {
        
        console.log(values?.leaveCategories,"karannnnn");
           useEffect(() => {
    // For Annual Leave
    const annualFromYear2 = values.annualLeaveToYear1 !== null ? values.annualLeaveToYear1 + 1 : 1;
    const annualFromYear3 = values.annualLeaveToYear2 !== null ? values.annualLeaveToYear2 + 1 : 2;
    const annualFromYear4 = values.annualLeaveToYear3 !== null ? values.annualLeaveToYear3 + 1 : 3;
    const annualFromYear5 = values.annualLeaveToYear4 !== null ? values.annualLeaveToYear4 + 1 : 4;
    
    // For Medical Leave
    const medicalFromYear2 = values.medicalLeaveToYear1 !== null ? values.medicalLeaveToYear1 + 1 : 1;
    const medicalFromYear3 = values.medicalLeaveToYear2 !== null ? values.medicalLeaveToYear2 + 1 : 2;
    const medicalFromYear4 = values.medicalLeaveToYear3 !== null ? values.medicalLeaveToYear3 + 1 : 3;
    const medicalFromYear5 = values.medicalLeaveToYear4 !== null ? values.medicalLeaveToYear4 + 1 : 4;
    
    setFieldValue('annualLeaveFromYear2', annualFromYear2);
    setFieldValue('annualLeaveFromYear3', annualFromYear3);
    setFieldValue('annualLeaveFromYear4', annualFromYear4);
    setFieldValue('annualLeaveFromYear5', annualFromYear5);
    
    setFieldValue('medicalLeaveFromYear2', medicalFromYear2);
    setFieldValue('medicalLeaveFromYear3', medicalFromYear3);
    setFieldValue('medicalLeaveFromYear4', medicalFromYear4);
    setFieldValue('medicalLeaveFromYear5', medicalFromYear5);
  }, [
    values.annualLeaveToYear1, values.annualLeaveToYear2, values.annualLeaveToYear3, values.annualLeaveToYear4,
    values.medicalLeaveToYear1, values.medicalLeaveToYear2, values.medicalLeaveToYear3, values.medicalLeaveToYear4,
    setFieldValue
  ]);
  const annualLeaveTable = (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">From Year</th>
          <th className="p-2 border">To Year</th>
          <th className="p-2 border">Entitlement (in days)</th>
        </tr>
      </thead>
      <tbody>
        {/* Range 1 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="annualLeaveFromYear1"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveToYear1"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.annualLeaveFromYear1}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveEntitlement1"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="annualLeaveEntitlement1"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
        
        {/* Range 2 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="annualLeaveFromYear2"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveToYear2"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.annualLeaveFromYear2}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveEntitlement2"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="annualLeaveEntitlement2"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
        
        {/* Range 3 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="annualLeaveFromYear3"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveToYear3"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.annualLeaveFromYear3}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveEntitlement3"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="annualLeaveEntitlement3"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
        
        {/* Range 4 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="annualLeaveFromYear4"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveToYear4"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.annualLeaveFromYear4}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveEntitlement4"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="annualLeaveEntitlement4"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
        
        {/* Range 5 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="annualLeaveFromYear5"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveToYear5"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.annualLeaveFromYear5}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="annualLeaveEntitlement5"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="annualLeaveEntitlement5"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
      </tbody>
    </table>
  );

  // Modify the table cells for Medical Leave to make To Year editable
  const medicalLeaveTable = (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">From Year</th>
          <th className="p-2 border">To Year</th>
          <th className="p-2 border">Entitlement (in days)</th>
        </tr>
      </thead>
      <tbody>
        {/* Range 1 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="medicalLeaveFromYear1"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveToYear1"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.medicalLeaveFromYear1}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveEntitlement1"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="medicalLeaveEntitlement1"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
        
        {/* Range 2 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="medicalLeaveFromYear2"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveToYear2"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.medicalLeaveFromYear2}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveEntitlement2"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="medicalLeaveEntitlement2"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
        
        {/* Range 3 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="medicalLeaveFromYear3"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveToYear3"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.medicalLeaveFromYear3}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveEntitlement3"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="medicalLeaveEntitlement3"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
        
        {/* Range 4 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="medicalLeaveFromYear4"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveToYear4"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.medicalLeaveFromYear4}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveEntitlement4"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="medicalLeaveEntitlement4"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
        
        {/* Range 5 */}
        <tr>
          <td className="p-2 border">
            <Field
              name="medicalLeaveFromYear5"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              readOnly
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveToYear5"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
              min={values.medicalLeaveFromYear5}
            />
          </td>
          <td className="p-2 border">
            <Field
              name="medicalLeaveEntitlement5"
              type="number"
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="medicalLeaveEntitlement5"
              component="div"
              className="text-red-500 text-xs"
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
  return (
          <Form>
            {/* Step 1: Basic Info */}
            {activeStep === 1 && (
              <div className="flex gap-8">
                <div className="w-1/2">
                  <h2 className="text-xl font-semibold mb-4">Category Details</h2>

                  <div className="mb-4">
                    <label htmlFor="leaveCategoryCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Category Code
                    </label>
                    <Field
                      name="leaveCategoryCode"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="6 alphanumeric characters"
                    />
                    <ErrorMessage name="leaveCategoryCode" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="leaveCategoryName" className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <Field
                      name="leaveCategoryName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g. MANAGER (14-21 DAYS)"
                    />
                    <ErrorMessage name="leaveCategoryName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div className="w-1/2 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Step 1: Enter code and name of the Leave Category</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Category Code:</p>
                      <p className="text-sm text-gray-600">6 alphanumeric letters</p>
                      <p className="text-sm text-gray-600">e.g. MGR14</p>
                    </div>
                    <div>
                      <p className="font-medium">Category Name:</p>
                      <p className="text-sm text-gray-600">
                        Preferably a name that describes which group of staff this leave category is meant for,
                        and the annual leave entitlement
                      </p>
                      <p className="text-sm text-gray-600">e.g. MANAGER (14 – 21 DAYS)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Annual Leave */}
            {activeStep === 2 && (
              <div className="flex gap-8">
                <div className="w-1/2">
                  <h2 className="text-xl font-semibold mb-4">Annual Leave Entitlement</h2>

                  {annualLeaveTable}
                </div>

                <div className="w-1/2 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Step 2: Setting up Annual Leave Entitlement</h3>
                  <p className="mb-4">
                    Set the annual leave Entitlement for the corresponding years of service.
                  </p>
                  <div className="mb-4">
                    <p className="font-medium">Example:</p>
                    <table className="w-full border-collapse mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border">From Year</th>
                          <th className="p-2 border">To Year</th>
                          <th className="p-2 border">Entitlement</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border">0</td>
                          <td className="p-2 border">1</td>
                          <td className="p-2 border">12</td>
                        </tr>
                        <tr>
                          <td className="p-2 border">1</td>
                          <td className="p-2 border">2</td>
                          <td className="p-2 border">13</td>
                        </tr>
                        <tr>
                          <td className="p-2 border">4</td>
                          <td className="p-2 border">99</td>
                          <td className="p-2 border">14</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>
                    This means for the first year of employment, staff will get 12 days of annual leave.
                    Second year will get 13 days. After 4 years, it will be capped at 14 days.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Medical Leave */}
            {activeStep === 3 && (
              <div className="flex gap-8">
                <div className="w-1/2">
                  <h2 className="text-xl font-semibold mb-4">Medical Leave Entitlement</h2>

              {medicalLeaveTable}
                </div>

                <div className="w-1/2 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Step 3: Setting up Medical Leave</h3>
                  <p className="mb-4">
                    Set the medical leave entitlement for the corresponding years of service.
                  </p>
                  <p>
                    Typically this ranges from 14 to 60 days depending on company policy and local regulations.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Other Leave Groups */}
            {activeStep === 4 && (
  <div className="flex gap-8">
    <div className="w-1/2">
      <h2 className="text-xl font-semibold mb-4">Other Leave Groups Entitlement</h2>

      {loadingLeaveGroups ? (
        <p>Loading leave groups...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Leave Group</th>
              <th className="p-2 border">Entitlement (in days)</th>
              <th className="p-2 border">Per Incident</th>
            </tr>
          </thead>
          <tbody>
            {values?.leaveCategories.map((group, index) => (
              <tr key={group.leaveGroupId}>
                {/* Selection checkbox */}
                <td className="p-2 border text-center">
                  <Field
                    name={`leaveCategories.${index}.selected`}
                    type="checkbox"
                    className="h-5 w-5"
                  />
                </td>

                {/* Leave group name */}
                <td className="p-2 border">
                  {leaveGroups?.find(g => g.id === group.leaveGroupId)?.leaveGrpCode || group.leaveGroupCode}
                </td>

                {/* Entitlement */}
                <td className="p-2 border">
                  <Field
                    name={`leaveCategories.${index}.entitlementInDay`}
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                  <ErrorMessage
                    name={`leaveCategories.${index}.entitlementInDay`}
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </td>

                {/* Per incident (only for CPL) */}
                <td className="p-2 border text-center">
                  {group.leaveGroupCode === "CPL" && (
                    <Field
                      name={`leaveCategories.${index}.perIncident`}
                      type="checkbox"
                      className="h-5 w-5"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    <div className="w-1/2 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Step 4: Setup for Other Leave Groups</h3>
      <p>Set the leave entitlement for each leave group. These are special leave types beyond annual and medical leave.</p>
      <p className="mt-4">Examples might include maternity/paternity leave, compassionate leave, study leave, etc.</p>
      <p className="mt-2">Check "Per Incident" only for CPL (COMPASSIONATE LEAVE) if it applies.</p>
    </div>
  </div>
)}


            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <div>
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div>
                {activeStep < 4 ? (
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`px-4 py-2 rounded ${isValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`px-4 py-2 rounded ${isValid ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </Form>
  )
       
        }}
      </Formik>
    </div>
  );
};

export default AddLeaveCategory;