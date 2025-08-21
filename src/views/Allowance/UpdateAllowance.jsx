import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateAllowance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [shiftList, setShiftList] = useState([]);
  const [reasonList, setReasonList] = useState([]);
  const [clockList, setClockList] = useState([]);

  // Fetch allowance data by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch allowance criteria
        const allowanceResponse = await fetch(`http://localhost:8081/api/allowance-criteria/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!allowanceResponse.ok) {
          throw new Error('Failed to fetch allowance data');
        }
        const allowanceData = await allowanceResponse.json();

        // Fetch dropdown data
        const [shifts, reasons, clocks] = await Promise.all([
          fetch('http://localhost:8081/api/shifts/getShiftDropdown', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:8081/api/leavegroup/fetchAll', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:8081/api/branches/fetchAll', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        if (!shifts.ok || !reasons.ok || !clocks.ok) {
          throw new Error('Failed to fetch dropdown data');
        }

        const [shiftData, reasonData, clockData] = await Promise.all([
          shifts.json(),
          reasons.json(),
          clocks.json(),
        ]);

        setShiftList(shiftData);
        setReasonList(reasonData);
        setClockList(clockData);
        setInitialData(transformData(allowanceData));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // Transform backend data to form initial values
  const transformData = (data) => {
    const optionReverseMapping = {
      "Equal to": "=",
      "Greater than equal to": ">=",
      "Less than equal to": "<=",
      "Greater than": ">",
      "Less than": "<"
    };

    // Helper to trim seconds from time if present
    const trimSeconds = (timeStr) => {
      if (!timeStr) return '';
      return timeStr.length === 8 ? timeStr.substring(0, 5) : timeStr;
    };

    // Get selected days
    const selectedDays = [];
    if (data.checkByDayMonday === "YES") selectedDays.push("Monday");
    if (data.checkByDayTuesday === "YES") selectedDays.push("Tuesday");
    if (data.checkByDayWednesday === "YES") selectedDays.push("Wednesday");
    if (data.checkByDayThursday === "YES") selectedDays.push("Thursday");
    if (data.checkByDayFriday === "YES") selectedDays.push("Friday");
    if (data.checkByDaySaturday === "YES") selectedDays.push("Saturday");
    if (data.checkByDaySunday === "YES") selectedDays.push("Sunday");

    return {
      allowanceCode: data.allowanceCode || '',
      allowanceName: data.allowanceName || '',
      allowanceAmount: data.allowanceAmount || '',
      
      // Check by fields
      checkBy: [
        ...(data.checkByTimeIn ? ['time'] : []),
        ...(data.checkByNrm ? ['nrm'] : []),
        ...(data.checkByDayMonday || data.checkByDayTuesday || data.checkByDayWednesday || 
            data.checkByDayThursday || data.checkByDayFriday || data.checkByDaySaturday || 
            data.checkByDaySunday ? ['day'] : []),
        ...(data.shiftIds?.length > 0 ? ['shift'] : []),
        ...(data.leaveGroupIds?.length > 0 ? ['reason'] : []),
        ...(data.branchIds?.length > 0 ? ['clock'] : []),
      ],
      
      // Time in
      checkByTimeOption: optionReverseMapping[data.checkByTimeIn] || '',
      checkByTimeInClock: trimSeconds(data.checkByTimeInClock),
      
      // Time out
      checkByTimeOut: !!data.checkByTimeOut,
      checkByTimeOutOption: optionReverseMapping[data.checkByTimeOut] || '',
      checkByTimeOutClock: trimSeconds(data.checkByTimeOutClock),
      
      // Actual
      checkByActual: !!data.checkByActual,
      checkByActualOption: optionReverseMapping[data.checkByActual] || '',
      checkByActualClock: trimSeconds(data.checkByActualClock),
      
      // NRM
      checkByNrmOption: optionReverseMapping[data.checkByNrm] || '',
      checkByNrmClock: trimSeconds(data.checkByNrmClock),
      
      // OT
      checkByOt: !!data.checkByOt,
      checkByOtOption: optionReverseMapping[data.checkByOt] || '',
      checkByOtClock: trimSeconds(data.checkByOtClock),
      
      // Lateness
      checkByLateness: !!data.checkByLateness,
      checkByLatenessOption: optionReverseMapping[data.checkByLateness] || '',
      checkByLatenessClock: trimSeconds(data.checkByLatenessClock),
      
      // Early out
      checkByEarlyOut: !!data.checkByEarlyOut,
      checkByEarlyOutOption: optionReverseMapping[data.checkByEarlyOut] || '',
      checkByEarlyOutClock: trimSeconds(data.checkByEarlyOutClock),
      
      // PH Res
      checkByPhRes: !!data.checkByPhRes,
      checkByPhResOption: optionReverseMapping[data.checkByPhRes] || '',
      checkByPhResClock: trimSeconds(data.checkByPhResClock),
      
      // Days
      selectedDays,
      
      // Shift
      payCheckbox: data.shiftPay,
      selectedShifts: data.shiftIds || [],
      
      // Reason
      payReason: data.leaveGroupPay,
      selectedReasons: data.leaveGroupIds || [],
      
      // Clock
      payClock: data.branchClockLocationPay,
      selectedClocks: data.branchIds || [],
    };
  };

  const validationSchema = Yup.object().shape({
    allowanceCode: Yup.string().required('Allowance Code is required'),
    allowanceName: Yup.string().required('Allowance Name is required'),
    allowanceAmount: Yup.number()
      .typeError('Amount must be a number')
      .required('Allowance Amount is required'),
    checkBy: Yup.array()
      .min(1, 'Please select at least one check type')
      .required('Please select at least one check type'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitLoading(true);

    const optionMapping = {
      "=": "Equal to",
      ">=": "Greater than equal to",
      "<=": "Less than equal to",
      ">": "Greater than",
      "<": "Less than"
    };

    // Helper: ensure time string has seconds
    const formatTimeString = (timeStr) => {
      if (!timeStr) return null;
      return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    };

    try {
      const payload = {
        id: parseInt(id), // Include the ID for update
        allowanceCode: values.allowanceCode,
        allowanceName: values.allowanceName,
        allowanceAmount: Number(values.allowanceAmount),

        checkByTimeIn: optionMapping[values.checkByTimeOption] || values.checkByTimeOption,
        checkByTimeInClock: formatTimeString(values.checkByTimeInClock),

        checkByTimeOut: optionMapping[values.checkByTimeOutOption] || values.checkByTimeOutOption,
        checkByTimeOutClock: formatTimeString(values.checkByTimeOutClock),

        checkByActual: optionMapping[values.checkByActualOption] || values.checkByActualOption,
        checkByActualClock: formatTimeString(values.checkByActualClock),

        checkByNrm: optionMapping[values.checkByNrmOption] || values.checkByNrmOption,
        checkByNrmClock: formatTimeString(values.checkByNrmClock),

        checkByOt: optionMapping[values.checkByOtOption] || values.checkByOtOption,
        checkByOtClock: formatTimeString(values.checkByOtClock),

        checkByLateness: optionMapping[values.checkByLatenessOption] || values.checkByLatenessOption,
        checkByLatenessClock: formatTimeString(values.checkByLatenessClock),

        checkByEarlyOut: optionMapping[values.checkByEarlyOutOption] || values.checkByEarlyOutOption,
        checkByEarlyOutClock: formatTimeString(values.checkByEarlyOutClock),

        checkByPhRes: optionMapping[values.checkByPhResOption] || values.checkByPhResOption,
        checkByPhResClock: formatTimeString(values.checkByPhResClock),

        // Days as "YES"/"NO"
        checkByDayMonday: values.selectedDays?.includes("Monday") ? "YES" : "NO",
        checkByDayTuesday: values.selectedDays?.includes("Tuesday") ? "YES" : "NO",
        checkByDayWednesday: values.selectedDays?.includes("Wednesday") ? "YES" : "NO",
        checkByDayThursday: values.selectedDays?.includes("Thursday") ? "YES" : "NO",
        checkByDayFriday: values.selectedDays?.includes("Friday") ? "YES" : "NO",
        checkByDaySaturday: values.selectedDays?.includes("Saturday") ? "YES" : "NO",
        checkByDaySunday: values.selectedDays?.includes("Sunday") ? "YES" : "NO",

        // Booleans and IDs
        shiftPay: Boolean(values.payCheckbox),
        shiftIds: values.selectedShifts.map(Number),

        leaveGroupPay: values.payReason,
        leaveGroupIds: values.selectedReasons.map(Number),

        branchClockLocationPay: Boolean(values.payClock),
        branchIds: values.selectedClocks.map(Number)
      };

      console.log("Sending payload:", payload); // For debugging

      const response = await fetch(`http://localhost:8081/api/allowance-criteria/update-allowance/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update allowance criteria');
      }

      toast.success('Allowance criteria updated successfully!');
      //navigate('/admin/allowance/viewAllowance');
    } catch (error) {
      console.error("Error updating allowance criteria:", error);
      toast.error(error.message || 'Failed to update allowance criteria');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleShiftSelect = (selectedShifts, setFieldValue) => (shiftId, isChecked) => {
    const newShifts = isChecked 
      ? [...selectedShifts, shiftId]
      : selectedShifts.filter(id => id !== shiftId);
    setFieldValue('selectedShifts', newShifts);
  };

  const handleReasonSelect = (selectedReasons, setFieldValue) => (reasonId, isChecked) => {
    const newReasons = isChecked 
      ? [...selectedReasons, reasonId]
      : selectedReasons.filter(id => id !== reasonId);
    setFieldValue('selectedReasons', newReasons);
  };

  const handleClockSelect = (selectedClocks, setFieldValue) => (clockId, isChecked) => {
    const newClocks = isChecked 
      ? [...selectedClocks, clockId]
      : selectedClocks.filter(id => id !== clockId);
    setFieldValue('selectedClocks', newClocks);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!initialData) {
    return <div className="flex justify-center items-center h-screen">No data found</div>;
  }

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Allowance Criteria</h1>

        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                   <label className="block mb-[2px] text-[14px] font-bold text-gray-700">
  Allowance Code<span className="text-red-600">*</span>
</label>
                  <Field
                    name="allowanceCode"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <ErrorMessage name="allowanceCode" component="div" className="text-red-500 text-xs" />
                </div>

                <div>
                 <label className="block mb-[2px] text-[14px] font-bold text-gray-700">
                    Allowance Name<span className="text-red-600">*</span>
                  </label>
                  <Field
                    name="allowanceName"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <ErrorMessage name="allowanceName" component="div" className="text-red-500 text-xs" />
                </div>

                <div>
                  <label className="block mb-[2px] text-[14px] font-bold text-gray-700">
                    Allowance Amount<span className="text-red-600">*</span>
                  </label>
                  <Field
                    name="allowanceAmount"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <ErrorMessage name="allowanceAmount" component="div" className="text-red-500 text-xs" />
                </div>
              </div>

              {/* Check By Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Check by Time In */}
                <div className="border border-gray-300 rounded p-4 shadow-sm ">
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="checkBy"
                      value="time"
                      checked={values.checkBy.includes('time')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setFieldValue('checkBy', [...values.checkBy, 'time']);
                        } else {
                          setFieldValue('checkBy', values.checkBy.filter((v) => v !== 'time'));
                          setFieldValue('checkByTimeOption', '');
                          setFieldValue('checkByTimeInClock', '');
                        }
                      }}
                      className="mr-2 w-5 h-5"
                    />
                    <span className="text-md font-medium text-gray-700">Check by Time In</span>
                  </label>

                  <div className="mt-4 flex gap-4">
                    <div className="w-1/2">
                      
                      <Field
                        as="select"
                        name="checkByTimeOption"
                        className="w-full p-2 border border-gray-300 rounded"
                        disabled={!values.checkBy.includes('time')}
                      >
                        <option value="">Select Option</option>
                        <option value="=">=</option>
                        <option value="<=">&lt;=</option>
                        <option value=">=">&gt;=</option>
                      </Field>
                      <ErrorMessage name="checkByTimeOption" component="div" className="text-red-500 text-xs" />
                    </div>

                    <div className="w-1/2">
                      
                      <Field
                        type="time"
                        name="checkByTimeInClock"
                        className="w-full p-1 border border-gray-300 rounded"
                        disabled={!values.checkBy.includes('time')}
                      />
                      <ErrorMessage name="checkByTimeInClock" component="div" className="text-red-500 text-xs" />
                    </div>
                  </div>

                  {/* Time Out */}
                  <div className="mt-6">
                    <label className="inline-flex items-center mb-2">
                      <input
                        type="checkbox"
                        name="checkByTimeOut"
                        checked={values.checkByTimeOut}
                        onChange={(e) => {
                          setFieldValue('checkByTimeOut', e.target.checked);
                          if (!e.target.checked) {
                            setFieldValue('checkByTimeOutOption', '');
                            setFieldValue('checkByTimeOutClock', '');
                          }
                        }}
                        className="mr-2 w-5 h-5"
                      />
                      <span className="text-md font-medium text-gray-700">Check by Time Out</span>
                      
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                      
                        <Field
                          as="select"
                          name="checkByTimeOutOption"
                          className="w-full p-2 border border-gray-300 rounded"
                          disabled={!values.checkByTimeOut}
                        >
                          <option value="">Select Option</option>
                          <option value="=">=</option>
                          <option value="<=">&lt;=</option>
                          <option value=">=">&gt;=</option>
                        </Field>
                        <ErrorMessage name="checkByTimeOutOption" component="div" className="text-red-500 text-xs" />
                      </div>

                      <div className="w-1/2">
                     
                        <Field
                          type="time"
                          name="checkByTimeOutClock"
                          className="w-full p-1 border border-gray-300 rounded"
                          disabled={!values.checkByTimeOut}
                        />
                        <ErrorMessage name="checkByTimeOutClock" component="div" className="text-red-500 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Check by Actual */}
                  <div className="mt-6">
                    <label className="inline-flex items-center mb-2">
                      <input
                        type="checkbox"
                        name="checkByActual"
                        checked={values.checkByActual}
                        onChange={(e) => {
                          setFieldValue('checkByActual', e.target.checked);
                          if (!e.target.checked) {
                            setFieldValue('checkByActualOption', '');
                            setFieldValue('checkByActualClock', '');
                          }
                        }}
                        className="mr-2 w-5 h-5"
                      />
                      <span className="text-md font-medium text-gray-700">Check by Actual</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                        
                        <Field
                          as="select"
                          name="checkByActualOption"
                          className="w-full p-2 border border-gray-300 rounded"
                          disabled={!values.checkByActual}
                        >
                          <option value="">Select Option</option>
                          <option value="=">=</option>
                          <option value="<=">&lt;=</option>
                          <option value=">=">&gt;=</option>
                        </Field>
                        <ErrorMessage name="checkByActualOption" component="div" className="text-red-500 text-xs" />
                      </div>

                      <div className="w-1/2">
                       
                        <Field
                          type="time"
                          name="checkByActualClock"
                          className="w-full p-1 border border-gray-300 rounded"
                          disabled={!values.checkByActual}
                        />
                        <ErrorMessage name="checkByActualClock" component="div" className="text-red-500 text-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Check by NRM */}
                <div className="border border-gray-300 rounded p-4 shadow-sm ">
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="checkBy"
                      value="nrm"
                      checked={values.checkBy.includes('nrm')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setFieldValue('checkBy', [...values.checkBy, 'nrm']);
                        } else {
                          setFieldValue('checkBy', values.checkBy.filter((v) => v !== 'nrm'));
                          setFieldValue('checkByNrmOption', '');
                          setFieldValue('checkByNrmClock', '');
                        }
                      }}
                      className="mr-2 w-5 h-5"
                    />
                    <span className="text-md font-medium text-gray-700">Check by NRM</span>
                  </label>

                  <div className="mt-4 flex gap-4">
                    <div className="w-1/2">
                     
                      <Field
                        as="select"
                        name="checkByNrmOption"
                        className="w-full p-2 border border-gray-300 rounded"
                        disabled={!values.checkBy.includes('nrm')}
                      >
                        <option value="">Select Option</option>
                        <option value="=">=</option>
                        <option value="<=">&lt;=</option>
                        <option value=">=">&gt;=</option>
                      </Field>
                      <ErrorMessage name="checkByNrmOption" component="div" className="text-red-500 text-xs" />
                    </div>

                    <div className="w-1/2">
                     
                      <Field
                        type="time"
                        name="checkByNrmClock"
                        className="w-full p-1 border border-gray-300 rounded"
                        disabled={!values.checkBy.includes('nrm')}
                      />
                      <ErrorMessage name="checkByNrmClock" component="div" className="text-red-500 text-xs" />
                    </div>
                  </div>

                  {/* Check by OT */}
                  <div className="mt-6">
                    <label className="inline-flex items-center mb-2">
                      <input
                        type="checkbox"
                        name="checkByOt"
                        checked={values.checkByOt}
                        onChange={(e) => {
                          setFieldValue('checkByOt', e.target.checked);
                          if (!e.target.checked) {
                            setFieldValue('checkByOtOption', '');
                            setFieldValue('checkByOtClock', '');
                          }
                        }}
                        className="mr-2 w-5 h-5"
                      />
                      <span className="text-md font-medium text-gray-700">Check by OT</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                       
                        <Field
                          as="select"
                          name="checkByOtOption"
                          className="w-full p-2 border border-gray-300 rounded"
                          disabled={!values.checkByOt}
                        >
                          <option value="">Select Option</option>
                          <option value="=">=</option>
                          <option value="<=">&lt;=</option>
                          <option value=">=">&gt;=</option>
                        </Field>
                        <ErrorMessage name="checkByOtOption" component="div" className="text-red-500 text-xs" />
                      </div>

                      <div className="w-1/2">
                       
                        <Field
                          type="time"
                          name="checkByOtClock"
                          className="w-full p-1 border border-gray-300 rounded"
                          disabled={!values.checkByOt}
                        />
                        <ErrorMessage name="checkByOtClock" component="div" className="text-red-500 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Check by Lateness */}
                  <div className="mt-6">
                    <label className="inline-flex items-center mb-2">
                      <input
                        type="checkbox"
                        name="checkByLateness"
                        checked={values.checkByLateness}
                        onChange={(e) => {
                          setFieldValue('checkByLateness', e.target.checked);
                          if (!e.target.checked) {
                            setFieldValue('checkByLatenessOption', '');
                            setFieldValue('checkByLatenessClock', '');
                          }
                        }}
                        className="mr-2 w-5 h-5"
                      />
                      <span className="text-md font-medium text-gray-700">Check by Lateness</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                       
                        <Field
                          as="select"
                          name="checkByLatenessOption"
                          className="w-full p-2 border border-gray-300 rounded"
                          disabled={!values.checkByLateness}
                        >
                          <option value="">Select Option</option>
                          <option value="=">=</option>
                          <option value="<=">&lt;=</option>
                          <option value=">=">&gt;=</option>
                        </Field>
                        <ErrorMessage name="checkByLatenessOption" component="div" className="text-red-500 text-xs" />
                      </div>

                      <div className="w-1/2">
                      
                        <Field
                          type="time"
                          name="checkByLatenessClock"
                          className="w-full p-1 border border-gray-300 rounded"
                          disabled={!values.checkByLateness}
                        />
                        <ErrorMessage name="checkByLatenessClock" component="div" className="text-red-500 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Check by Early Out */}
                  <div className="mt-6">
                    <label className="inline-flex items-center mb-2">
                      <input
                        type="checkbox"
                        name="checkByEarlyOut"
                        checked={values.checkByEarlyOut}
                        onChange={(e) => {
                          setFieldValue('checkByEarlyOut', e.target.checked);
                          if (!e.target.checked) {
                            setFieldValue('checkByEarlyOutOption', '');
                            setFieldValue('checkByEarlyOutClock', '');
                          }
                        }}
                        className="mr-2 w-5 h-5"
                      />
                      <span className="text-md font-medium text-gray-700">Check by Early Out</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                       
                        <Field
                          as="select"
                          name="checkByEarlyOutOption"
                          className="w-full p-2 border border-gray-300 rounded"
                          disabled={!values.checkByEarlyOut}
                        >
                          <option value="">Select Option</option>
                          <option value="=">=</option>
                          <option value="<=">&lt;=</option>
                          <option value=">=">&gt;=</option>
                        </Field>
                        <ErrorMessage name="checkByEarlyOutOption" component="div" className="text-red-500 text-xs" />
                      </div>

                      <div className="w-1/2">
                       
                        <Field
                          type="time"
                          name="checkByEarlyOutClock"
                          className="w-full p-1 border border-gray-300 rounded"
                          disabled={!values.checkByEarlyOut}
                        />
                        <ErrorMessage name="checkByEarlyOutClock" component="div" className="text-red-500 text-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Check by Day */}
                <div className="border border-gray-300 rounded p-4 shadow-sm ">
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="checkBy"
                      value="day"
                      className="mr-2 w-5 h-5"
                      checked={values.checkBy.includes('day')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setFieldValue('checkBy', [...values.checkBy, 'day']);
                        } else {
                          setFieldValue('checkBy', values.checkBy.filter((v) => v !== 'day'));
                          setFieldValue('selectedDays', []);
                        }
                      }}
                    />
                    <span className="text-md font-medium text-gray-700">Check by Day</span>
                  </label>

                  <table className="w-full mt-4 border border-gray-300 text-left text-sm text-gray-700">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border-b">Day</th>
                        <th className="p-2 border-b text-center">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <tr key={day} className="hover:bg-gray-50">
                          <td className="p-2 border-b">{day}</td>
                          <td className="p-2 border-b text-center">
                            <input
                              type="checkbox"
                              checked={
                                day === 'Days'
                                  ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].every(d => values.selectedDays.includes(d))
                                  : values.selectedDays.includes(day)
                              }
                              disabled={!values.checkBy.includes('day')}
                              onChange={(e) => {
                                if (!values.checkBy.includes('day')) return;

                                if (day === 'Days') {
                                  if (e.target.checked) {
                                    // Select all
                                    setFieldValue('selectedDays', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
                                  } else {
                                    // Deselect all
                                    setFieldValue('selectedDays', []);
                                  }
                                } else {
                                  if (e.target.checked) {
                                    setFieldValue('selectedDays', [...values.selectedDays, day]);
                                  } else {
                                    setFieldValue('selectedDays', values.selectedDays.filter(d => d !== day));
                                  }
                                }
                              }}
                              className={`w-5 h-5 ${!values.checkBy.includes('day') ? 'cursor-not-allowed' : ''}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Check by Shift */}
                <div className="border border-gray-300 rounded p-4 shadow-sm ">
                  <label className="inline-flex items-center mb-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="checkBy"
                        value="shift"
                        className="w-6 h-6 mr-2"
                        checked={values.checkBy.includes('shift')}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            setFieldValue('checkBy', [...values.checkBy, 'shift']);
                          } else {
                            setFieldValue('checkBy', values.checkBy.filter((v) => v !== 'shift'));
                          }
                        }}
                      />
                      <span className="text-md font-medium text-gray-700">Check by Shift</span>
                    </div>

                    <div className="flex items-center ml-11 space-x-2">
                      <input
                        type="checkbox"
                        name="payCheckbox"
                        className="w-5 h-5"
                        disabled={!values.checkBy.includes('shift')}
                        checked={values.payCheckbox}
                        onChange={(e) => setFieldValue('payCheckbox', e.target.checked)}
                      />
                      <span className="text-md font-semibold text-gray-700">Pay</span>

                      <div className="relative flex items-center justify-center w-4 h-4">
                        <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
                          <span className="hover-target">ℹ️</span>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-yellow-100 text-black text-sm px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-normal text-left pointer-events-none">
                            <p className="mb-1 font-medium">When Pay is enabled:</p>
                            <p className="mb-1">Entries that are <strong>ticked below</strong> will be used for criteria verification.</p>
                            <p className="mt-2 font-medium">When Pay is disabled:</p>
                            <p>Entries that are <strong>unticked below</strong> will be used for criteria verification.</p>
                          </div>
                        </span>
                      </div>
                    </div>
                  </label>

                  <div className="mt-3 border p-3 rounded">
                    {shiftList.length > 0 ? (
                      <table className="min-w-full text-sm border table-fixed">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="p-2 border" style={{ width: '180px' }}>Code</th>
                            <th className="p-2 border" style={{ width: '220px' }}>Name</th>
                            <th className="p-2 border" style={{ width: '80px' }}>Select</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shiftList.map((shift) => {
                            const isChecked = values.selectedShifts.includes(shift.id);
                            return (
                              <tr key={shift.id}>
                                <td className="p-2 border" style={{ width: '180px' }}>{shift.shiftCode}</td>
                                <td className="p-2 border" style={{ width: '220px' }}>{shift.shiftName}</td>
                                <td className="p-2 border text-center" style={{ width: '80px' }}>
                                  <input
                                    type="checkbox"
                                    className="w-5 h-5"
                                    disabled={!values.checkBy.includes('shift')}
                                    checked={isChecked}
                                    onChange={(e) => handleShiftSelect(values.selectedShifts, setFieldValue)(shift.id, e.target.checked)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-600">No shift data available.</p>
                    )}
                  </div>
                </div>

                {/* Check by Reason */}
                <div className="border border-gray-300 rounded p-4 shadow-sm ">
                  <div className="flex items-center mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="checkBy"
                        value="reason"
                        checked={values.checkBy.includes("reason")}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            setFieldValue("checkBy", [...values.checkBy, "reason"]);
                          } else {
                            setFieldValue(
                              "checkBy",
                              values.checkBy.filter((v) => v !== "reason")
                            );
                            setFieldValue("payReason", false);
                          }
                        }}
                        className="mr-2 w-5 h-5"
                      />
                      <span className="text-md font-medium text-gray-700">
                        Check by Reason
                      </span>
                    </label>

                    <label className="inline-flex items-center ml-8">
                      <input
                        type="checkbox"
                        name="payReason"
                        checked={values.payReason || false}
                        disabled={!values.checkBy.includes("reason")}
                        onChange={(e) => setFieldValue("payReason", e.target.checked)}
                        className="mr-2 w-5 h-5 ml-11"
                      />
                      <span className="text-md font-semibold text-gray-700 mr-2">Pay</span>

                      <div className="relative flex items-center justify-center w-4 h-4">
                        <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
                          <span className="hover-target">ℹ️</span>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-yellow-100 text-black text-sm px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-normal text-left pointer-events-none">
                            <p className="mb-1 font-medium">When Pay is enabled:</p>
                            <p className="mb-1">Entries that are <strong>ticked below</strong> will be used for criteria verification.</p>
                            <p className="mt-2 font-medium">When Pay is disabled:</p>
                            <p>Entries that are <strong>unticked below</strong> will be used for criteria verification.</p>
                          </div>
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="mt-3 border p-3 rounded">
                    {reasonList.length > 0 ? (
                      <table className="min-w-full text-sm border">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">Code</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Select</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reasonList.map((reason) => {
                            const isChecked = values.selectedReasons.includes(reason.id);
                            return (
                              <tr key={reason.id}>
                                <td className="p-2 border">{reason.leaveGrpCode}</td>
                                <td className="p-2 border">{reason.leaveGrpName}</td>
                                <td className="p-2 border text-center">
                                  <input
                                    type="checkbox"
                                    className="w-5 h-5"
                                    disabled={!values.checkBy.includes("reason")}
                                    checked={isChecked}
                                    onChange={(e) => handleReasonSelect(values.selectedReasons, setFieldValue)(reason.id, e.target.checked)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-600">No reason data available.</p>
                    )}
                  </div>
                </div>

                {/* Check by Clock Location */}
                <div className="border border-gray-300 rounded p-4 shadow-sm ">
                  <div className="flex items-center mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="checkBy"
                        value="clock"
                        className="mr-2 w-5 h-5"
                        checked={values.checkBy.includes("clock")}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            setFieldValue("checkBy", [...values.checkBy, "clock"]);
                          } else {
                            setFieldValue(
                              "checkBy",
                              values.checkBy.filter((v) => v !== "clock")
                            );
                            setFieldValue("selectedClocks", []);
                            setFieldValue("payClock", false);
                          }
                        }}
                      />
                      <span className="text-md font-medium text-gray-700">
                        Check by Clock Location
                      </span>
                    </label>

                    <label className="inline-flex items-center ml-8">
                      <input
                        type="checkbox"
                        name="payClock"
                        checked={values.payClock || false}
                        disabled={!values.checkBy.includes("clock")}
                        onChange={(e) => setFieldValue("payClock", e.target.checked)}
                        className="mr-2 w-5 h-5"
                      />
                      <span className="text-md font-semibold text-gray-700 mr-2">Pay</span>

                      <div className="relative flex items-center justify-center w-4 h-4 mr-3">
                        <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
                          <span className="hover-target">ℹ️</span>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-yellow-100 text-black text-sm px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-normal text-left pointer-events-none">
                            <p className="mb-1 font-medium">When Pay is enabled:</p>
                            <p className="mb-1">Entries that are <strong>ticked below</strong> will be used for criteria verification.</p>
                            <p className="mt-2 font-medium">When Pay is disabled:</p>
                            <p>Entries that are <strong>unticked below</strong> will be used for criteria verification.</p>
                          </div>
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="mt-3 border p-3 rounded">
                    {clockList.length > 0 ? (
                      <table className="min-w-full text-sm border">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">Code</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Select</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clockList.map((clock) => {
                            const isChecked = values.selectedClocks.includes(clock.id);
                            return (
                              <tr key={clock.id}>
                                <td className="p-2 border">{clock.branchCode}</td>
                                <td className="p-2 border">{clock.branchName}</td>
                                <td className="p-2 border text-center">
                                  <input
                                    type="checkbox"
                                    className="w-5 h-5"
                                    disabled={!values.checkBy.includes("clock")}
                                    checked={isChecked}
                                    onChange={(e) => handleClockSelect(values.selectedClocks, setFieldValue)(clock.id, e.target.checked)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-600">No clock location data available.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/admin/allowance/viewAllowance')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default UpdateAllowance;