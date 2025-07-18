import { useQuery } from "@tanstack/react-query";

import { DutyRoaster_LIST } from "Constants/utils";
import { GET_DutyRoasterSearch_URL } from "Constants/utils";
import { GET_DutyROASTERBYID_URL } from "Constants/utils";
import { ADD_DutyROASTER_DATA } from "Constants/utils";


import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useDutyRoaster = (id) => {


  const [DutyRoasterSearch, setDutyRoasterSearch] = useState([])
  const [numberOfGroups, setNumberOfGroups] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState(1);
  const initializeRosterAssignments = () => {
    const assignments = [];
    for (let i = 0; i < recurrenceDays; i++) {
      const dayAssignment = {};
      for (let j = 0; j < numberOfGroups; j++) {
        dayAssignment[`group${j}`] = ''; // Initialize with empty values
      }
      assignments.push(dayAssignment);
    }
    return assignments;
  };

  const initialValues = {
    DutyRoasterCode: '',
    DutyRoasterName: '',
    effectiveFrom: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    recurrenceDays: 7, // Default to weekly
    groupInvolved: 1,
    rosterAssignments: initializeRosterAssignments(),
    weeks: []
  };

  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  const handleSubmit = async (values, { resetForm }, selectedGroup) => {
    try {
      // Transform the form data into the required API format
      const requestData = {
        dutyRoasterCode: values.DutyRoasterCode,
        dutyRoasterName: values.DutyRoasterName,
        effectiveFrom: values.effectiveFrom,
        recurrenceDays: values.recurrenceDays,
        groupInvolved: numberOfGroups, // Use the state value
        weeks: []
      };
  
      // Calculate how many weeks we need based on recurrenceDays
      const numberOfWeeks = Math.ceil(values.recurrenceDays / 7);
      
      // Process each week
      for (let weekIndex = 0; weekIndex < numberOfWeeks; weekIndex++) {
        const week = {
          weekName: `Week ${weekIndex + 1}`,
          groupShifts: []
        };
  
        // Process each day in the week
        const daysInThisWeek = weekIndex === numberOfWeeks - 1 
          ? values.recurrenceDays % 7 || 7 // Handle last week
          : 7;
  
        for (let dayIndex = 0; dayIndex < daysInThisWeek; dayIndex++) {
          const globalDayIndex = weekIndex * 7 + dayIndex;
          
          // Process each group for this day
          for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
            const groupKey = `group${groupIndex}`;
            const shiftId = values.rosterAssignments?.[globalDayIndex]?.[groupKey];
            
            if (shiftId) {
              week.groupShifts.push({
                groupsId: parseInt(selectedGroup.value), // Use the selected group ID
                shiftId: parseInt(shiftId),
                day: globalDayIndex + 1 // Days are 1-based
              });
            }
          }
        }
  
        if (week.groupShifts.length > 0) {
          requestData.weeks.push(week);
        }
      }
  
      console.log('Final request data:', requestData);
  
      // const response = await fetch(ADD_DutyROASTER_DATA, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(requestData)
      // });
  
      // const data = await response.json();
  
      // if (response.ok) {
      //   toast.success('Duty Roaster Added Successfully!');
      //   resetForm();
      // } else {
      //   toast.error(data.message || 'Error While Adding Duty Roaster');
      // }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };



  const getDutyRoasterById = async (page) => {
    try {
      const response = await fetch(`${GET_DutyROASTERBYID_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data, "asd");
      setDutyRoasterSearch(data.content);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Voucher");
    }
  };


  const getDutyRoasterSearch = async (page) => {
    try {
      const response = await fetch(`${GET_DutyRoasterSearch_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data, "asd");
      setDutyRoasterSearch(data.content);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Voucher");
    }
  };





  return { 
    initialValues, 
    handleSubmit: (values, formikHelpers) => handleSubmit(values, formikHelpers, selectedGroup),
    getDutyRoasterSearch, 
    DutyRoasterSearch, 
    getDutyRoasterById 
  }

}

export const useDutyRoasterSearch = (token, page = 1, searchTerm = '') => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const debouncer = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    debouncer();
    return () => debouncer.cancel();
  }, [searchTerm]);

  const fetchDutyRoasters = async () => {
    // If no search term, do a simple GET request for all DutyRoasters
    if (!debouncedSearchTerm) {
      const response = await fetch(`${DutyRoaster_LIST}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch DutyRoasters');
      return response.json();
    }

    // If search term exists, do a POST request with search parameters
    const response = await fetch(DutyRoaster_LIST, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: page - 1,
        size: 10,
        DutyRoasterCode: debouncedSearchTerm,
        DutyRoasterName: debouncedSearchTerm
      })
    });

    if (!response.ok) throw new Error('Failed to search DutyRoasters');
    return response.json();
  };

  return useQuery({
    queryKey: ['DutyRoasters', page, debouncedSearchTerm],
    queryFn: fetchDutyRoasters,
    enabled: !!token, // Always enabled if token exists
    keepPreviousData: true,
  });
};



export default useDutyRoaster