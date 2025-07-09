import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddShift = () => {
  // Initial form values
  const initialValues = {
    shiftCode: '',
    shiftName: '',
    gracePeriod: '',
    afterEvery: '',
    deduct: '',
    excludeGracePeriod: false,
    earlyOutGracePeriod: '',
    earlyOutAfterEvery: '',
    earlyOutDeduct: '',
    roundUp: false,
    roundValue: '',
    minOvertime: '',
    roundDown: false,
    earlyRoundValue: '',
    earlyMinOvertime: '',
    lunchLate: '',
    dinnerLate: '',
    hairDaySettings: []
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    shiftCode: Yup.string().required('Shift Code is required'),
    shiftName: Yup.string().required('Shift Name is required'),
    gracePeriod: Yup.number().required('Grace Period is required'),
    afterEvery: Yup.number().required('After Every is required'),
    deduct: Yup.number().required('Deduct is required')
  });

  // Handle form submission
  const handleSubmit = (values) => {
    console.log('Submitted values:', values);
    // Add your submission logic here
  };

  // Days of the week for hair day settings
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className=" bg-white  m-6 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add Shift</h1>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className=' flex flex-row  gap-3 flex-2 mb-3'>
                <div className='w-[300px]'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift Code<span className='text-red-600'>*</span></label>
                  <Field
                    name="gracePeriod"
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter minutes"
                  />
                  <ErrorMessage name="gracePeriod" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className='w-[300px]'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name <span className='text-red-600'>*</span></label>
                  <Field
                    name="gracePeriod"
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter minutes"
                  />
                  <ErrorMessage name="gracePeriod" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              <div className="flex flex-nowrap overflow-x-auto pb-4 gap-2">
                {/* Shift Details Section */}



                {/* Lateness Section */}
                <div className="w-[180px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-sm font-semibold">Lateness</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (Minutes)*</label>
                        <Field
                          name="gracePeriod"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                        <ErrorMessage name="gracePeriod" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">After Every (Minutes)*</label>
                        <Field
                          name="afterEvery"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                        <ErrorMessage name="afterEvery" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deduct (Minutes)*</label>
                        <Field
                          name="deduct"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                        <ErrorMessage name="deduct" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="flex items-center">
                        <Field
                          type="checkbox"
                          name="excludeGracePeriod"
                          id="excludeGracePeriod"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="excludeGracePeriod" className="ml-2 block text-sm text-gray-700">
                          Exclude Grace Period
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Early Out Section */}
                <div className="w-[180px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-sm font-semibold">Early Out</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (Minutes)</label>
                        <Field
                          name="earlyOutGracePeriod"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">After Every (Minutes)</label>
                        <Field
                          name="earlyOutAfterEvery"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deduct (Minutes)</label>
                        <Field
                          name="earlyOutDeduct"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Over Time Section */}
                <div className="w-[180px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-sm font-semibold">Over Time</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Field
                          type="checkbox"
                          name="roundUp"
                          id="roundUp"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="roundUp" className="ml-2 block text-sm text-gray-700">
                          Round Up
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Round (Value)</label>
                        <Field
                          name="roundValue"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter value"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Over Time</label>
                        <Field
                          name="minOvertime"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Early Over Time Section */}
                <div className="w-[180px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-sm font-semibold">Early Over Time</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Field
                          type="checkbox"
                          name="roundDown"
                          id="roundDown"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="roundDown" className="ml-2 block text-sm text-gray-700">
                          Round Down
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Round (Value)</label>
                        <Field
                          name="earlyRoundValue"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter value"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Over Time</label>
                        <Field
                          name="earlyMinOvertime"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lunch/Dinner Late Section */}
                <div className="w-[180px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-sm font-semibold">Lunch / Dinner Late</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lunch Late</label>
                        <Field
                          as="select"
                          name="lunchLate"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="cik2_3">Cik 2 & 3</option>
                          <option value="cik4_5">Cik 4 & 5</option>
                          <option value="cik6_7">Cik 6 & 7</option>
                        </Field>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dinner Late</label>
                        <Field
                          as="select"
                          name="dinnerLate"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="cik2_3">Cik 2 & 3</option>
                          <option value="cik4_5">Cik 4 & 5</option>
                          <option value="cik6_7">Cik 6 & 7</option>
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hair Day Settings Section */}
                <div className="w-[180px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-sm font-semibold">Hair Day Settings</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center">
                          <Field
                            type="checkbox"
                            name={`hairDaySettings`}
                            value={day}
                            id={`hairDay-${day}`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`hairDay-${day}`} className="ml-2 block text-sm text-gray-700">
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  Save Shift
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddShift;