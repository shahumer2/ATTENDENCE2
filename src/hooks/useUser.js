import { USER_ADD } from "Constants/utils";
import { GET_COMPANY_LIST } from "Constants/utils";
import { GET_EMPLOYEE_DATA } from "Constants/utils";
import { GET_DEPARTMENT_LIST } from "Constants/utils";
import { error } from "jquery";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useUser = () => {
  const navigate = useNavigate()
    
    const { currentUser } = useSelector((state) => state.user);
    const token = currentUser?.token;
    const [department, setdepartment] = useState(null)
    const [company, setcompany] = useState(null)
    const [Employee, setEmployee] = useState([])
    const sections = [
        { id: 'basic', label: 'Basic Information' },
        { id: 'app-access', label: 'App Access' },
        { id: 'company-access', label: 'Company Access' },
        { id: 'department-access', label: 'Department Access' },

    ];
    const handleFinalSubmit = async (values) => {
        try {
          const formData = new FormData();
      
          // Extract only IDs from selectedCompanies and selectedDepartments
          const selectedCompanyIds = values.selectedCompanies?.map(c => c.id) || [];
          const selectedDepartmentIds = values.selectedDepartments?.map(d => d.id) || [];
      
          // Construct final user object to send
          const {
            profilePicFile,
            profileImage,
             selectedCompanies,
           selectedDepartments,
            ...rest
          } = values;
          
          // Construct final user object to send
          const userPayload = {
            ...rest,
            companyIds: selectedCompanyIds,
            departmentIds: selectedDepartmentIds
          };
          
          formData.append("user", JSON.stringify(userPayload));
      
          // Attach file (make sure you're keeping it in state like profilePic in BasicInfoSection)
          if (values.profilePicFile) {
            formData.append("image", values.profilePicFile);
          }

          console.log(values,"kkjj");
      
          const response = await fetch(USER_ADD, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData,
          });
      
          if (response.ok) {
            toast.success('User created successfully');
            navigate("/admin/user/view")   
          } else {
            const errorData = await response.json(); // parse error body
            console.log(errorData);
          
            // show API error message if available, fallback otherwise
            toast.error(errorData.details || "Something went wrong. Please try again.");
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message || 'Something went wrong');
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
    const getEmployee = async () => {
    
      try {
          const response = await fetch(`${GET_EMPLOYEE_DATA}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              }
          });
          const data = await response.json();
         
          setEmployee(data);

      } catch (error) {
          console.error(error);
          toast.error("Failed to fetch HsnCode");
      }
  };

    

    return { handleFinalSubmit, sections,getDepartment,getCompany,department,company,getEmployee,Employee }
}

export default useUser