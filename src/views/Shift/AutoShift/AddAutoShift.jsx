import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import useAutoShift from 'hooks/useAutoShift';

const AddAutoShift = () => {
  const {  initialValues,handleSubmit } = useAutoShift();
  
  const [numberOfGroups, setNumberOfGroups] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState(1);
  
  const validationSchema = Yup.object().shape({
    AutoShiftCode: Yup.string().required('Duty Roaster Code is required'),
    AutoShiftName: Yup.string().required('Duty Roaster Name is required'),
    lateGracePeriod: Yup.number().required('Grace Period is required'),
    lateAfterPeriod: Yup.number().required('After Every is required'),
    latenessDeduct: Yup.number().required('Deduct is required'),
  });

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const rosterOptions = [
    { value: 'Rostering1', label: 'Rostering 1' },
    { value: 'Rostering2', label: 'Rostering 2' },
    { value: 'Rostering3', label: 'Rostering 3' },
    { value: 'Rostering4', label: 'Rostering 4' },
    { value: 'Rostering5', label: 'Rostering 5' },
  ];

  // Calculate which days should have select boxes based on recurrenceDays
  const shouldShowSelect = (weekIndex, dayIndex) => {
    const totalDay = weekIndex * 7 + dayIndex;
    return totalDay < recurrenceDays;
  };

  // Group weeks into pairs for two-column layout
  const weekPairs = Array.from({ length: 3 }, (_, i) => [i * 2, i * 2 + 1]);

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Duty Roaster</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Top Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duty Roaster Code</label>
                  <Field 
                    name="AutoShiftCode" 
                    className="w-full p-2 border border-gray-300 rounded" 
                  />
                  <ErrorMessage name="AutoShiftCode" component="div" className="text-red-500 text-xs" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duty Roaster Name</label>
                  <Field 
                    name="AutoShiftName" 
                    className="w-full p-2 border border-gray-300 rounded" 
                  />
                  <ErrorMessage name="AutoShiftName" component="div" className="text-red-500 text-xs" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence Days</label>
                  <ReactSelect
                    value={{ value: recurrenceDays, label: `${recurrenceDays} Days` }}
                    onChange={(option) => {
                      setRecurrenceDays(option.value);
                      setFieldValue('recurrenceDays', option.value);
                    }}
                    options={Array.from({ length: 42 }, (_, i) => i + 1).map(day => ({ 
                      value: day, 
                      label: `${day} Day${day > 1 ? 's' : ''}` 
                    }))}
                    className="basic-select"
                    classNamePrefix="select"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Groups</label>
                  <ReactSelect
                    value={{ value: numberOfGroups, label: `${numberOfGroups} Group${numberOfGroups > 1 ? 's' : ''}` }}
                    onChange={(option) => setNumberOfGroups(option.value)}
                    options={[1, 2, 3, 4, 5, 6].map(group => ({ 
                      value: group, 
                      label: `${group} Group${group > 1 ? 's' : ''}` 
                    }))}
                    className="basic-select"
                    classNamePrefix="select"
                  />
                </div>
                
              </div>

              {/* Weeks Section - Two weeks per row */}
              <div className="space-y-6">
                {weekPairs.map(([week1, week2]) => (
                  <div key={`week-pair-${week1}-${week2}`} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Week 1 */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h2 className="text-lg font-semibold mb-4">Week {week1 + 1}</h2>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                          <thead>
                            <tr>
                              <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left text-sm">Groups</th>
                              {daysOfWeek.map((day, dayIndex) => (
                                <th 
                                  key={`day-${dayIndex}`} 
                                  className={`border border-gray-300 bg-gray-100 px-2 py-1 text-sm ${
                                    shouldShowSelect(week1, dayIndex) ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  {day}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from({ length: numberOfGroups }, (_, groupIndex) => (
                              <tr key={`group-${groupIndex}`}>
                                <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-medium text-sm">
                                  Group {groupIndex + 1}
                                </td>
                                {daysOfWeek.map((_, dayIndex) => (
                                  <td 
                                    key={`cell-${dayIndex}`}
                                    className={`border border-gray-300 px-2 py-1 ${
                                      shouldShowSelect(week1, dayIndex) ? 'bg-blue-50' : 'bg-gray-50'
                                    }`}
                                  >
                                    {shouldShowSelect(week1, dayIndex) ? (
                                      <ReactSelect
                                        name={`week${week1}_group${groupIndex}_day${dayIndex}`}
                                        options={rosterOptions}
                                        onChange={(selectedOption) => {
                                          const totalDay = week1 * 7 + dayIndex;
                                          setFieldValue(
                                            `rosterAssignments[${totalDay}].group${groupIndex}`,
                                            selectedOption.value
                                          );
                                        }}
                                        placeholder="Select"
                                        className="basic-select z-100"
                                        classNamePrefix="select"
                                        menuPosition="fixed"
                                        // menuPlacement="auto"
                                      />
                                    ) : (
                                      <span className="text-gray-400 text-sm">-</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Week 2 */}
                    {week2 < 6 && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-4">Week {week2 + 1}</h2>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200">
                            <thead>
                              <tr>
                                <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left text-sm">Groups</th>
                                {daysOfWeek.map((day, dayIndex) => (
                                  <th 
                                    key={`day-${dayIndex}`} 
                                    className={`border border-gray-300 bg-gray-100 px-2 py-1 text-sm ${
                                      shouldShowSelect(week2, dayIndex) ? 'bg-blue-50' : ''
                                    }`}
                                  >
                                    {day}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({ length: numberOfGroups }, (_, groupIndex) => (
                                <tr key={`group-${groupIndex}`}>
                                  <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-medium text-sm">
                                    Group {groupIndex + 1}
                                  </td>
                                  {daysOfWeek.map((_, dayIndex) => (
                                    <td 
                                      key={`cell-${dayIndex}`}
                                      className={`border border-gray-300 px-2 py-1 ${
                                        shouldShowSelect(week2, dayIndex) ? 'bg-blue-50' : 'bg-gray-50'
                                      }`}
                                    >
                                      {shouldShowSelect(week2, dayIndex) ? (
                                        <ReactSelect
                                          name={`week${week2}_group${groupIndex}_day${dayIndex}`}
                                          options={rosterOptions}
                                          onChange={(selectedOption) => {
                                            const totalDay = week2 * 7 + dayIndex;
                                            setFieldValue(
                                              `rosterAssignments[${totalDay}].group${groupIndex}`,
                                              selectedOption.value
                                            );
                                          }}
                                          placeholder="Select"
                                          className="basic-select"
                                          classNamePrefix="select"
                                          menuPlacement="auto"
                                          menuPosition="fixed"
                                        />
                                      ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Form Fields */}
              

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  type="button" 
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Duty Roaster
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddAutoShift;