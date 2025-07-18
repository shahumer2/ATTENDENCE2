import { useQuery } from "@tanstack/react-query";
import { DELETE_Group } from "Constants/utils";

import { Groups_LIST } from "Constants/utils";
// import { GET_GroupSearch_URL } from "Constants/utils";
// import { GET_GroupBYID_URL } from "Constants/utils";
import { ADD_Groups_DATA } from "Constants/utils";

import { useQueryClient } from '@tanstack/react-query';
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useGroup = (id) => {
const navigate = useNavigate()
const queryClient = useQueryClient();
  const [GroupSearch, setGroupSearch] = useState([])


  const initialValues = {
    numberOfGrps: '',


  };

  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const handleSubmit = async (values) => {
    console.log(values, "Form values");

    try {
      // Added missing closing brace

      const response = await fetch(ADD_Groups_DATA, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Add content type for JSON
        },
        body: JSON.stringify(values) // Stringify the data
      });

      const data = await response.json();
      console.log(data, "Response data");

      if (response.ok) {
        toast.success('Group Added Successfully!');
        navigate("/admin/ETMS/Groups")
      } else {
        toast.error(data.message || 'Error While Adding Group');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };



  // const getGroupById = async (page) => {
  //   try {
  //     const response = await fetch(`${GET_GroupBYID_URL}/${id}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       }
  //     });
  //     const data = await response.json();
  //     console.log(data, "asd");
  //     setGroupSearch(data.content);

  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to fetch Voucher");
  //   }
  // };


  // const getGroupSearch = async (page) => {
  //   try {
  //     const response = await fetch(`${GET_GroupSearch_URL}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       }
  //     });
  //     const data = await response.json();
  //     console.log(data, "asd");
  //     setGroupSearch(data.content);

  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to fetch Voucher");
  //   }
  // };

  const handleDelete = async (id) => {
    console.log(id, "Deleting group with ID");
    
    try {
      // Show confirmation dialog
      const confirmDelete = window.confirm("Are you sure you want to delete this group?");
      if (!confirmDelete) return;
  
      // Show loading state (you can use toast or state)
      toast.info("Deleting group...");
  
      const response = await fetch(`${DELETE_Group}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete group: ${response.status}`);
      }
  
      // Show success message
      toast.success("Group deleted successfully");
      
      // Refresh the data after deletion
      queryClient.invalidateQueries(['groups']);
      
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete group");
    }
  };



  return { initialValues, handleSubmit,handleDelete }

}





export default useGroup