import { GET_COMPANY_LIST } from "Constants/utils";
import { GET_DEPARTMENT_LIST } from "Constants/utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useUser = () => {
    
    const { currentUser } = useSelector((state) => state.user);
    const token = currentUser?.token;
    const [department, setdepartment] = useState(null)
    const [company, setcompany] = useState(null)
    const sections = [
        { id: 'basic', label: 'Basic Information' },
        { id: 'app-access', label: 'App Access' },
        { id: 'company-access', label: 'Company Access' },
        { id: 'department-access', label: 'Department Access' },

    ];
    const handleFinalSubmit = async (values) => {

        console.log(values,"jj");
        try {
            const response = await fetch('YOUR_FINAL_SUBMIT_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('User created successfully');
            } else {
                throw new Error('Failed to create user');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    const getDepartment = async () => {
        console.log("hey");
        try {
            const response = await fetch(`${GET_DEPARTMENT_LIST}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
           
            setdepartment(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch HsnCode");
        }
    };
    const getCompany = async () => {
        console.log("i am here");
        try {
            const response = await fetch(`${GET_COMPANY_LIST}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log("companyy======",data);
            setcompany(data);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch HsnCode");
        }
    };

    return { handleFinalSubmit, sections,getDepartment,getCompany,department,company }
}

export default useUser