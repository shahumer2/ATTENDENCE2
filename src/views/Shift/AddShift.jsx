import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useShift from 'hooks/useShift';

const AddShift = () => {


  const { handleSubmit, initialValues } = useShift()
  // Initial form values


  // Validation schema
  const validationSchema = Yup.object().shape({
    shiftCode: Yup.string().required('Shift Code is required'),
    shiftName: Yup.string().required('Shift Name is required'),
    lateGracePeriod: Yup.number().required('Grace Period is required'),
    lateAfterPeriod: Yup.number().required('After Every is required'),
    latenessDeduct: Yup.number().required('Deduct is required')
  });

  // Days of the week
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  // Handle form submission
  // const handleSubmit = (values) => {
  //   // Prepare the data for API

  //   };

  //   console.log('Submitted values:', requestData);
  //   // Add your API submission logic here
  //   // axios.post('/api/shifts', requestData).then(...)
  // };

  return (
    <div className="bg-white m-6 min-h-screen p-6">
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
              <div className='flex flex-row gap-3 flex-2 mb-3'>
                <div className='w-[300px]'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift Code<span className='text-red-600'>*</span></label>
                  <Field
                    name="shiftCode"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter shift code"
                  />
                  <ErrorMessage name="shiftCode" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className='w-[300px]'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name <span className='text-red-600'>*</span></label>
                  <Field
                    name="shiftName"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter shift name"
                  />
                  <ErrorMessage name="shiftName" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              <div className="flex flex-nowrap overflow-x-auto pb-4 gap-2">
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
                          name="lateGracePeriod"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                        <ErrorMessage name="lateGracePeriod" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">After Every (Minutes)*</label>
                        <Field
                          name="lateAfterPeriod"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                        <ErrorMessage name="lateAfterPeriod" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deduct (Minutes)*</label>
                        <Field
                          name="latenessDeduct"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter minutes"
                        />
                        <ErrorMessage name="latenessDeduct" component="div" className="text-red-500 text-xs mt-1" />
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
                      <div className="flex items-center">
                        <Field
                          type="checkbox"
                          name="latenessOffsetOT"
                          id="latenessOffsetOT"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="latenessOffsetOT" className="ml-2 block text-sm text-gray-700">
                          Offset OT
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Round</label>
                        <Field
                          as="select"
                          name="overTimeRound"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="NEAREST">Nearest</option>
                          <option value="UP">Up</option>
                          <option value="DOWN">Down</option>
                        </Field>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Round (Value)</label>
                        <Field
                          name="overTimeRoundValue"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter value"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Over Time</label>
                        <Field
                          name="overTimeMinOT"
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Round</label>
                        <Field
                          as="select"
                          name="earlyOverTimeRound"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="NEAREST">Nearest</option>
                          <option value="UP">Up</option>
                          <option value="DOWN">Down</option>
                        </Field>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Round (Value)</label>
                        <Field
                          name="earlyOverTimeRoundValue"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter value"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Over Time</label>
                        <Field
                          name="earlyOverTimeMinOT"
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
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="lunchLateTwoThree"
                              id="lunchLateTwoThree"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="lunchLateTwoThree" className="ml-2 block text-sm text-gray-700">
                              Cik 2 & 3
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="lunchLateFourFive"
                              id="lunchLateFourFive"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="lunchLateFourFive" className="ml-2 block text-sm text-gray-700">
                              Cik 4 & 5
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="lunchLateSixSeven"
                              id="lunchLateSixSeven"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="lunchLateSixSeven" className="ml-2 block text-sm text-gray-700">
                              Cik 6 & 7
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dinner Late</label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="dinnerOneLateTwoThree"
                              id="dinnerOneLateTwoThree"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="dinnerOneLateTwoThree" className="ml-2 block text-sm text-gray-700">
                              Dinner1 Cik 2 & 3
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="dinnerOneLateFourFive"
                              id="dinnerOneLateFourFive"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="dinnerOneLateFourFive" className="ml-2 block text-sm text-gray-700">
                              Dinner1 Cik 4 & 5
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="dinnerOneLateSixSeven"
                              id="dinnerOneLateSixSeven"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="dinnerOneLateSixSeven" className="ml-2 block text-sm text-gray-700">
                              Dinner1 Cik 6 & 7
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="dinnerTwoLateTwoThree"
                              id="dinnerTwoLateTwoThree"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="dinnerTwoLateTwoThree" className="ml-2 block text-sm text-gray-700">
                              Dinner2 Cik 2 & 3
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="dinnerTwoLateFourFive"
                              id="dinnerTwoLateFourFive"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="dinnerTwoLateFourFive" className="ml-2 block text-sm text-gray-700">
                              Dinner2 Cik 4 & 5
                            </label>
                          </div>
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="dinnerTwoLateSixSeven"
                              id="dinnerTwoLateSixSeven"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="dinnerTwoLateSixSeven" className="ml-2 block text-sm text-gray-700">
                              Dinner2 Cik 6 & 7
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Half Day Settings Section */}
                <div className="w-[180px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-sm font-semibold">Half Day Settings</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center">
                          <Field
                            type="checkbox"
                            name="halfDaySetting"
                            value={day}
                            id={`halfDay-${day}`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`halfDay-${day}`} className="ml-2 block text-sm text-gray-700">
                            {day.charAt(0) + day.slice(1).toLowerCase()}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>

                  <Field
                    type="checkbox"
                    // name={`shiftSchedulers[${index}].res`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    // value={values.shiftSchedulers[index].res}
                    // checked={values.shiftSchedulers[index].res}
                    onChange={(e) => {
                      // setFieldValue(`shiftSchedulers[${index}].res`, e.target.checked);
                    }}
                  />
                  <label>Day Change On Same Day</label>

                </div>
                <div>

                  <Field
                    type="checkbox"
                    // name={`shiftSchedulers[${index}].res`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    // value={values.shiftSchedulers[index].res}
                    // checked={values.shiftSchedulers[index].res}
                    onChange={(e) => {
                      // setFieldValue(`shiftSchedulers[${index}].res`, e.target.checked);
                    }}
                  />
                  <label>Off Set Ph</label>

                </div>

              </div>

              {/* Shift Schedule Table */}
              <div className="mt-8 overflow-scroll">
                <h2 className="text-xl font-bold mb-4">Shift Schedule</h2>
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className='bg-blue-100'>
                      {['Day', 'Time In', 'Time Out', 'Lunch Out', 'Lunch In', 'NRM', 'RES', 'OT', 'Extra', 'E. Rate', 'Max Hr.', 'Lunch Late'].map((heading, index) => (
                        <th key={index} className="border px-4 py-2 text-left">{heading}</th>
                      ))}
                      <th className="border px-4 py-2 text-left" >PH</th>
                      <th className="border px-4 py-2 text-left" >PH Max</th>
                      <th className="border px-4 py-2 text-left">PH Ext</th>
                      <th className="border px-4 py-2 text-left" colSpan={2}>Dinner</th>
                      <th className="border px-4 py-2 text-left" colSpan={4}>Over Time Deductions</th>
                      <th className="border px-4 py-2 text-left" colSpan={6}>Breaks</th>
                      <th className="border px-9 py-2 text-left ">Show Off</th>
                    </tr>
                    <tr>
                      {Array(15).fill().map((_, index) => (
                        <th key={`empty-${index}`} className="border px-4 py-2 text-left  bg-gray-100"></th>
                      ))}
                      <th className="border px-4 w-[300px] py-2 text-left bg-gray-100 whitespace-nowrap">Late 1</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">Late 2</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap" >OT Hr 1</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">1-Ded</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap" >OT Hr 2</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">2-Ded</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap" >OT Hr 3</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">3-Ded</th>

                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">Break 1 Out</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">Break 1 In</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">Break 2 Out</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">Break 2 In</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">Break 3 Out</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">Break 3 In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values?.shiftSchedulers.map((day, index) => (
                      <tr key={index} className='bg-gray-50'>
                        <td className="border px-4 py-2 bg-yellow-100">{daysOfWeek[index].charAt(0) + daysOfWeek[index].slice(1).toLowerCase()}</td>
                        <td className="border px-4 py-2 bg-purple-100">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].inTime`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2 bg-purple-100">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].outTime`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].lunchOut`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].lunchIn`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].nrm`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <Field
                            type="checkbox"
                            name={`shiftSchedulers[${index}].res`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            value={values.shiftSchedulers[index].res}
                            checked={values.shiftSchedulers[index].res}
                            onChange={(e) => {
                              setFieldValue(`shiftSchedulers[${index}].res`, e.target.checked);
                            }}
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="number"
                            name={`shiftSchedulers[${index}].overTime`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">

                          <Field
                            type="checkbox"
                            name={`shiftSchedulers[${index}].extra`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            value={values.shiftSchedulers[index].extra}
                            checked={values.shiftSchedulers[index].extra}
                            onChange={(e) => {
                              setFieldValue(`shiftSchedulers[${index}].extra`, e.target.checked);
                            }}
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="number"
                            name={`shiftSchedulers[${index}].eRate`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].maxHour`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">

                          <Field
                            type="checkbox"
                            name={`shiftSchedulers[${index}].lunchLate`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            value={values.shiftSchedulers[index].lunchLate}
                            checked={values.shiftSchedulers[index].lunchLate}
                            onChange={(e) => {
                              setFieldValue(`shiftSchedulers[${index}].lunchLate`, e.target.checked);
                            }}
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="number"
                            name={`shiftSchedulers[${index}].phHours`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].phMax`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="number"
                            name={`shiftSchedulers[${index}].phExtra`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>




                        <td className="border px-4 py-2">
                          <Field
                            type="checkbox"
                            name={`shiftSchedulers[${index}].dinnerLate1`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            value={values.shiftSchedulers[index].dinnerLate1}
                            checked={values.shiftSchedulers[index].dinnerLate1}
                            onChange={(e) => {
                              setFieldValue(`shiftSchedulers[${index}].dinnerLate1`, e.target.checked);
                            }}
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="checkbox"
                            name={`shiftSchedulers[${index}].dinnerLate2`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            value={values.shiftSchedulers[index].dinnerLate2}
                            checked={values.shiftSchedulers[index].dinnerLate2}
                            onChange={(e) => {
                              setFieldValue(`shiftSchedulers[${index}].dinnerLate2`, e.target.checked);
                            }}
                          />
                        </td>




                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otHour1`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otDeduct1`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otHour2`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otDeduct2`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otHour3`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otDeduct3`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].break1Out`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].break1In`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].break2Out`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].break2In`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].break3Out`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].break3In`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <Field
                            type="checkbox"
                            name={`shiftSchedulers[${index}].showOff`}
                            className="h-4 w-4"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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