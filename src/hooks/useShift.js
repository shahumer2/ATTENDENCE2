import { useQuery } from "@tanstack/react-query";
import { ADD_SHIFT_DATA } from "Constants/utils";
import { Shift_LIST } from "Constants/utils";
import { GET_ShiftSearch_URL } from "Constants/utils";
import { GET_SHIFTBYID_URL } from "Constants/utils";
import { ADD_Shift_DATA } from "Constants/utils";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useShift = (id) => {

  
    const [shiftSearch, setshiftSearch] = useState([])
    

    const initialValues = {
      isActive:"",
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

    const { currentUser } = useSelector((state) => state.user);
    const token = currentUser?.token;
    const daysOfWeek = ['SUNDAY','MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const handleSubmit = async (values) => {
        console.log(values, "Form values");
        
        try {
            const requestData = {
                ...values,
                shiftSchedulers: values.shiftSchedulers.map((scheduler, index) => ({
                    ...scheduler,
                    weekDay: daysOfWeek[index]
                }))
            }; // Added missing closing brace
    
            const response = await fetch(ADD_SHIFT_DATA, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Add content type for JSON
                },
                body: JSON.stringify(requestData) // Stringify the data
            });
    
            const data = await response.json();
            console.log(data, "Response data");
    
            if (response.ok) {
                toast.success('Shift Added Successfully!');
            } else {
                toast.error(data.message || 'Error While Adding Shift');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };

      

    const getShiftById = async (page) => {
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
          setshiftSearch(data.content);
      
      } catch (error) {
          console.error(error);
          toast.error("Failed to fetch Voucher");
      }
  };
   

    const getShiftSearch = async (page) => {
        try {
            const response = await fetch(`${GET_ShiftSearch_URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data, "asd");
            setshiftSearch(data.content);
        
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Voucher");
        }
    };

    
    
    

    return { initialValues, handleSubmit,getShiftSearch,shiftSearch }

}

export const useShiftSearch = (token, page = 1, searchTerm = '') => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
    // Debounce search term
    useEffect(() => {
      const debouncer = debounce(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 300);
      debouncer();
      return () => debouncer.cancel();
    }, [searchTerm]);
  
    const fetchShifts = async () => {
      // If no search term, do a simple GET request for all shifts
      if (!debouncedSearchTerm) {
        const response = await fetch(`${Shift_LIST}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch shifts');
        return response.json();
      }
      
      // If search term exists, do a POST request with search parameters
      const response = await fetch(Shift_LIST, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page: page - 1,
          size: 10,
          shiftCode: debouncedSearchTerm,
          shiftName: debouncedSearchTerm
        })
      });
  
      if (!response.ok) throw new Error('Failed to search shifts');
      return response.json();
    };
  
    return useQuery({
      queryKey: ['shifts', page, debouncedSearchTerm],
      queryFn: fetchShifts,
      enabled: !!token, // Always enabled if token exists
      keepPreviousData: true,
    });
  };



export default useShift