import { useQuery } from "@tanstack/react-query";

import { Branch_LIST } from "Constants/utils";
import { GET_BranchSearch_URL } from "Constants/utils";
import { GET_BranchBYID_URL } from "Constants/utils";
import { ADD_Branch_DATA } from "Constants/utils";


import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useBranch = (selectedShifts,id) => {

  console.log(selectedShifts,"from use ");




  const [BranchSearch, setBranchSearch] = useState([]);
  const [numberOfGroups, setNumberOfGroups] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState(null);

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
    BranchCode: '',
    BranchName: '',
    effectiveFrom: new Date().toISOString().split('T')[0],
    recurrenceDays: 0,
    groupId: '',
    rosterAssignments: initializeRosterAssignments(numberOfGroups, 42) // Max 6 weeks
  };

  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;




  //   console.log(values,"jj______");
  //   try {
  //     // Transform the form data into the required API format
  //     const requestData = {
  //       BranchCode: values.BranchCode,
  //       BranchName: values.BranchName,
  //       effectiveFrom: values.effectiveFrom,
  //       recurrenceDays: values.recurrenceDays,
  //       groupInvolved: numberOfGroups,
  //       weeks: []
  //     };

  //     // Calculate how many weeks we need based on recurrenceDays
  //     const numberOfWeeks = Math.ceil(values.recurrenceDays / 7);
      
  //     // Process each week
  //     for (let weekIndex = 0; weekIndex < numberOfWeeks; weekIndex++) {
  //       const week = {
  //         weekName: `Week ${weekIndex + 1}`,
  //         groupShifts: []
  //       };

  //       // Process each day in the week
  //       const daysInThisWeek = weekIndex === numberOfWeeks - 1 
  //         ? values.recurrenceDays % 7 || 7 // Handle last week
  //         : 7;

  //       for (let dayIndex = 0; dayIndex < daysInThisWeek; dayIndex++) {
  //         const globalDayIndex = weekIndex * 7 + dayIndex;
          
  //         // Process each group for this day
  //         for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
  //           const groupKey = `group${groupIndex}`;
  //           const shiftId = values.rosterAssignments?.[globalDayIndex]?.[groupKey];
            
  //           if (shiftId) {
  //             week.groupShifts.push({
  //               groupsId: selectedGroup.value, // Use the selected group ID
  //               shiftId: parseInt(shiftId),
  //               day: globalDayIndex + 1 // Days are 1-based
  //             });
  //           }
  //         }
  //       }

  //       if (week.groupShifts.length > 0) {
  //         requestData.weeks.push(week);
  //       }
  //     }

  //     console.log('Final request data:', JSON.stringify(requestData, null, 2));

  //     // const response = await fetch(ADD_Branch_DATA, {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Authorization': `Bearer ${token}`,
  //     //     'Content-Type': 'application/json'
  //     //   },
  //     //   body: JSON.stringify(requestData)
  //     // });

  //     // const data = await response.json();

  //     // if (response.ok) {
  //     //   toast.success('Duty Roaster Added Successfully!');
  //     //   resetForm();
  //     // } else {
  //     //   toast.error(data.message || 'Error While Adding Duty Roaster');
  //     // }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     toast.error('An error occurred. Please try again later.');
  //   }
  // };

  const handleSubmit = async (values) => {
    try {
      const requestData = {
        branchCode: values.BranchCode,
        branchName: values.BranchName,
        shiftIds:[...selectedShifts]
      };
      
      console.log(requestData,"branch");
     

 

 const response = await fetch(ADD_Branch_DATA, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Branch Added Successfully!');
      
      } else {
        toast.error(data.message || 'Error While Adding Branch');
      }
      
    
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };





  const getBranchById = async (page) => {
    try {
      const response = await fetch(`${GET_BranchBYID_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data, "asd");
      setBranchSearch(data.content);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Voucher");
    }
  };


  const getBranchSearch = async (page) => {
    try {
      const response = await fetch(`${GET_BranchSearch_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data, "asd");
      setBranchSearch(data.content);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Voucher");
    }
  };






  return { 
    initialValues, 
    handleSubmit,
    getBranchSearch, 
    BranchSearch, 
    getBranchById,
    setSelectedGroup,
    setNumberOfGroups,
    setRecurrenceDays
  };


}

export const useBranchSearch = (token, page = 1, searchTerm = '') => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const debouncer = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    debouncer();
    return () => debouncer.cancel();
  }, [searchTerm]);

  const fetchBranchs = async () => {
    // If no search term, do a simple GET request for all Branchs
    if (!debouncedSearchTerm) {
      const response = await fetch(`${Branch_LIST}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch Branchs');
      return response.json();
    }

    // If search term exists, do a POST request with search parameters
    const response = await fetch(Branch_LIST, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: page - 1,
        size: 10,
        BranchCode: debouncedSearchTerm,
        BranchName: debouncedSearchTerm
      })
    });

    if (!response.ok) throw new Error('Failed to search Branchs');
    return response.json();
  };

  return useQuery({
    queryKey: ['Branchs', page, debouncedSearchTerm],
    queryFn: fetchBranchs,
    enabled: !!token, // Always enabled if token exists
    keepPreviousData: true,
  });
};



export default useBranch