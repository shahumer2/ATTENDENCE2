import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Groups_LIST, GET_ShiftSearch_URL, GET_DutyRoasterBYID_URL, UPDATE_DutyRoaster_URL } from 'Constants/utils';

const UpdateDutyRoaster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  
  const [numberOfGroups, setNumberOfGroups] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupIds, setGroupIds] = useState([]);
  const [mainGroupId, setMainGroupId] = useState(null);
  const [subGroupIds, setSubGroupIds] = useState([]);

  // Fetch DutyRoaster data
  const { 
    data: dutyRoasterData, 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['dutyRoaster', id],
    queryFn: async () => {
      const response = await fetch(`${GET_DutyRoasterBYID_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch duty roaster');
      return response.json();
    },
    enabled: !!id,
  });

  // Update DutyRoaster mutation
  const { mutate: updateDutyRoaster, isPending: isUpdating } = useMutation({
    mutationFn: async (updatedData) => {
      const response = await fetch(`${UPDATE_DutyRoaster_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error('Failed to update duty roaster');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dutyRoaster', id]);
      toast.success('Duty roaster updated successfully');
      navigate('/admin/DutyRoaster/view');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Initialize rosterAssignments with proper structure
  const initializeRosterAssignments = (groups, days, existingData = []) => {
    return Array(days).fill().map((_, dayIndex) => {
      const dayObj = {};
      for (let i = 0; i < groups; i++) {
        const groupKey = `group${i}`;
        // Find existing assignment for this day and group
        const existingAssignment = existingData.find(
          assignment => assignment.day === dayIndex + 1 && assignment.groupNumber === i + 1
        );
        dayObj[groupKey] = existingAssignment ? existingAssignment.shiftId : null;
      }
      return dayObj;
    });
  };

  // When data is loaded or number of groups changes, update the rosterAssignments structure
  useEffect(() => {
    if (dutyRoasterData) {
      setNumberOfGroups(dutyRoasterData.groupInvolved);
      setRecurrenceDays(dutyRoasterData.recurrenceDays);
      
      // Extract group IDs from the weeks data
      const allGroupIds = [];
      dutyRoasterData.weeks.forEach(week => {
        week.groupShifts.forEach(shift => {
          if (!allGroupIds.includes(shift.groupsId)) {
            allGroupIds.push(shift.groupsId);
          }
        });
      });
      setSubGroupIds(allGroupIds);
      
      // Find the main group (this might need adjustment based on your data structure)
      if (groupOptions) {
        const mainGroup = groupOptions.find(group => 
          group.numberOfGrps === dutyRoasterData.groupInvolved
        );
        if (mainGroup) {
          setSelectedGroup({
            value: mainGroup.id,
            values: mainGroup.numberOfGrps,
            label: mainGroup.numberOfGrps 
              ? `${mainGroup.numberOfGrps} Group${mainGroup.numberOfGrps > 1 ? 's' : ''}`
              : 'Unnamed Group'
          });
        }
      }
    }
  }, [dutyRoasterData, groupOptions]);

  const validationSchema = Yup.object().shape({
    DutyRoasterCode: Yup.string().required('Duty Roaster Code is required'),
    DutyRoasterName: Yup.string().required('Duty Roaster Name is required'),
    effectiveFrom: Yup.date().required('Effective From date is required'),
    groupId: Yup.string().required('Group is required'),
  });

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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

  const shiftOptions = ShiftOptions?.map(shift => ({
    value: shift.id,
    label: `${shift.shiftName} | ${shift.shiftCode}`
  })) || [];

  const getInitialValues = () => {
    if (!dutyRoasterData) {
      return {
        DutyRoasterCode: '',
        DutyRoasterName: '',
        effectiveFrom: '',
        recurrenceDays: 7,
        groupId: '',
        rosterAssignments: initializeRosterAssignments(1, 42)
      };
    }

    // Flatten all group shifts from all weeks
    const allGroupShifts = dutyRoasterData.weeks.flatMap(week => week.groupShifts);

    return {
      DutyRoasterCode: dutyRoasterData.dutyRoasterCode,
      DutyRoasterName: dutyRoasterData.dutyRoasterName,
      effectiveFrom: dutyRoasterData.effectiveFrom,
      recurrenceDays: dutyRoasterData.recurrenceDays,
      groupId: dutyRoasterData.groupId || '',
      rosterAssignments: initializeRosterAssignments(
        dutyRoasterData.groupInvolved,
        dutyRoasterData.recurrenceDays,
        allGroupShifts
      )
    };
  };

  const handleSubmit = (values) => {
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
                groupsId: subGroupIds[groupIndex],
                shiftId: parseInt(shiftId),
                day: globalDayIndex + 1,
                groupNumber: groupIndex + 1
              });
            }
          }
        }

        if (week.groupShifts.length > 0) {
          requestData.weeks.push(week);
        }
      }

      updateDutyRoaster(requestData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const handleGroupSelect = (option, setFieldValue) => {
    setSelectedGroup(option);
    setNumberOfGroups(option.values);
    setFieldValue('groupId', option.value);
    
    // For update, we might want to preserve existing group IDs if possible
    // Otherwise, we can create new ones as in the add component
    if (dutyRoasterData) {
      // Try to maintain existing group IDs
      const existingGroupIds = [];
      dutyRoasterData.weeks.forEach(week => {
        week.groupShifts.forEach(shift => {
          if (!existingGroupIds.includes(shift.groupsId)) {
            existingGroupIds.push(shift.groupsId);
          }
        });
      });
      
      if (existingGroupIds.length >= option.values) {
        setSubGroupIds(existingGroupIds.slice(0, option.values));
      } else {
        // Supplement with new groups if needed
        const additionalGroupsNeeded = option.values - existingGroupIds.length;
        const otherGroups = groupOptions
          ?.filter(group => !existingGroupIds.includes(group.id))
          ?.slice(0, additionalGroupsNeeded)
          ?.map(group => group.id) || [];
        setSubGroupIds([...existingGroupIds, ...otherGroups]);
      }
    } else {
      // Fallback to creating new group IDs
      const fixedGroupIds = groupOptions
        ?.filter(group => group.numberOfGrps === option.values)
        ?.slice(0, option.values)
        ?.map(group => group.id) || [];
      setSubGroupIds(fixedGroupIds);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading duty roaster data: {error.message}</div>;

  return (
    <div className="bg-white m-6 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Duty Roaster</h1>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
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
                                        value={shiftOptions.find(option => 
                                          option.value === values.rosterAssignments[week1 * 7 + dayIndex]?.[`group${groupIndex}`]
                                        )}
                                        options={shiftOptions}
                                        onChange={(selectedOption) => {
                                          const totalDay = week1 * 7 + dayIndex;
                                          setFieldValue(
                                            `rosterAssignments[${totalDay}].group${groupIndex}`,
                                            selectedOption?.value || null
                                          );
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
                                          value={shiftOptions.find(option => 
                                            option.value === values.rosterAssignments[week2 * 7 + dayIndex]?.[`group${groupIndex}`]
                                          )}
                                          options={shiftOptions}
                                          onChange={(selectedOption) => {
                                            const totalDay = week2 * 7 + dayIndex;
                                            setFieldValue(
                                              `rosterAssignments[${totalDay}].group${groupIndex}`,
                                              selectedOption?.value || null
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
                  onClick={() => navigate('/admin/DutyRoaster/view')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isUpdating ? 'Updating...' : 'Update Duty Roaster'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateDutyRoaster;