import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient }  from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GET_SHIFTBYID_URL } from 'Constants/utils';
import { UPDATE_SHIFT_URL } from 'Constants/utils';
import { useSelector } from 'react-redux';

// API endpoints




// Fetch shift by ID
// const fetchShiftById = async (id) => {
//   const { data } = await axios.get(`${GET_SHIFTBYID_URL}/${id}`);
//   return data;
// };


// Update shift
const updateShift = async ({ id, shiftData }) => {
  const { data } = await axios.put(`${UPDATE_SHIFT_URL}/${id}`, shiftData);
  return data;
};

const UpdateShift = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state) => state.user);
const token = currentUser?.token;
const fetchShiftById = async (id) => {
    try {
        const response = await fetch(`${GET_SHIFTBYID_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log(data, "asd");
        return data
    
    } catch (error) {
        console.error(error);
        toast.error("Failed to fetch Voucher");
    }
};

  // Fetch shift data
  const { 
    data: shiftData, 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['shift', id],
    queryFn: () => fetchShiftById(id),
    enabled: !!id,
  });

  // Mutation for updating shift
  const { mutate: updateShiftMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift', id] });
      navigate('/shifts');
    },
    onError: (error) => {
      console.error('Error updating shift:', error);
      // Add error notification here if needed
    },
  });

  // Days of the week
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  // Validation schema
  const validationSchema = Yup.object().shape({
    shiftCode: Yup.string().required('Shift Code is required'),
    shiftName: Yup.string().required('Shift Name is required'),
    lateGracePeriod: Yup.number().required('Grace Period is required'),
    lateAfterPeriod: Yup.number().required('After Every is required'),
    latenessDeduct: Yup.number().required('Deduct is required')
  });

  // Handle form submission
  const handleSubmit = (values) => {
    // Prepare the data for API
    const requestData = {
      ...values,
      // Add any additional transformations if needed
    };
    
    updateShiftMutation({ id, shiftData: requestData });
  };

  // Initial form values
  const initialValues = {
    shiftCode: '',
    shiftName: '',
    lateGracePeriod: '',
    lateAfterPeriod: '',
    latenessDeduct: '',
    excludeGracePeriod: false,
    latenessOffsetOT: false,
    earlyOutGracePeriod: '',
    earlyOutAfterEvery: '',
    earlyOutDeduct: '',
    overTimeRound: 'NEAREST',
    overTimeRoundValue: '',
    overTimeMinOT: '',
    earlyOverTimeRound: 'NEAREST',
    earlyOverTimeRoundValue: '',
    earlyOverTimeMinOT: '',
    lunchLateTwoThree: false,
    lunchLateFourFive: false,
    lunchLateSixSeven: false,
    dinnerOneLateTwoThree: false,
    dinnerOneLateFourFive: false,
    dinnerOneLateSixSeven: false,
    dinnerTwoLateTwoThree: false,
    dinnerTwoLateFourFive: false,
    dinnerTwoLateSixSeven: false,
    isActive: true,
    halfDaySetting: [],
    dayChangeOnSameDay: true,
    offsetPH: false,
    shiftSchedulers: Array(7).fill().map(() => ({
      weekDay: '',
      inTime: '08:00',
      outTime: '17:00:00',
      dayChange: '04:00',
      lunchOut: '12:00',
      lunchIn: '13:00',
      nrm: '08:00',
      res: false,
      overTime: 0.0,
      extra: false,
      eRate: 0,
      maxHour: '00:00',
      lunchLate: false,
      dinnerLate1: false,
      dinnerLate2: false,
      phHours: 2.0,
      phMax: '00:00',
      phExtra: 0,
      otHour1: "00:00:00",
      otHour2: '',
      otHour3: '',
      otDeduct1: '',
      otDeduct2: '',
      otDeduct3: '',
      break1Out: '',
      break1In: '',
      break2Out: '',
      break2In: '',
      break3Out: null,
      break3In: null,
      showOff: false
    }))
  };

  // Set initial values when data is loaded
  useEffect(() => {
    if (shiftData) {
      // Transform the API data to match the form structure if needed
      const transformedData = {
        ...shiftData,
        // Add any transformations here
      };
      
      // You would use Formik's setValues here if needed
      // But since we're using Formik's initialValues, we need to handle this differently
      // In a real implementation, you might need to restructure this
    }
  }, [shiftData]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading shift data</div>;

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Update Shift</h1>
        </div>

        <Formik
          initialValues={shiftData || initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className='flex flex-row gap-2 flex-2 mb-3'>
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
                  <div className="bg-blue-300 text-white p-4">
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
                          className="h-4 w-4 text-blue-300 focus:ring-blue-500 border-gray-300 rounded"
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
                  <div className="bg-blue-300 text-white p-4">
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
                  <div className="bg-blue-300 text-white p-4">
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
                  <div className="bg-blue-300 text-white p-4">
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
                  <div className="bg-blue-300 text-white p-4">
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
                              Clk 2 & 3
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
                              Clk 4 & 5
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
                              Clk 6 & 7
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dinner 1 Late</label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="dinnerOneLateTwoThree"
                              id="dinnerOneLateTwoThree"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="dinnerOneLateTwoThree" className="ml-2 block text-sm text-gray-700">
                              Clk 2 & 3
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
                              Clk 4 & 5
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
                              Clk 6 & 7
                            </label>
                          </div>

                          <label className="block text-sm font-medium text-gray-700 mb-1">Dinner 2 Late</label>
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="dinnerTwoLateTwoThree"
                              id="dinnerTwoLateTwoThree"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="dinnerTwoLateTwoThree" className="ml-2 block text-sm text-gray-700">
                              Clk 2 & 3
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
                              Clk 4 & 5
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
                              Clk 6 & 7
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Half Day Settings Section */}
                <div className="w-[180px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
                  <div className="bg-blue-300 text-white p-4">
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

              {/* Shift Schedule Table */}
              <div className="mt-8 overflow-scroll overflow-y-scroll">
                <h2 className="text-xl font-bold mb-4">Shift Schedule</h2>
                <table className="min-w-full overflow-y-scroll  bg-white border border-gray-200">
                  <thead>
                    <tr className='bg-blue-100'>
                      {['Day', 'Time In', 'Time Out', 'Day Change', 'Lunch Out', 'Lunch In', 'NRM', 'RES', 'OT', 'Extra', 'E. Rate', 'Max Hr.', 'Lunch Late'].map((heading, index) => (
                        <th key={index} className="border px-4 py-2 text-left">{heading}</th>
                      ))}

                      <th className="border px-4 py-2 text-left" colSpan={2}>Dinner</th>
                      <th className="border px-4 py-2 text-left" >PH</th>
                      <th className="border px-4 py-2 text-left" >PH Max</th>
                      <th className="border px-4 py-2 text-left">PH Ext</th>
                      <th className="border px-4 py-2 text-left" colSpan={6}>Over Time Deductions</th>
                      <th className="border px-4 py-2 text-left" colSpan={6}>Breaks</th>
                      <th className="border px-9 py-2 text-left ">Show Off</th>
                    </tr>
                    <tr>
                      {Array(13).fill().map((_, index) => (
                        <th key={`empty-${index}`} className="border px-4 py-2 text-left  bg-gray-100"></th>
                      ))}
                      <th className="border px-4 w-[300px] py-2 text-left bg-gray-100 whitespace-nowrap">Late 1</th>
                      <th className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">Late 2</th>
                      <th className="border px-4 py-2 text-left bg-gray-100"></th>
                      <th className="border px-4 py-2 text-left bg-gray-100"></th>
                      <th className="border px-4 py-2 text-left bg-gray-100"></th>

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
                      <tr key={index} className='bg-gray-50 overflow-scroll'>
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
                        <td className="border px-4 py-2 bg-purple-100">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].dayChange`}
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
                            className="px-2 w-[80px] mx-1 border border-gray-300 rounded"
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
                            className="px-2 w-[80px] mx-1 p-1 border border-gray-300 rounded"
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

                        <td className="border px-5 py-2 w-9">
                          <Field
                            type="number"
                            name={`shiftSchedulers[${index}].phHours`}
                            className=" px-2 w-[80px] mx-1 border border-gray-300 rounded"
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
                            className="px-2 w-[80px] mx-1  border border-gray-300 rounded"
                          />
                        </td>

                        <td className="border px-4 py-2 bg-red-100">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otHour1`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2 bg-red-100">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otDeduct1`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2 bg-red-100">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otHour2`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2 bg-red-100">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otDeduct2`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2 bg-red-100">
                          <Field
                            type="time"
                            name={`shiftSchedulers[${index}].otHour3`}
                            className="w-full p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border px-4 py-2 bg-red-100">
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
                  onClick={() => navigate('/shifts')}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out shadow-sm mr-4 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition duration-150 ease-in-out shadow-md font-medium disabled:bg-green-400"
                >
                  {isUpdating ? 'Updating...' : 'Update Shift'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateShift;