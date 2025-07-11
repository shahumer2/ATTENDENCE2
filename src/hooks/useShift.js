import { ADD_SHIFT_DATA } from "Constants/utils";
import { ADD_Shift_DATA } from "Constants/utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useShift = () => {

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
          inTime: '00:00:00:PM',
          outTime: '00:00:00',
          dayChange: '00:00:00',
          lunchOut: '',
          lunchIn: '',
          nrm: '',
          res: false,
          overTime: '',
          extra: false,
          eRate: '',
          maxHour: '',
          lunchLate: false,
          dinnerLate1: false,
          dinnerLate2: false,
          phHours: '',
          phMax: '',
          phExtra: '',
          otHour1: '',
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

    
    
    

    return { initialValues, handleSubmit }

}



export default useShift