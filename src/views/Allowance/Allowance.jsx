import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ADD_Allowance_DATA } from 'Constants/utils'; // adjust path
import { GET_Shift_URL } from "Constants/utils"; // adjust path if needed
import { GET_Reason_URL } from "Constants/utils"; // adjust path if needed
import { GET_Clocklocation_URL } from "Constants/utils"; // adjust the path if needed


const Allowance = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const [shiftList, setShiftList] = useState([]);
  const [reasonList, setReasonList] = useState([]);
  const [clockList, setClockList] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [selectedClocks, setSelectedClocks] = useState([]);


  
  useEffect(() => {
    // const fetchShifts = async () => {
    //   try {
    //     const response = await fetch('http://localhost:8081/api/shifts/getShiftDropdown', {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error('Failed to fetch shift list');
    //     }

    //     const data = await response.json();
    //     setShiftList(data);
    //   } catch (error) {
    //     console.error('Error fetching shift data:', error);
    //     toast.error('Failed to load shift data');
    //   }
    // };


    

const fetchShifts = async () => {
  try {
    const response = await fetch(GET_Shift_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shift list");
    }

    const data = await response.json();
    setShiftList(data);
  } catch (error) {
    console.error("Error fetching shift data:", error);
    toast.error("Failed to load shift data");
  }
};

    // const fetchReason = async () => {
    //   try {
    //     const response = await fetch('http://localhost:8081/api/leavegroup/fetchAll', {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error('Failed to fetch reason list');
    //     }

    //     const data = await response.json();
    //     setReasonList(data);
    //   } catch (error) {
    //     console.error('Error fetching reason data:', error);
    //     toast.error('Failed to load reason data');
    //   }
    // };

    

const fetchReason = async () => {
  try {
    const response = await fetch(GET_Reason_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reason list");
    }

    const data = await response.json();
    setReasonList(data);
  } catch (error) {
    console.error("Error fetching reason data:", error);
    toast.error("Failed to load reason data");
  }
};

    // const fetchClock = async () => {
    //   try {
    //     const response = await fetch('http://localhost:8081/api/branches/fetchAll', {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });

        
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch clock location list');
    //     }

    //     const data = await response.json();
    //     //console.log('API Response Data:', data); // Log the parsed JSON data
    //     setClockList(data);
    //   } catch (error) {
    //     console.error('Error fetching clock location data:', error);
    //     toast.error('Failed to load clock location data');
    //   }
    // };
    

const fetchClock = async () => {
  try {
    const response = await fetch(GET_Clocklocation_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch clock location list");
    }

    const data = await response.json();
    // console.log("API Response Data:", data);
    setClockList(data);
  } catch (error) {
    console.error("Error fetching clock location data:", error);
    toast.error("Failed to load clock location data");
  }
};

    setLoading(true);
    Promise.all([fetchShifts(), fetchReason(), fetchClock()])
      .finally(() => setLoading(false));
  }, [token]);

  

// const handleSubmit = async (values, { resetForm }) => {
//   setSubmitLoading(true);

//   const optionMapping = {
//     "=": "Equal to",
//     ">=": "Greater than equal to",
//     "<=": "Less than equal to",
//     ">": "Greater than",
//     "<": "Less than"
//   };

//   // Helper: ensure time string has seconds
//   const formatTimeString = (timeStr) => {
//     if (!timeStr) return null;
//     return timeStr.length === 5 ? `${timeStr}:00` : timeStr;  // if "HH:mm", add ":00"
//   };

//   try {
//     const payload = {
//       allowanceCode: values.allowanceCode,
//       allowanceName: values.allowanceName,
//       allowanceAmount: Number(values.allowanceAmount),

//       checkByTimeIn: optionMapping[values.checkByTimeOption] || values.checkByTimeOption,
//       checkByTimeInClock: formatTimeString(values.checkByTimeInClock),

//       checkByTimeOut: optionMapping[values.checkByTimeOutOption] || values.checkByTimeOutOption,
//       checkByTimeOutClock: formatTimeString(values.checkByTimeOutClock),

//       checkByActual: optionMapping[values.checkByActualOption] || values.checkByActualOption,
//       checkByActualClock: formatTimeString(values.checkByActualClock),

//       checkByNrm: optionMapping[values.checkByNrmOption] || values.checkByNrmOption,
//       checkByNrmClock: formatTimeString(values.checkByNrmClock),

//       checkByOt: optionMapping[values.checkByOtOption] || values.checkByOtOption,
//       checkByOtClock: formatTimeString(values.checkByOtClock),

//       checkByLateness: optionMapping[values.checkByLatenessOption] || values.checkByLatenessOption,
//       checkByLatenessClock: formatTimeString(values.checkByLatenessClock),

//       checkByEarlyOut: optionMapping[values.checkByEarlyOutOption] || values.checkByEarlyOutOption,
//       checkByEarlyOutClock: formatTimeString(values.checkByEarlyOutClock),

//       checkByPhRes: optionMapping[values.checkByPhResOption] || values.checkByPhResOption,
//       checkByPhResClock: formatTimeString(values.checkByPhResClock),

//       // Days as "YES"/"NO"
//       checkByDayMonday: values.selectedDays?.includes("Monday") ? "YES" : "NO",
//       checkByDayTuesday: values.selectedDays?.includes("Tuesday") ? "YES" : "NO",
//       checkByDayWednesday: values.selectedDays?.includes("Wednesday") ? "YES" : "NO",
//       checkByDayThursday: values.selectedDays?.includes("Thursday") ? "YES" : "NO",
//       checkByDayFriday: values.selectedDays?.includes("Friday") ? "YES" : "NO",
//       checkByDaySaturday: values.selectedDays?.includes("Saturday") ? "YES" : "NO",
//       checkByDaySunday: values.selectedDays?.includes("Sunday") ? "YES" : "NO",

//       // Booleans and IDs
//       shiftPay: Boolean(values.payCheckbox),
//       shiftIds: selectedShifts.map(Number),

//       // leaveGroupPay: Boolean(values.payReason),
//       // leaveGroupIds: selectedReasons.map(Number),
//       leaveGroupPay: values.payReason,
//         leaveGroupIds: selectedReasons.map(Number),

//       // branchClockLocationPay: Boolean(values.payClock),
//       // branchIds: selectedClocks.map(Number)

//       branchClockLocationPay: Boolean(values.payClock),
//   branchIds: selectedClocks.map(Number)
//     };

//     console.log("Payload sent:", JSON.stringify(payload, null, 2));

//     const response = await fetch("http://localhost:8081/api/allowance-criteria/create-allowance", {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//       throw new Error('Failed to save allowance criteria');
//     }

//     toast.success('Allowance criteria saved successfully!');
//     resetForm();
//     setSelectedShifts([]);
//     setSelectedReasons([]);
//     setSelectedClocks([]);
//   } catch (error) {
//     console.error("Error saving allowance criteria:", error);
//     toast.error(error.message || 'Failed to save allowance criteria');
//   } finally {
//     setSubmitLoading(false);
//   }
// };




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
    return timeStr.length === 5 ? `${timeStr}:00` : timeStr; // if "HH:mm", add ":00"
  };

  try {
    const payload = {
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
      shiftIds: selectedShifts.map(Number),

      leaveGroupPay: values.payReason,
      leaveGroupIds: selectedReasons.map(Number),

      branchClockLocationPay: Boolean(values.payClock),
      branchIds: selectedClocks.map(Number)
    };

    console.log("Payload sent:", JSON.stringify(payload, null, 2));

    const response = await fetch(ADD_Allowance_DATA, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to save allowance criteria');
    }

    toast.success('Allowance criteria saved successfully!');
    resetForm();
navigate("/admin/allowance/viewAllowance")
    setSelectedShifts([]);
    setSelectedReasons([]);
    setSelectedClocks([]);
  } catch (error) {
    console.error("Error saving allowance criteria:", error);
    toast.error(error.message || 'Failed to save allowance criteria');
  } finally {
    setSubmitLoading(false);
  }
};




  const initialValues = {
    allowanceCode: '',
    allowanceName: '',
    allowanceAmount: '',
    checkBy: [],
    checkByTimeOption: '',
    checkByTimeInClock: '',
    checkByTimeOut: false,
    checkByTimeOutOption: '',
    checkByTimeOutClock: '',
    checkByActual: false,
    checkByActualOption: '',
    checkByActualClock: '',
    selectedDays: [],
    checkByNrmOption: '',
    checkByNrmClock: '',
    checkByOt: false,
    checkByOtOption: '',
    checkByOtClock: '',
    checkByLateness: false,
    checkByLatenessOption: '',
    checkByLatenessClock: '',
    checkByEarlyOut: false,
    checkByEarlyOutOption: '',
    checkByEarlyOutValue: '',
    payCheckbox: false,
    payReason: false,
    payClock: false
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
    // Add other validations as needed
  });

  const handleShiftSelect = (shiftId, isChecked) => {
  if (isChecked) {
    setSelectedShifts([...selectedShifts, shiftId]);
  } else {
    setSelectedShifts(selectedShifts.filter(id => id !== shiftId));
  }
};


    const handleReasonSelect = (reasonId, isChecked) => {
    if (isChecked) {
      setSelectedReasons([...selectedReasons, reasonId]);
    } else {
      setSelectedReasons(selectedReasons.filter(id => id !== reasonId));
    }
  };


  const handleClockSelect = (clockId, isChecked) => {
  if (isChecked) {
    setSelectedClocks([...selectedClocks, clockId]);
  } else {
    setSelectedClocks(selectedClocks.filter(id => id !== clockId));
  }
};

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (

    <div style={{ backgroundColor: "#eaf1f8", minHeight: "100vh", paddingTop: "0px", paddingBottom: "20px" }}>
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
                  <h2
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "20px",
                      color: "#091e42",
                      paddingLeft: "40px",
                      paddingTop: "30px",
                      marginRight: "8px",
                    }}
                  >
                    Allowance
                  </h2>

                    {/* Tooltip Wrapper */}
                    <div className="relative flex items-center justify-center w-4 h-4 mr-3" style={{ paddingTop: "30px"}}>
                                                                                <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
                                                                                <span
                                                              style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                width: "14px",
                                                                height: "14px",
                                                                borderRadius: "50%",
                                                                backgroundColor: "#fac863",
                                                                color: "white",
                                                                fontSize: "14px",
                                                                fontWeight: "bold",
                                                              }}
                                                            >
                                                              i
                                                            </span>

                                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-yellow-100 text-black text-sm px-4 py-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-normal text-left pointer-events-none">
                                                        <p className="mb-2">
                                                          This page lets you setup daily allowances and their eligible criteria.
                                                        </p>
                                                        <p className="mb-2">
                                                          Assignment of allowance(s) to staff can be done in <strong>Allowance Settings &gt; Staff Allowance</strong>.
                                                        </p>
                                                        <p>
                                                          Allowances can also be assigned to shift in <strong>Shift Settings &gt; Shift Master</strong>, 
                                                          which indirectly will also be assigned to the staff if the staff is working on that shift.
                                                        </p>
                                                      </div>

                                                                                </span>
                    </div>

                      <div className="w-full flex justify-end pr-10 pt-5">
                      <p
                        style={{
                          fontSize: "17px",
                          fontWeight: 500,
                          lineHeight: 1.43,
                          letterSpacing: "0.14px",
                          color: "#4B5563", // gray-600
                        }}
                      >
                        Allowance Setting <span style={{ color: "#9CA3AF" }}>&gt;</span>{" "}
                        <span style={{ color: "#111827" }}>Allowance</span>
                      </p>
                    </div>


                </div>
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
      <h1 className="-mt-[5px] mb-[12px] pb-[8px] text-[23px] font-bold border-b border-[#ababab] text-[#323232] ">
  Allowance Criteria
