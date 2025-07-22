import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Groups_LIST, GET_ShiftSearch_URL } from 'Constants/utils';
import useDutyRoaster from 'hooks/useDutyRoaster';
import { ADD_DutyROASTER_DATA } from 'Constants/utils';

const AddDutyRoaster = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const { initialValues } = useDutyRoaster()
  const [numberOfGroups, setNumberOfGroups] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupIds, setGroupIds] = useState([]);
  const [mainGroupId, setMainGroupId] = useState(null);
  const [subGroupIds, setSubGroupIds] = useState([]);




  const validationSchema = Yup.object().shape({
    DutyRoasterCode: Yup.string().required('Duty Roaster Code is required'),
    DutyRoasterName: Yup.string().required('Duty Roaster Name is required'),
    effectiveFrom: Yup.date().required('Effective From date is required'),
    groupId: Yup.string().required('Group is required'),
  });

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Initialize rosterAssignments with proper structure
  const initializeRosterAssignments = (groups, days) => {
    return Array(days).fill().map(() => {
      const dayObj = {};
      for (let i = 0; i < groups; i++) {
        dayObj[`group${i}`] = null;
      }
      return dayObj;
    });
  };



  // When number of groups changes, update the rosterAssignments structure
  React.useEffect(() => {
    if (numberOfGroups > 0) {
      initialValues.rosterAssignments = initializeRosterAssignments(numberOfGroups, 42);
    }
  }, [numberOfGroups]);

  const shouldShowSelect = (weekIndex, dayIndex) => {
    const totalDay = weekIndex * 7 + dayIndex;
    return totalDay < recurrenceDays;
  };

  const weekPairs = Array.from({ length: 3 }, (_, i) => [i * 2, i * 2 + 1]);

  // Query for groups
  const { data: groupOptions, isLoading: groupsLoading } = useQuery({
    queryKey: ['groupOptions'],
    queryFn: async () => {
      const response = await fetch(Groups_LIST, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch groups');
      return response.json();
    }
  });

  const groupSelectOptions = groupOptions?.map(group => ({
    value: group.id,
    values: group.numberOfGrps,
    originalData: group,
    label: group.numberOfGrps
      ? `${group.numberOfGrps} Group${group.numberOfGrps > 1 ? 's' : ''}`
      : 'Unnamed Group'
  })) || [];
  const getFixedGroupIds = (numberOfGroupsNeeded) => {
    // Find groups that match exactly the number of groups needed
    const matchingGroups = groupOptions
      ?.filter(group => group.numberOfGrps === numberOfGroupsNeeded)
      ?.slice(0, numberOfGroupsNeeded) || [];
    
    // If we don't have enough exact matches, supplement with other groups
    if (matchingGroups.length < numberOfGroupsNeeded) {
      const additionalGroupsNeeded = numberOfGroupsNeeded - matchingGroups.length;
      const otherGroups = groupOptions
        ?.filter(group => !matchingGroups.some(g => g.id === group.id))
        ?.slice(0, additionalGroupsNeeded) || [];
      
      return [...matchingGroups, ...otherGroups].map(group => group.id);
    }
    
    return matchingGroups.map(group => group.id);
  };




  console.log(groupOptions, "jamshed++++");
  // Query for shifts
  const { data: ShiftOptions, isLoading: ShiftLoading } = useQuery({
    queryKey: ['shiftOptions'],
    queryFn: async () => {
      const response = await fetch(GET_ShiftSearch_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch shifts');
      return response.json();
    }
  });

  console.log(ShiftOptions, "sameeeer");
  const shiftOptions = ShiftOptions?.map(shift => ({
    value: shift.id,
    label: `${shift.shiftName} | ${shift.shiftCode}`
  })) || [];



  const handleSubmit = async (values) => {
    try {
      const requestData = {
        dutyRoasterCode: values.DutyRoasterCode,
        dutyRoasterName: values.DutyRoasterName,
        effectiveFrom: values.effectiveFrom,
        recurrenceDays: values.recurrenceDays,
        groupInvolved: numberOfGroups,
        weeks: []
      };

      const numberOfWeeks = Math.ceil(values.recurrenceDays / 7);

      for (let weekIndex = 0; weekIndex < numberOfWeeks; weekIndex++) {
        const week = {
          weekName: `Week ${weekIndex + 1}`,
          groupShifts: []
        };

        const daysInThisWeek = weekIndex === numberOfWeeks - 1
          ? values.recurrenceDays % 7 || 7
          : 7;

        for (let dayIndex = 0; dayIndex < daysInThisWeek; dayIndex++) {
          const globalDayIndex = weekIndex * 7 + dayIndex;

          for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
            const groupKey = `group${groupIndex}`;
            const shiftId = values.rosterAssignments[globalDayIndex]?.[groupKey];

            if (shiftId && subGroupIds[groupIndex]) {
              week.groupShifts.push({
                groupsId: subGroupIds[groupIndex], // Use the fixed group ID
                shiftId: parseInt(shiftId),
                day: globalDayIndex + 1,
                // groupNumber: groupIndex + 1
              });
            }
          }
        }

        if (week.groupShifts.length > 0) {
          requestData.weeks.push(week);
        }
      }

      console.log('Final request data:', JSON.stringify(requestData, null, 2));
      toast.success('Data prepared successfully! Check console for the structure.');
       const response = await fetch(ADD_DutyROASTER_DATA, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Duty Roaster Added Successfully!');
        resetForm();
      } else {
        toast.error(data.message || 'Error While Adding Duty Roaster');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Duty Roaster</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            const handleGroupSelect = (option, setFieldValue) => {
              setSelectedGroup(option);
              setNumberOfGroups(option.values);
              setFieldValue('groupId', option.value);
              
              // Set fixed group IDs based on the number of groups
              const fixedGroupIds = getFixedGroupIds(option.value);
              setSubGroupIds(fixedGroupIds);
            };
            return (

              <Form>
                {/* Top Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duty Roaster Code</label>
                    <Field
                      name="DutyRoasterCode"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <ErrorMessage name="DutyRoasterCode" component="div" className="text-red-500 text-xs" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duty Roaster Name</label>
                    <Field
                      name="DutyRoasterName"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <ErrorMessage name="DutyRoasterName" component="div" className="text-red-500 text-xs" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Effective From</label>
                    <Field
                      type="date"
                      name="effectiveFrom"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <ErrorMessage name="effectiveFrom" component="div" className="text-red-500 text-xs" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                    <div>
           
              <ReactSelect
                name="groupId"
                value={selectedGroup}
                onChange={(option) => handleGroupSelect(option, setFieldValue)}
                options={groupSelectOptions}
                isLoading={groupsLoading}
                className="basic-select"
                classNamePrefix="select"
                placeholder={groupsLoading ? "Loading groups..." : "Select a group"}
              />
              <ErrorMessage name="groupId" component="div" className="text-red-500 text-xs" />
            </div>
                    <ErrorMessage name="groupId" component="div" className="text-red-500 text-xs" />
                  </div>
                </div>

                {/* Weeks Section - Two weeks per row */}
                <div className="space-y-6">
                  {weekPairs.map(([week1, week2]) => (
                    <div key={`week-pair-${week1}-${week2}`} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Week 1 */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                        <h2 className="text-lg font-semibold mb-4">Week {week1 + 1}</h2>

                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200">
                            <thead>
                              <tr>
                                <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left text-sm">Groups</th>
                                {daysOfWeek.map((day, dayIndex) => (
                                  <th
                                    key={`day-${dayIndex}`}
                                    className={`border border-gray-300 bg-gray-100 px-2 py-1 text-sm ${shouldShowSelect(week1, dayIndex) ? 'bg-blue-50' : ''
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
                                      className={`border border-gray-300 px-2 py-1 ${shouldShowSelect(week1, dayIndex) ? 'bg-blue-50' : 'bg-gray-50'
                                        }`}
                                    >
                                      {shouldShowSelect(week1, dayIndex) ? (
                                        <ReactSelect
                                          name={`week${week1}_group${groupIndex}_day${dayIndex}`}
                                          options={shiftOptions}
                                          onChange={(selectedOption) => {
                                            const totalDay = week1 * 7 + dayIndex;
                                            setFieldValue(
                                              `rosterAssignments[${totalDay}].group${groupIndex}`,
                                              selectedOption.value
                                            );
                                            console.log(selectedOption, "kkikikiki__");
                                          }}
                                          placeholder="Select"
                                          className="basic-select z-100 w-[120px]"
                                          classNamePrefix="select"
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

                      {/* Week 2 */}
                      {week2 < 6 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                          <h2 className="text-lg font-semibold mb-4">Week {week2 + 1}</h2>

                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                              <thead>
                                <tr>
                                  <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left text-sm">Groups</th>
                                  {daysOfWeek.map((day, dayIndex) => (
                                    <th
                                      key={`day-${dayIndex}`}
                                      className={`border border-gray-300 bg-gray-100 px-2 py-1 text-sm ${shouldShowSelect(week2, dayIndex) ? 'bg-blue-50' : ''
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
                                        className={`border border-gray-300 px-2 py-1 ${shouldShowSelect(week2, dayIndex) ? 'bg-blue-50' : 'bg-gray-50'
                                          }`}
                                      >
                                        {shouldShowSelect(week2, dayIndex) ? (
                                          <ReactSelect
                                            name={`week${week2}_group${groupIndex}_day${dayIndex}`}
                                            options={shiftOptions}
                                            onChange={(selectedOption) => {
                                              const totalDay = week2 * 7 + dayIndex;
                                              setFieldValue(
                                                `rosterAssignments[${totalDay}].group${groupIndex}`,
                                                selectedOption.value
                                              );
                                            }}
                                            placeholder="Select"
                                            className="basic-select w-[120px]"
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
            )
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddDutyRoaster;