import { useQuery } from "@tanstack/react-query";
import { Race_LIST } from "Constants/utils";
import { Nationality_LIST } from "Constants/utils";
import { GET_ALL_EMPLOYEETYPE_DATA } from "Constants/utils";
import { DEPARTMENT_LIST } from "Constants/utils";
import { DESIGNATIONS_LIST } from "Constants/utils";
import { GET_DEPARTMENT_LIST } from "Constants/utils";
import { Aws_LIST } from "Constants/utils";
import { Bank_LIST } from "Constants/utils";
import { GET_EMPLOYEEDROPDOWN_DATA } from "Constants/utils";
import { Religion_LIST } from "Constants/utils";
import { ADD_EMPLOYEE_DATA } from "Constants/utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useEmployee = (params = {}) => {
  const {
    startDate = null,
    confirmationDate = null,
    leaveCalDate = null,
    resignationDate = null,
    children = null,
    profilePic = null,
    appDetails = null,
    setAppDetails = () => {}
  } = params;


    const RestDay = [
        { value: 'Sunday', label: 'Sunday' },
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' }
      ];
      const bloodTypeOptions = [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' },
        { value: 'Unknown', label: 'Unknown' } // Optional
      ];

      const applyOptions = [
        { value: 'END', label: 'END' },
        { value: 'MID', label: 'MID' },
        { value: 'END&MID', label: 'END & MID' },
      
      ];
      const periodOptions = [
        { value: 'PERMANENT', label: 'PERMANENT' },
        { value: 'TEMPORARY', label: 'TEMPORARY' },
      
      
      ];
      const rateOptions = [
        { value: 'Normal', label: 'Normal Rate (1.5,2.0)' },
        { value: 'flat', label: 'Flat Rate' },
        { value: 'hourly', label: 'Hourly Rate' },
        { value: 'Daily', label: 'Daily Rate' },
        { value: 'Vip', label: 'Vip Rate' }
      ];
//e-leave
const excludeDaysOptions = [
    { value: '5WorkingDaysPerWeek', label: '5 Working Days Per Week' },
    { value: '5.5WorkingDaysPerWeek', label: '5.5 Working Days Per Week' },
    { value: 'Shift Worker', label: 'ShiftWorker' },
  
  ];
      
