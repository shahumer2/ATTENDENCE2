import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const AddAutoShift = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRefs = useRef([]);
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const initialValues = {
    autoShiftCode: '',
    autoShiftName: '',
    shiftSchedulers: [],
  };

  const validationSchema = Yup.object().shape({
    autoShiftCode: Yup.string().required('Auto Shift Code is required'),
    autoShiftName: Yup.string().required('Auto Shift Name is required'),
  });

  useEffect(() => {
    fetch("http://localhost:8081/api/shifts/getShiftDropdown", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setShiftOptions(data);
      })
      .catch((error) => {
        console.error("Error fetching shift options:", error);
        setShiftOptions([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = dropdownRefs.current.every(
        (ref) => ref?.current && !ref.current.contains(event.target)
      );
      if (isOutside) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const payload = {
        autoShiftCode: values.autoShiftCode,
        autoShiftName: values.autoShiftName,
        shiftDurations: values.shiftSchedulers
          .filter(s => s.shiftId !== null)
          .map(s => ({
            shiftId: s.shiftId,
            startTime: `${today}T${s.fromTime}:00`,
            endTime: `${today}T${s.toTime}:00`,
          })),
      };

      const response = await fetch("http://localhost:8081/api/autoshift/addAutoShift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      await response.json();
      alert("AutoShift saved successfully!");
      resetForm();
      navigate('/admin/ETMS/AutoShift');
    } catch (error) {
      console.error("Error saving AutoShift:", error);
      alert("Failed to save AutoShift.");
    }
  };

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Auto Shift</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            dropdownRefs.current = values.shiftSchedulers.map((_, i) => dropdownRefs.current[i] ?? React.createRef());

            return (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Auto Shift Code<span className="text-red-600">*</span>
                    </label>
                    <Field
                      name="autoShiftCode"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <ErrorMessage
                      name="autoShiftCode"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Auto Shift Name<span className="text-red-600">*</span>
                    </label>
                    <Field
                      name="autoShiftName"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <ErrorMessage
                      name="autoShiftName"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">From</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">To</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-[450px]">Assigned Shift</th>
                      </tr>
                    </thead>
                    <FieldArray name="shiftSchedulers">
                      {({ push }) => (
                        <>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {values.shiftSchedulers.map((scheduler, index) => (
                              <tr key={index}>
                                <td className="border px-4 py-2">
                                  <Field
                                    type="time"
                                    name={`shiftSchedulers[${index}].fromTime`}
                                    className="px-0 w-[80px] mx-1 border border-gray-300 rounded"
                                  />
                                </td>
                                <td className="border px-4 py-2">
                                  <Field
                                    type="time"
                                    name={`shiftSchedulers[${index}].toTime`}
                                    className="px-0 w-[80px] mx-1 border border-gray-300 rounded"
                                  />
                                </td>
                                <td className="border px-4 py-2 relative min-w-[350px] max-w-[350px] w-[350px]">
                                  <div
                                    title={scheduler.shiftLabel}
                                    className="cursor-pointer bg-gray-100 p-1 rounded border border-gray-300 w-full truncate overflow-hidden whitespace-nowrap"
                                    onClick={() =>
                                      !loading && setOpenDropdownIndex(openDropdownIndex === index ? null : index)
                                    }
                                  >
                                    {scheduler.shiftLabel || 'Select Shift'}
                                  </div>

                                  {openDropdownIndex === index && (
                                    <div
                                      ref={(el) => {
                                        if (!dropdownRefs.current[index]) {
                                          dropdownRefs.current[index] = React.createRef();
                                        }
                                        dropdownRefs.current[index].current = el;
                                      }}
                                      className="absolute z-10 mt-1 bg-white border border-gray-300 shadow-md w-[350px] max-h-60 overflow-y-auto"
                                    >
                                      <table className="min-w-[350px] text-sm">
                                        <thead className="bg-gray-200">
                                          <tr>
                                            <th className="p-2 text-left border-b">Shift Code</th>
                                            <th className="p-2 text-left border-b">Shift Name</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {loading ? (
                                            <tr>
                                              <td colSpan={2} className="p-2 text-center text-gray-500">
                                                Loading...
                                              </td>
                                            </tr>
                                          ) : (
                                            <>
                                              <tr
                                                className="hover:bg-red-100 cursor-pointer"
                                                onClick={() => {
                                                  setFieldValue(`shiftSchedulers[${index}].shiftId`, null);
                                                  setFieldValue(`shiftSchedulers[${index}].shiftLabel`, '');
                                                  setOpenDropdownIndex(null);
                                                }}
                                              >
                                                <td className="p-2 border-b font-semibold text-black-600">Deselect Shift</td>
                                                <td className="p-2 border-b"></td>
                                              </tr>

                                              {shiftOptions.map((shift, idx) => (
                                                <tr
                                                  key={idx}
                                                  className="hover:bg-blue-100 cursor-pointer"
                                                  onClick={() => {
                                                    setFieldValue(`shiftSchedulers[${index}].shiftId`, shift.id);
                                                    setFieldValue(
                                                      `shiftSchedulers[${index}].shiftLabel`,
                                                      `${shift.shiftCode} - ${shift.shiftName}`
                                                    );
                                                    setOpenDropdownIndex(null);
                                                  }}
                                                >
                                                  <td className="p-2 border-b">{shift.shiftCode}</td>
                                                  <td className="p-2 border-b">{shift.shiftName}</td>
                                                </tr>
                                              ))}
                                            </>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>

                          <tfoot>
                            <tr>
                              <td colSpan="3" className="text-right px-4 py-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    push({
                                      shiftId: null,
                                      shiftLabel: '',
                                      fromTime: '00:00',
                                      toTime: '00:00',
                                    })
                                  }
                                  className="mt-2 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  + Add Row
                                </button>
                              </td>
                            </tr>
                          </tfoot>
                        </>
                      )}
                    </FieldArray>
                  </table>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/ETMS/AutoShift')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    Save
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddAutoShift;