</h1>


        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                     placeholder=" ALLOWANCE CODE"
                    className="w-full p-2 border border-gray-300 rounded"
                     style={{
    fontSize: "14px",
    color: "#242424",
    fontWeight: 500,
    borderRadius: "6px",
    backgroundColor: "transparent",
    border: "1px solid #ced4da",
  }}
                    
                  />
                  <ErrorMessage name="allowanceCode" component="div" className="text-red-500 text-xs" />
                </div>

                <div>
                 <label className="block mb-[2px] text-[14px] font-bold text-gray-700">
                    Allowance Name<span className="text-red-600">*</span>
                  </label>
                  <Field
                    name="allowanceName"
                     placeholder="ALLOWANCE NAME "
                    className="w-full p-2 border border-gray-300 rounded"
                     style={{
    fontSize: "14px",
    color: "#242424",
    fontWeight: 500,
    borderRadius: "6px",
    backgroundColor: "transparent",
    border: "1px solid #ced4da",
  }}
                  />
                  <ErrorMessage name="allowanceName" component="div" className="text-red-500 text-xs" />
                </div>

                <div>
                 <label className="block mb-[2px] text-[14px] font-bold text-gray-700">
                    Allowance Amount<span className="text-red-600">*</span>
                  </label>
                  <Field
                    name="allowanceAmount"
                    placeholder="0.00 "
                    className="w-full p-2 border border-gray-300 rounded"
                    style={{
                       width: "131px",  
    fontSize: "14px",
    color: "#242424",
    fontWeight: 500,
    borderRadius: "6px",
    backgroundColor: "transparent",
    border: "1px solid #ced4da",
  }}
                  />
                  <ErrorMessage name="allowanceAmount" component="div" className="text-red-500 text-xs" />
                </div>
              </div>

              {/* Check By Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Check by Time In */}
                <div className="border border-gray-300 rounded p-4 shadow-sm ">
                <label className="inline-flex items-center mb-2 cursor-pointer">
  <input
    type="checkbox"
    name="checkBy"
    value="time"
    checked={values.checkBy.includes("time")}
    onChange={(e) => {
      const checked = e.target.checked;
      if (checked) {
        setFieldValue("checkBy", [...values.checkBy, "time"]);
      } else {
        setFieldValue(
          "checkBy",
          values.checkBy.filter((v) => v !== "time")
        );
        setFieldValue("checkByTimeOption", "");
        setFieldValue("checkByTimeInClock", "");
      }
    }}
    className="peer hidden"
  />
  {/* Custom checkbox box */}
  <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] after:border-r-[3px] after:border-b-[3px] after:border-[#337ab7] after:rotate-45 after:hidden
      peer-checked:after:block
    "
  ></span>
  <span className="text-md font-medium text-gray-700">Check by Time In</span>
</label>




                  <div className="mt-4 flex gap-4">
                <div className="w-1/2">
                      <Field
                        as="select"
                        name="checkByTimeOption"
                        disabled={!values.checkBy.includes("time")}
                        className={`w-full p-2 rounded-md border 
                          text-[14px] font-medium text-[#242424] 
                          overflow-hidden whitespace-nowrap text-ellipsis
                          ${values.checkBy.includes("time") 
                            ? "border-[#d8dae5] bg-white cursor-pointer"   // enabled
                            : "border-[#d8dae5] bg-[rgb(211_211_211/25%)] cursor-not-allowed" // disabled
                          }
                        `}
                      >
                        <option value="">Select Option</option>
                        <option value="=">=</option>
                        <option value="<=">&lt;=</option>
                        <option value=">=">&gt;=</option>
                      </Field>

                      <ErrorMessage
                        name="checkByTimeOption"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>



                    <div className="w-1/2">
                      {/* <label className="block text-sm text-gray-600 mb-1">Time</label> */}
                    
                      <Field
                                type="time"
                                name="checkByTimeInClock"
                                // className="w-full p-1 border border-gray-300 rounded "
                                className={`w-full p-1 border border-gray-300 rounded ${
                                  values.checkBy.includes('time')
                                    ? "cursor-default bg-white"
                                    : "cursor-not-allowed bg-[rgb(211_211_211/25%)]"
                                }`}

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
                        className="peer hidden"
                      />
                      {/* Custom checkbox box */}
<span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[2.5px] after:border-b-[2.5px] after:border-[#337ab7] 
      after:rotate-45 after:hidden peer-checked:after:block
    "
  ></span>
                      <span className="text-md font-medium text-gray-700">Check by Time Out</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                        {/* <label className="block text-sm text-gray-600 mb-1">Select Option</label> */}
                      <Field
                            as="select"
                            name="checkByTimeOutOption"
                            className={`w-full p-1 border border-gray-300 rounded h-8 ${
                              values.checkByTimeOut ? "bg-white cursor-pointer" : "bg-gray-100 cursor-not-allowed"
                            }`}
                            disabled={!values.checkByTimeOut}
                          >
                            <option value="" >Select Option</option>
                            <option value="=">=</option>
                            <option value="<=">&lt;=</option>
                            <option value=">=">&gt;=</option>
                          </Field>

                        <ErrorMessage name="checkByTimeOutOption" component="div" className="text-red-500 text-xs" />
                      </div>

                      <div className="w-1/2">
                        {/* <label className="block text-sm text-gray-600 mb-1">Time</label> */}
                        <Field
                          type="time"
                          name="checkByTimeOutClock"
                          // className="w-full p-1 border border-gray-300 rounded"
                           className={`w-full p-1 border border-gray-300 rounded ${
                              values.checkByTimeOut
                                ? "cursor-default bg-white"
                                : "cursor-not-allowed bg-gray-100"
                            }`}
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
                       className="peer hidden"
                      />
                      <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[2.5px] after:border-b-[2.5px] after:border-[#337ab7] 
      after:rotate-45 after:hidden peer-checked:after:block
    "
  ></span>
                      <span className="text-md font-medium text-gray-700">Check by Actual</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                        {/* <label className="block text-sm text-gray-600 mb-1">Select Option</label> */}
                        <Field
                          as="select"
                          name="checkByActualOption"
                          className={`w-full p-1 border border-gray-300 rounded h-8 ${
                              values.checkByActual ? "bg-white cursor-pointer" : "bg-gray-100 cursor-not-allowed"
                            }`}
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
                        {/* <label className="block text-sm text-gray-600 mb-1">Time</label> */}
                        <Field
                          type="time"
                          name="checkByActualClock"
                          // className="w-full p-1 border border-gray-300 rounded"
                           className={`w-full p-1 border border-gray-300 rounded ${
                                values.checkByActual
                                  ? "cursor-default bg-white"
                                  : "cursor-not-allowed bg-gray-100"
                              }`}
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
                     className="peer hidden"
                    />
                    <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[2.5px] after:border-b-[2.5px] after:border-[#337ab7] 
      after:rotate-45 after:hidden peer-checked:after:block
    "
  ></span>
                    <span className="text-md font-medium text-gray-700">Check by NRM</span>
                  </label>

                  <div className="mt-4 flex gap-4">
                    <div className="w-1/2">
                      {/* <label className="block text-sm text-gray-600 mb-1">Select Option</label> */}
                      <Field
                        as="select"
                        name="checkByNrmOption"
                        className={`w-full p-2 rounded-md border 
                          text-[14px] font-medium text-[#242424] 
                          overflow-hidden whitespace-nowrap text-ellipsis
                          ${values.checkBy.includes("nrm") 
                            ? "border-[#d8dae5] bg-white cursor-pointer"   // enabled
                            : "border-[#d8dae5] bg-[rgb(211_211_211/25%)] cursor-not-allowed" // disabled
                          }
                        `}
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
                      {/* <label className="block text-sm text-gray-600 mb-1">Time</label> */}
                      <Field
                        type="time"
                        name="checkByNrmClock"
                        // className="w-full p-1 border border-gray-300 rounded"
                         className={`w-full p-1 border border-gray-300 rounded ${
                              values.checkBy.includes('nrm')
                                ? "cursor-default bg-white"
                                : "cursor-not-allowed bg-gray-100"
                            }`}
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
                        className="peer hidden"
                      />
                      <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[2.5px] after:border-b-[2.5px] after:border-[#337ab7] 
      after:rotate-45 after:hidden peer-checked:after:block
    "
  ></span>
                      <span className="text-md font-medium text-gray-700">Check by OT</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                        {/* <label className="block text-sm text-gray-600 mb-1">Select Option</label> */}
                        <Field
                          as="select"
                          name="checkByOtOption"
                          className={`w-full p-1 border border-gray-300 rounded h-8 ${
                              values.checkByOt ? "bg-white cursor-pointer" : "bg-gray-100 cursor-not-allowed"
                            }`}
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
                        {/* <label className="block text-sm text-gray-600 mb-1">Time</label> */}
                        <Field
                          type="time"
                          name="checkByOtClock"
                          // className="w-full p-1 border border-gray-300 rounded"
                           className={`w-full p-1 border border-gray-300 rounded ${
                              values.checkByOt
                                ? "cursor-default bg-white"
                                : "cursor-not-allowed bg-gray-100"
                            }`}
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
                        className="peer hidden"
                      />

                      <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[2.5px] after:border-b-[2.5px] after:border-[#337ab7] 
      after:rotate-45 after:hidden peer-checked:after:block
    "
  ></span>
                      <span className="text-md font-medium text-gray-700">Check by Lateness</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                        {/* <label className="block text-sm text-gray-600 mb-1">Select Option</label> */}
                        <Field
                          as="select"
                          name="checkByLatenessOption"
                           className={`w-full p-1 border border-gray-300 rounded h-8 ${
                              values.checkByLateness ? "bg-white cursor-pointer" : "bg-gray-100 cursor-not-allowed"
                            }`}
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
                        {/* <label className="block text-sm text-gray-600 mb-1">Time</label> */}
                        <Field
                          type="time"
                          name="checkByLatenessClock"
                          // className="w-full p-1 border border-gray-300 rounded"
                           className={`w-full p-1 border border-gray-300 rounded ${
                              values.checkByLateness
                                ? "cursor-default bg-white"
                                : "cursor-not-allowed bg-gray-100"
                            }`}
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
                        className="peer hidden"
                      />

                      <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[2.5px] after:border-b-[2.5px] after:border-[#337ab7] 
      after:rotate-45 after:hidden peer-checked:after:block
    "
  ></span>
                      <span className="text-md font-medium text-gray-700">Check by Early Out</span>
                    </label>

                    <div className="mt-4 flex gap-4">
                      <div className="w-1/2">
                        {/* <label className="block text-sm text-gray-600 mb-1">Select Option</label> */}
                        <Field
                          as="select"
                          name="checkByEarlyOutOption"
                          className={`w-full p-1 border border-gray-300 rounded h-8 ${
                              values.checkByEarlyOut ? "bg-white cursor-pointer" : "bg-gray-100 cursor-not-allowed"
                            }`}
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
                        {/* <label className="block text-sm text-gray-600 mb-1">Time</label> */}
                        <Field
                          type="time"
                          name="checkByEarlyOutClock"
                          // className="w-full p-1 border border-gray-300 rounded"
                           className={`w-full p-1 border border-gray-300 rounded ${
                              values.checkByEarlyOutClock
                                ? "cursor-default bg-white"
                                : "cursor-not-allowed bg-gray-100"
                            }`}
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
                     className="peer hidden"
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

                    <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[2.5px] after:border-b-[2.5px] after:border-[#337ab7] 
      after:rotate-45 after:hidden peer-checked:after:block
    "
  ></span>
                    <span className="text-md font-medium text-gray-700">Check by Day</span>
                  </label>

                  <table className="w-full mt-4 border border-gray-300 text-left text-sm text-gray-700">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border-b">Day</th>
                        <th className="p-2 border-b text-center">Select</th>
                      </tr>
                    </thead>
                    {/* <tbody>
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
                    </tbody> */}
                    <tbody>
  {[
    'Days',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((day) => (
    <tr key={day} className="hover:bg-gray-50">
      <td className="p-2 border-b">{day}</td>
      <td className="p-2 border-b text-center">
        <label className="inline-flex items-center cursor-pointer justify-center">
          <input
            type="checkbox"
            checked={
              day === 'Days'
                ? [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ].every((d) => values.selectedDays.includes(d))
                : values.selectedDays.includes(day)
            }
            disabled={!values.checkBy.includes('day')}
            onChange={(e) => {
              if (!values.checkBy.includes('day')) return;

              if (day === 'Days') {
                if (e.target.checked) {
                  // Select all
                  setFieldValue('selectedDays', [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ]);
                } else {
                  // Deselect all
                  setFieldValue('selectedDays', []);
                }
              } else {
                if (e.target.checked) {
                  setFieldValue('selectedDays', [...values.selectedDays, day]);
                } else {
                  setFieldValue(
                    'selectedDays',
                    values.selectedDays.filter((d) => d !== day)
                  );
                }
              }
            }}
            className="peer hidden"
          />
          {/* Custom checkbox */}
         <span
  className={`
    w-5 h-5 flex items-center justify-center 
    border-2 border-gray-400 rounded-sm 
    ${!values.checkBy.includes('day') ? 'cursor-not-allowed bg-gray-100 border-[#cdd0dd]' : ''}
    peer-checked:border-[#337ab7]
    relative
    after:content-[''] after:w-[6px] after:h-[10px] 
    after:border-r-[3px] after:border-b-[3px] after:border-[#337ab7] 
    after:rotate-45 after:absolute 
    after:opacity-0 peer-checked:after:opacity-100
  `}
></span>

        </label>
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
                            className="peer hidden"
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
                            <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] after:border-r-[3px] after:border-b-[3px] after:border-[#337ab7] after:rotate-45 after:hidden
      peer-checked:after:block
    "
  ></span>
                          <span className="text-md font-medium text-gray-700">Check by Shift</span>
                        </div>

                        {/* Checkbox in front of Pay */}
                    <div className="flex items-center ml-11 ">
                      {/* Pay Checkbox */}
                      {/* <input
                        type="checkbox"
                        name="payCheckbox"
                        className="w-5 h-5"
                        disabled={!values.checkBy.includes('shift')}
                        checked={values.payCheckbox}
                        onChange={(e) => setFieldValue('payCheckbox', e.target.checked)}
                      />

                      
                      <span className="text-md font-semibold text-gray-700">Pay</span> */}


                      <label className="inline-flex items-center mb-2 cursor-pointer mt-1">
  <input
    type="checkbox"
    name="payCheckbox"
    disabled={!values.checkBy.includes("shift")}
    checked={values.payCheckbox}
    onChange={(e) => setFieldValue("payCheckbox", e.target.checked)}
    className="peer hidden"
  />

  {/* Custom checkbox box */}
  <span
    className={`
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 rounded-sm relative
      ${values.checkBy.includes("shift") ? "border-gray-400" : "border-gray-300 bg-gray-100 cursor-not-allowed"}
      peer-checked:border-[#337ab7]
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[3px] after:border-b-[3px] 
      after:border-[#337ab7] after:rotate-45 
      after:hidden peer-checked:after:block
    `}
  ></span>

<span
  className={`min-h-[20px] mb-0 font-medium cursor-pointer inline-block align-middle relative  indent-0 text-[14px] ${
    values.checkBy.includes("shift") ? "text-gray-700" : "text-gray-400"
  }`}
>
  Pay
</span>

</label>


                      {/* Tooltip Icon with hover-specific group */}
                      <div className="relative flex items-center justify-center w-4 h-4">
                      <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
                         <span
                                                              style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                width: "14px",
                                                                height: "14px",
                                                                borderRadius: "50%",
                                                                backgroundColor: "#fac863",
                                                                color: "white",
                                                                fontSize: "14px",
                                                                fontWeight: "bold",
                                                              }}
                                                            >
                                                              i
                                                            </span>
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

                            {/* Shift List Table */}
                                 <div className="mt-0 border p-3 rounded">
  {shiftList.length > 0 ? (
    <div className="max-h-64 overflow-y-auto overflow-x-auto border rounded">
      <table className="min-w-full text-sm border table-fixed">
        <thead className="bg-gray-100 sticky top-0">
          <tr className="text-left text-gray-700">
            <th className="p-2 border" style={{ width: "180px" }}>Code</th>
            <th className="p-2 border" style={{ width: "220px" }}>Name</th>
            <th className="p-2 border text-center" style={{ width: "80px" }}>Select</th>
          </tr>
        </thead>
        {/* <tbody className="divide-y">
          {shiftList.map((shift) => {
            const isChecked = selectedShifts.includes(shift.id);
            return (
              <tr key={shift.id} className="hover:bg-gray-50">
                <td className="p-2 border" style={{ width: "180px" }}>{shift.shiftCode}</td>
                <td className="p-2 border" style={{ width: "220px" }}>{shift.shiftName}</td>
                <td className="p-2 border text-center" style={{ width: "80px" }}>
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer"
                    disabled={!values.checkBy.includes("shift")}
                    checked={isChecked}
                    onChange={(e) => handleShiftSelect(shift.id, e.target.checked)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody> */}

        <tbody className="divide-y">
  {shiftList.map((shift) => {
    const isChecked = selectedShifts.includes(shift.id);
    return (
      <tr key={shift.id} className="hover:bg-gray-50">
        <td className="p-2 border" style={{ width: "180px" }}>
          {shift.shiftCode}
        </td>
        <td className="p-2 border" style={{ width: "220px" }}>
          {shift.shiftName}
        </td>
        <td className="p-2 border text-center" style={{ width: "80px" }}>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden"
              disabled={!values.checkBy.includes("shift")}
              checked={isChecked}
              onChange={(e) =>
                handleShiftSelect(shift.id, e.target.checked)
              }
            />
         <span
  className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
    isChecked
      ? "border-blue-500 text-blue-500"
      : "border-gray-400"
  } ${
    !values.checkBy.includes("shift")
      ? "bg-gray-100 cursor-not-allowed border-[#cdd0dd]"
      : ""
  }`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-3 h-3 font-bold transition-opacity duration-150 ${
      isChecked ? "opacity-100" : "opacity-0"
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
</span>

          </label>
        </td>
      </tr>
    );
  })}
</tbody>


      </table>
    </div>
  ) : (
    <div className="p-3 text-center text-gray-500 italic">
      No shift data available.
    </div>
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
                       className="peer hidden"
                      />

                           <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] after:border-r-[3px] after:border-b-[3px] after:border-[#337ab7] after:rotate-45 after:hidden
      peer-checked:after:block
    "
  ></span>
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
                       className="peer hidden"
                      />
                      {/* <span className="text-md font-semibold text-gray-700 mr-2">Pay</span> */}
 {/* Custom checkbox box */}
  <span
    className={`
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 rounded-sm relative
      ${values.checkBy.includes("reason") ? "border-gray-400" : "border-gray-300 bg-gray-100 cursor-not-allowed"}
      peer-checked:border-[#337ab7]
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[3px] after:border-b-[3px] 
      after:border-[#337ab7] after:rotate-45 
      after:hidden peer-checked:after:block
    `}
  ></span>

<span
  className={`min-h-[20px] mb-0 font-medium cursor-pointer inline-block align-middle relative  indent-0 text-[14px] ${
    values.checkBy.includes("reason") ? "text-gray-700" : "text-gray-400"
  }`}
>
  Pay
</span>

                       {/* Tooltip Icon with hover-specific group */}
                      <div className="relative flex items-center justify-center w-4 h-4">
                      <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
                       <span
                                                              style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                width: "14px",
                                                                height: "14px",
                                                                borderRadius: "50%",
                                                                backgroundColor: "#fac863",
                                                                color: "white",
                                                                fontSize: "14px",
                                                                fontWeight: "bold",
                                                              }}
                                                            >
                                                              i
                                                            </span>

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
    <div className="max-h-64 overflow-y-auto overflow-x-auto border rounded">
      <table className="min-w-full text-sm border border-gray-300 rounded">
        <thead className="bg-gray-100 sticky top-0">
          <tr className="text-left text-gray-700">
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border text-center">Select</th>
          </tr>
        </thead>
        {/* <tbody className="divide-y">
          {reasonList.map((reason) => {
            const isChecked = selectedReasons.includes(reason.id);
            return (
              <tr key={reason.id} className="hover:bg-gray-50">
                <td className="p-2 border">{reason.leaveGrpCode}</td>
                <td className="p-2 border">{reason.leaveGrpName}</td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer"
                    disabled={!values.checkBy.includes("reason")}
                    checked={isChecked}
                    onChange={(e) =>
                      handleReasonSelect(reason.id, e.target.checked)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody> */}


    <tbody className="divide-y">
  {reasonList.map((reason) => {
    const isChecked = selectedReasons.includes(reason.id);
    return (
      <tr key={reason.id} className="hover:bg-gray-50">
        <td className="p-2 border">{reason.leaveGrpCode}</td>
        <td className="p-2 border">{reason.leaveGrpName}</td>
        <td className="p-2 border text-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden"
              disabled={!values.checkBy.includes("reason")}
              checked={isChecked}
              onChange={(e) =>
                handleReasonSelect(reason.id, e.target.checked)
              }
            />
            <span
              className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                isChecked
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-400"
              } ${
                !values.checkBy.includes("reason")
                  ? "bg-gray-100 cursor-not-allowed border-[#cdd0dd]"
                  : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3 h-3 font-bold transition-opacity duration-150 ${
                  isChecked ? "opacity-100" : "opacity-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          </label>
        </td>
      </tr>
    );
  })}
</tbody>



      </table>
    </div>
  ) : (
    <div className="p-3 text-center text-gray-500 italic">
      No reason data available.
    </div>
  )}
</div>

                </div>



                     {/* Check by Clock Location */}
                      <div className="border border-gray-300 rounded p-4 shadow-sm ">
                            <div className="flex items-center mb-2">
                              {/* Check by Clock Location */}
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  name="checkBy"
                                  value="clock"
                                  className="peer hidden"
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
                                      setFieldValue("payClock", false); // clear Pay when unchecked
                                    }
                                  }}
                                />

                                   <span
    className="
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 border-gray-400 rounded-sm 
      peer-checked:border-[#337ab7]
      relative
      after:content-[''] after:w-[6px] after:h-[10px] after:border-r-[3px] after:border-b-[3px] after:border-[#337ab7] after:rotate-45 after:hidden
      peer-checked:after:block
    "
  ></span>
                                <span className="text-md font-medium text-gray-700">
                                  Check by Clock Location
                                </span>
                              </label>

                              {/* Pay checkbox + tooltip */}
                              <label className="inline-flex items-center ml-8">
                                <input
                                  type="checkbox"
                                  name="payClock"
                                  checked={values.payClock || false}
                                  disabled={!values.checkBy.includes("clock")}
                                  onChange={(e) => setFieldValue("payClock", e.target.checked)}
                                  className="peer hidden"
                                />
                                 {/* Custom checkbox box */}
  <span
    className={`
      w-5 h-5 mr-2 flex items-center justify-center 
      border-2 rounded-sm relative
      ${values.checkBy.includes("clock") ? "border-gray-400" : "border-gray-300 bg-gray-100 cursor-not-allowed"}
      peer-checked:border-[#337ab7]
      after:content-[''] after:w-[6px] after:h-[10px] 
      after:border-r-[3px] after:border-b-[3px] 
      after:border-[#337ab7] after:rotate-45 
      after:hidden peer-checked:after:block
    `}
  ></span>
                                <span
  className={`min-h-[20px] mb-0 font-medium cursor-pointer inline-block align-middle relative  indent-0 text-[14px] ${
    values.checkBy.includes("clock") ? "text-gray-700" : "text-gray-400"
  }`}
>
  Pay
</span>

                              
                                                {/* Tooltip Icon with hover-specific group */}
                                                              <div className="relative flex items-center justify-center w-4 h-4 mr-3">
                                                              <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
                                                               <span
                                                              style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                width: "14px",
                                                                height: "14px",
                                                                borderRadius: "50%",
                                                                backgroundColor: "#fac863",
                                                                color: "white",
                                                                fontSize: "14px",
                                                                fontWeight: "bold",
                                                              }}
                                                            >
                                                              i
                                                            </span>

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

                                                    {/* Clock List Table */}
                                                   {/* Check by Clock Location - Updated Table */}
                                                   <div className="mt-3 border p-3 rounded">
  {clockList.length > 0 ? (
    <div className="max-h-64 overflow-y-auto border rounded">
      <table className="min-w-full text-sm border border-gray-300 rounded">
        <thead className="bg-gray-100 sticky top-0">
          <tr className="text-left text-gray-700">
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border text-center">Select</th>
          </tr>
        </thead>
        {/* <tbody className="divide-y">
          {clockList.map((clock) => {
            const isChecked = selectedClocks.includes(clock.id);
            return (
              <tr key={clock.id} className="hover:bg-gray-50">
                <td className="p-2 border">{clock.branchCode}</td>
                <td className="p-2 border">{clock.branchName}</td>
                <td className="p-2 border text-center">
                  <label className="inline-flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer"
                      disabled={!values.checkBy.includes("clock")}
                      checked={isChecked}
                      onChange={(e) =>
                        handleClockSelect(clock.id, e.target.checked)
                      }
                    />
                  </label>
                </td>
              </tr>
            );
          })}
        </tbody> */}


      <tbody className="divide-y">
  {clockList.map((clock) => {
    const isChecked = selectedClocks.includes(clock.id);
    return (
      <tr key={clock.id} className="hover:bg-gray-50">
        <td className="p-2 border">{clock.branchCode}</td>
        <td className="p-2 border">{clock.branchName}</td>
        <td className="p-2 border text-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden"
              disabled={!values.checkBy.includes("clock")}
              checked={isChecked}
              onChange={(e) =>
                handleClockSelect(clock.id, e.target.checked)
              }
            />
            {/* Custom Checkbox */}
            <span
              className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                isChecked
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-400"
              } ${
                !values.checkBy.includes("clock")
                  ? "cursor-not-allowed bg-gray-100 border-[#cdd0dd]"
                  : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3 h-3 font-bold transition-opacity duration-150 ${
                  isChecked ? "opacity-100" : "opacity-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="5" // bolder tick
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          </label>
        </td>
      </tr>
    );
  })}
</tbody>


      </table>
    </div>
  ) : (
    <div className="p-3 text-center text-gray-500 italic">
      No clock location data available.
    </div>
  )}
</div>

{/* <div className="mt-3 border p-3 rounded">
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
          const isChecked = selectedClocks.includes(clock.id);
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
                  onChange={(e) => handleClockSelect(clock.id, e.target.checked)}
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
</div> */}
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
                  {submitLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
    </>
    </div>
  );
};

export default Allowance;