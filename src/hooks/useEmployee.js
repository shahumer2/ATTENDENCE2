import { ADD_EMPLOYEE_DATA } from "Constants/utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useEmployee = ({startDate,confirmationDate,leaveCalDate,resignationDate,children,profilePic}) => {
console.log(profilePic,"profilepic+++++");
    const initialValues = {
        // appAccess: '',
        employeeCode: '',
        employeeName: '',
        gender: '',
        maritalStatus: '',
        email: '',
        phoneNumber: '',
        probationMonths: '',
        fingerPrint: '',
        faceId: '',
        resignationReason: '',
        department: '',
        designation: '',
        aws: '',
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
        console.log(values, "jjjjj");
    
        // Format your dates first
        const formattedEmployee = {
            ...values,
            joinDate: startDate?.toISOString().split('T')[0] || "",
            confirmationDate: confirmationDate?.toISOString().split('T')[0] || "",
            leaveCalDate: leaveCalDate?.toISOString().split('T')[0] || "",
            resignationDate: resignationDate?.toISOString().split('T')[0] || "",
            childrenDetails: children
        };
    
        // Create a new FormData object
        const formData = new FormData();
    
        // Append the full employee object as a JSON string
        formData.append("employee", JSON.stringify(formattedEmployee));
    
        // Append the profile picture (if present)
        if (profilePic) {
            formData.append("profilePic", profilePic);
        }
    
        console.log('FormData ready for submission');
    
        try {
            const response = await fetch(ADD_EMPLOYEE_DATA, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Let the browser set Content-Type (for FormData)
                },
                body: formData,
            });
    
            const data = await response.json();
            console.log(data, "employee");
    
            if (response.ok) {
                toast.success('Employee Successfully!');
            } else {
                toast.error('Error While Adding Employee');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.');
        }
    };
    
    

    return { initialValues, handleSubmit }

}
export default useEmployee