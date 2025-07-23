import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MdDelete } from 'react-icons/md';

const UpdateAutoShift = () => {
  const [shiftOptions, setShiftOptions] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch shift options
  useEffect(() => {
    fetch("http://localhost:8081/api/shifts/getShiftDropdown", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setShiftOptions(data))
      .catch(err => {
        console.error("Error fetching shift options:", err);
        setShiftOptions([]);
      });
  }, [token]);

  // Fetch AutoShift by ID
  useEffect(() => {
    if (!id) return;

    const fetchAssignedShiftDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/autoshift/getBy/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        const shiftDurations = data.shiftDurations || [];

        const enrichedShifts = await Promise.all(
          shiftDurations.map(async (shift) => {
            try {
              const shiftResponse = await fetch(`http://localhost:8081/api/shifts/${shift.shiftId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (!shiftResponse.ok) throw new Error(`Shift fetch failed: ${shift.shiftId}`);
              const shiftDetails = await shiftResponse.json();

              return {
                shiftId: shift.shiftId,
                shiftLabel: `${shiftDetails.shiftCode} - ${shiftDetails.shiftName}`,
                fromTime: shift.startTime?.split('T')[1]?.substring(0, 5) || '00:00',
                toTime: shift.endTime?.split('T')[1]?.substring(0, 5) || '00:00',
              };
            } catch (error) {
              return {
                shiftId: shift.shiftId,
                shiftLabel: 'Unknown Shift',
                fromTime: shift.startTime?.split('T')[1]?.substring(0, 5) || '00:00',
                toTime: shift.endTime?.split('T')[1]?.substring(0, 5) || '00:00',
              };
            }
          })
        );

        setInitialValues({
          autoShiftCode: data.autoShiftCode || '',
          autoShiftName: data.autoShiftName || '',
          shiftSchedulers: enrichedShifts.filter(
            (s) => s.shiftId || s.fromTime !== '00:00' || s.toTime !== '00:00'
          ),
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching AutoShift or shift details:", err);
        setLoading(false);
      }
    };

    fetchAssignedShiftDetails();
  }, [id, token]);

  const validationSchema = Yup.object().shape({
    autoShiftCode: Yup.string().required('Auto Shift Code is required'),
    autoShiftName: Yup.string().required('Auto Shift Name is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const payload = {
        autoShiftCode: values.autoShiftCode,
        autoShiftName: values.autoShiftName,
        shiftDurations: values.shiftSchedulers
          .filter((s) => s.shiftId !== null)
          .map((s) => ({
            shiftId: s.shiftId,
            startTime: `${today}T${s.fromTime}:00`,
            endTime: `${today}T${s.toTime}:00`,
          })),
      };

      const response = await fetch(
        `http://localhost:8081/api/autoshift/updateAutoShift/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      alert("AutoShift updated successfully!");
      navigate("/admin/ETMS/AutoShift");
      resetForm();
    } catch (error) {
      console.error("Error updating AutoShift:", error);
      alert("Failed to update AutoShift.");
    }
  };

  if (loading || !initialValues) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Update AutoShift</h1>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto Shift Code
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
                    Auto Shift Name
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

              <div className="overflow-x-auto mt-6" ref={dropdownRef}>
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">From</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">To</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Assigned Shift</th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
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
                        <td className="border px-4 py-2 relative">
                          <div
                            className="cursor-pointer bg-gray-100 p-1 rounded border border-gray-300"
                            onClick={() =>
                              setOpenDropdownIndex(openDropdownIndex === index ? null : index)
                            }
                          >
                            {scheduler.shiftLabel || 'Select Shift'}
                          </div>
                          {openDropdownIndex === index && (
                            <div className="absolute z-10 mt-1 bg-white border border-gray-300 shadow-md w-[300px] max-h-64 overflow-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="p-2 text-left border-b">Shift Code</th>
                                    <th className="p-2 text-left border-b">Shift Name</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {shiftOptions.map((shift, idx) => (
                                    <tr
                                      key={idx}
                                      className="hover:bg-blue-100 cursor-pointer"
                                      onClick={() => {
                                        setFieldValue(`shiftSchedulers[${index}].shiftId`, shift.id);
                                        setFieldValue(`shiftSchedulers[${index}].shiftLabel`, `${shift.shiftCode} - ${shift.shiftName}`);
                                        setOpenDropdownIndex(null);
                                      }}
                                    >
                                      <td className="p-2 border-b">{shift.shiftCode}</td>
                                      <td className="p-2 border-b">{shift.shiftName}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedList = [...values.shiftSchedulers];
                              updatedList.splice(index, 1);
                              setFieldValue('shiftSchedulers', updatedList);
                            }}
                            className="text-red-600 hover:underline"
                          >
                            <MdDelete size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add Row Button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue('shiftSchedulers', [
                        ...values.shiftSchedulers,
                        {
                          shiftId: null,
                          shiftLabel: '',
                          fromTime: '00:00',
                          toTime: '00:00',
                        },
                      ])
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    + Add Row
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => navigate('/admin/ETMS/AutoShift')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateAutoShift;