console.log(profilePic,"profilepic+++++");
    const initialValues = {
        // appAccess: '',
        employeeCode: '',
        employeeName: '',
        gender: '',
        martialStatus: '',
        email: '',
        phoneNumber: '',
        probationMonths: '',
        fingerPrint: '',
        faceId: '',
        joinDate:'',
        leaveCalDate:'',
        resignationReason: '',
        departmentId: '',
        designationId: '',
        awsId: '',
        holidayGroup: '',
        hoursWorkedPerDay: '',
        daysWorkedPerWeek: '',
        hoursWorkedPerYear: '',
        partTime: '',
        category: '',
        leaveCategory: '',
    };

    const { currentUser } = useSelector((state) => state.user);
    const token = currentUser?.token;

    const handleSubmit = async (values) => {
        console.log(appDetails, "ePayroll details"); 
        
        // Combine form values with appDetails
        const formattedEmployee = {
          ...values,
          ...appDetails
        };
        console.log(formattedEmployee, "*****");
        
        // Create FormData object
        const formData = new FormData();
        
        // Append the employee data as JSON string
        formData.append("employee", JSON.stringify(formattedEmployee));
        
        // Append profile picture if exists
        if (profilePic) {
          formData.append("profilePic", profilePic);
        }
        
        // For debugging - convert FormData to plain object for console logging
        console.log('FormData ready for submission', Object.fromEntries(formData.entries()));
        
        // Uncomment this when ready to send
        try {
          const response = await fetch(ADD_EMPLOYEE_DATA, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              // Don't set Content-Type - let the browser set it with the boundary
            },
            body: formData,
          });
          
          const data = await response.json();
          console.log(data, "employee response");
          
          if (response.ok) {
            toast.success('Employee Added Successfully!');
          } else {
            toast.error('Error While Adding Employee');
          }
        } catch (error) {
          console.error('Submission error:', error);
          toast.error('An error occurred. Please try again later.');
        }
      };

      const { data: RaceOption, isLoading: optionsLoading } = useQuery({
        queryKey: ['RaceOption'],
        queryFn: async () => {
            try {
                const response = await fetch(`${Race_LIST}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching FWL options:', error);
                throw error;
            }
        },
        enabled: !!token,
        select: (data) => {
            if (!Array.isArray(data.content)) {
                console.error('Data is not an array:', data);
                return [
                    { label: 'Select', value: null, id: null }
                ];
            }

            return [
                { label: 'Select', value: null, id: null },
                ...data.content.map(race => ({
                    label: race.raceName,
                    value: race.raceName,  // You can use fwl.id as value if preferred
                    id: race.id
                }))
            ];
        }
    });

    const { data: religionOptions, isLoading: optionssLoading } = useQuery({
      queryKey: ['religionOptions'],
      queryFn: async () => {
          try {
              const response = await fetch(`${Religion_LIST}`, {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              });

              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              return data;
          } catch (error) {
              console.error('Error fetching FWL options:', error);
              throw error;
          }
      },
      enabled: !!token,
      select: (data) => {
          if (!Array.isArray(data.content)) {
              console.error('Data is not an array:', data);
              return [
                  { label: 'Select', value: null, id: null }
              ];
          }

          return [
              { label: 'Select', value: null, id: null },
              ...data.content.map(religion => ({
                  label: religion.religionName,
                  value: religion.religionName,  // You can use fwl.id as value if preferred
                  id: religion.id
              }))
          ];
      }
  });
  const { data: nationalityOptions, isLoading: optionsssLoading } = useQuery({
    queryKey: ['nationalityOptions'],
    queryFn: async () => {
        try {
            const response = await fetch(`${Nationality_LIST}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching FWL options:', error);
            throw error;
        }
    },
    enabled: !!token,
    select: (data) => {
        if (!Array.isArray(data.content)) {
            console.error('Data is not an array:', data);
            return [
                { label: 'Select', value: null, id: null }
            ];
        }

        return [
            { label: 'Select', value: null, id: null },
            ...data.content.map(nationality => ({
                label: nationality.nationName,
                value: nationality.nationName,  // You can use fwl.id as value if preferred
                id: nationality.id
            }))
        ];
    }
});

const { data: EmployeeOptions, isLoading: optionssssLoading } = useQuery({
    queryKey: ['EmployeeOptions'],
    queryFn: async () => {
        try {
            const response = await fetch(`${GET_EMPLOYEEDROPDOWN_DATA}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data,"))))))))))");
            return data;
        } catch (error) {
            console.error('Error fetching FWL options:', error);
            throw error;
        }
    },
    enabled: !!token,
    select: (data) => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return [
                { label: 'Select', value: null, id: null }
            ];
        }

        return [
            { label: 'Select', value: null, id: null },
            ...data.map(emp => ({
                label: emp.employeeName,
                value: emp.employeeName,  // You can use fwl.id as value if preferred
                id: emp.id
            }))
        ];
    }
});




const { data: EmployeeTypeOptions, isLoading: optionsssszLoading } = useQuery({
    queryKey: ['EmployeeTypeOptions'],
    queryFn: async () => {
        try {
            const response = await fetch(`${GET_ALL_EMPLOYEETYPE_DATA}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
         console.log(data,"type_________________");
            return data;
        } catch (error) {
            console.error('Error fetching FWL options:', error);
            throw error;
        }
    },
    enabled: !!token,
    select: (data) => {
        if (!Array.isArray(data.content)) {
            console.error('Data is not an array:', data);
            return [
                { label: 'Select', value: null, id: null }
            ];
        }

        return [
            { label: 'Select', value: null, id: null },
            ...data.content.map(emp => ({
                label: emp.employeeTypeName,
                value: emp.employeeTypeName,  // You can use fwl.id as value if preferred
                id: emp.id
            }))
        ];
    }
});
const { data: bankOptions, isLoading: optionssssdzLoading } = useQuery({
    queryKey: ['bankOptions'],
    queryFn: async () => {
        try {
            const response = await fetch(`${Bank_LIST}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
         console.log(data,"type_________________");
            return data;
        } catch (error) {
            console.error('Error fetching FWL options:', error);
            throw error;
        }
    },
    enabled: !!token,
    select: (data) => {
        if (!Array.isArray(data.content)) {
            console.error('Data is not an array:', data);
            return [
                { label: 'Select', value: null, id: null }
            ];
        }

        return [
            { label: 'Select', value: null, id: null },
            ...data.content.map(bank => ({
                label: bank.bankName,
                value: bank.bankName,  // You can use fwl.id as value if preferred
                id: bank.id
            }))
        ];
    }
});

//dep
const { data: depOptions, isLoading: optionsdzLoading } = useQuery({
    queryKey: ['depOptions'],
    queryFn: async () => {
        try {
            const response = await fetch(`${GET_DEPARTMENT_LIST}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
   
            return data;
        } catch (error) {
            console.error('Error fetching FWL options:', error);
            throw error;
        }
    },
    enabled: !!token,
    select: (data) => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return [
                { label: 'Select', value: null, id: null }
            ];
        }

        return [
            { label: 'Select', value: null, id: null },
            ...data.map(dep => ({
                label: dep.departmentName,
                value: dep.departmentName,  // You can use fwl.id as value if preferred
                id: dep.id
            }))
        ];
    }
});
//aws
const { data: awsOptions, isLoading: optionsssdzLoading } = useQuery({
    queryKey: ['awsOptions'],
    queryFn: async () => {
        try {
            const response = await fetch(`${Aws_LIST}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
    
            return data;
        } catch (error) {
            console.error('Error fetching FWL options:', error);
            throw error;
        }
    },
    enabled: !!token,
    select: (data) => {
        if (!Array.isArray(data.content)) {
            console.error('Data is not an array:', data);
            return [
                { label: 'Select', value: null, id: null }
            ];
        }

        return [
            { label: 'Select', value: null, id: null },
            ...data.content.map(aws => ({
                label: aws.awsName,
                value: aws.awsName,  // You can use fwl.id as value if preferred
                id: aws.id
            }))
        ];
    }
});
//designato
const { data: designationOptions, isLoading: optionssdzLoading } = useQuery({
    queryKey: ['designationOptions'],
    queryFn: async () => {
        try {
            const response = await fetch(`${DESIGNATIONS_LIST}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
         console.log(data,"type_________________");
            return data;
        } catch (error) {
            console.error('Error fetching FWL options:', error);
            throw error;
        }
    },
    enabled: !!token,
    select: (data) => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return [
                { label: 'Select', value: null, id: null }
            ];
        }

        return [
            { label: 'Select', value: null, id: null },
            ...data.map(desig => ({
                label: desig.designationName,
                value: desig.designationName,  // You can use fwl.id as value if preferred
                id: desig.id
            }))
        ];
    }
});
    

    return { initialValues, handleSubmit,RestDay,rateOptions,RaceOption,bloodTypeOptions,applyOptions,periodOptions,religionOptions,nationalityOptions,EmployeeOptions,excludeDaysOptions,EmployeeTypeOptions,bankOptions,designationOptions,awsOptions,depOptions }

}
export default useEmployee