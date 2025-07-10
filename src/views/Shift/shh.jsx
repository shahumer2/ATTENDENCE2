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
    hairDaySettings: [],
    days: Array.from({ length: 7 }, () => ({
      inTime: '08:00',
      outTime: '17:00',
      lunchIn: '12:00',
      lunchOut: '13:00',
      nrm: '08:00',
      res: '0.0',
      overTime: '0.0',
      extra: '',
      eRate: '0.0',
      maxHr: '',
      lunchLate: '',
      dinnerLate1: '',
      dinnerLate2: ''
    }))
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    shiftCode: Yup.string().required('Shift Code is required'),
    shiftName: Yup.string().required('Shift Name is required'),
    gracePeriod: Yup.number().required('Grace Period is required'),
    afterEvery: Yup.number().required('After Every is required'),
    deduct: Yup.number().required('Deduct is required'),
  });

  // Handle form submission
  const handleSubmit = (values) => {
    console.log('Submitted values:', values);
    // Add your submission logic here
  };

  // Days of the week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Add Shift</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Existing form fields ... */}

              {/* New Shift Schedule Table */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Shift Schedule</h2>
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      {['Day', 'Time In', 'Time Out', 'Lunch Out', 'Lunch In', 'NRM', 'RES', 'OT', 'Extra', 'E. Rate', 'Max Hr.', 'Lunch Late', 'Dinner Late'].map((heading, index) => (
                        <th key={index} className="border px-4 py-2 text-left">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {daysOfWeek.map((day, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{day}</td>
                        <td className="border px-4 py-2">
                          <Field type="time" name={`days[${index}].inTime`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="time" name={`days[${index}].outTime`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="time" name={`days[${index}].lunchOut`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="time" name={`days[${index}].lunchIn`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="text" name={`days[${index}].nrm`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="number" name={`days[${index}].res`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="number" name={`days[${index}].overTime`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="text" name={`days[${index}].extra`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="number" name={`days[${index}].eRate`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="text" name={`days[${index}].maxHr`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="text" name={`days[${index}].lunchLate`} />
                        </td>
                        <td className="border px-4 py-2">
                          <Field type="text" name={`days[${index}].dinnerLate1`} />
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
