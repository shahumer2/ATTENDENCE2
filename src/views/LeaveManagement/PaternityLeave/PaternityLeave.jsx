import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import Select from 'react-select';
import { MdDelete } from "react-icons/md";
import { IoAdd } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'components/Breadcum/Breadcrumb';

// Replace these with your real APIs
import { GET_ALL_EMPLOYEE_DATA, GET_ACTIVE_EMPLOYEE_DATA, GET_RESIGNED_EMPLOYEE_DATA, DELETE_EMPLOYEE_DATA } from 'Constants/utils';
import { GET_DEPARTMENT_LIST, SECTION_LISTT, DESIGNATIONS_LIST } from 'Constants/utils';
import { GET_EMPLOYEESEARCH_DATA } from 'Constants/utils';
import { CiSearch } from 'react-icons/ci';
import { FaEdit, FaList } from 'react-icons/fa';
import { SECTIONDEPARTMENT_VIEW } from 'Constants/utils';
import { Alert } from 'react-bootstrap';
import Tooltip from 'components/Tooltip/Tooltip';

const PaternityLeave = () => {
  const [depId, setdepId] = useState(null)
  const [listModalOpen, setlistModalOpen] = useState(null)
  const [addModalOpen, setaddModalOpen] = useState(null)
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const queryClient = useQueryClient();

  // 🔹 Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  //pagiation//
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [formData, setFormData] = useState({
    leaveUtilizationType: "",
    expiryPeriod: "",
    eligibleWeeks: "",
    childId: "",
    isSingaporeCitizen: "",
    childDob: ""
  });



  const [filters, setFilters] = useState({

    gender: "",

  });

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [employees, setEmployees] = useState([]);

  // 🔹 Debounce search
  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };

  // 🔹 Dropdown API calls


  // 🔹 Fetch employees with filters
  const fetchEmployees = useCallback(async () => {
    try {
      let baseUrl = GET_EMPLOYEESEARCH_DATA;
      // if (filters.employeeStatus === "Active Employees") baseUrl = GET_ACTIVE_EMPLOYEE_DATA;
      // else if (filters.employeeStatus === "Resigned Employees") baseUrl = GET_RESIGNED_EMPLOYEE_DATA;
      // else baseUrl = GET_EMPLOYEESEARCH_DATA;

      const body = {
        searchTerm: debouncedSearchTerm,

        gender: "male",


      };


      const res = await fetch(`${baseUrl}?page=${page}&size=${pageSize}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Failed to fetch employees");

      const data = await res.json();
      console.log(data, "lolo");
      setEmployees(data.content || []);
      setTotalItems(data?.totalElements || 0);
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);
    } catch (error) {
      toast.error(error.message);
    }
  }, [filters, debouncedSearchTerm, currentPage, itemsPerPage, token, page, pageSize]);

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // 🔹 Delete employee
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${DELETE_EMPLOYEE_DATA}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Deleted successfully");
      fetchEmployees();
    },
    onError: (err) => toast.error(err.message)
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) deleteMutation.mutate(id);
  };

  const TOOLTIP_CONTENT = {
    paternity: (

      <div>
        <p className="mb-2">
          Add Paternity Leave Details</p>
        <p>In order for staff to apply for paternity leave, it needs to be activated first in this page.</p>
        <ul>
          <li>To activate:</li>
          <li>Step 1 – Click the Activate / View icon for the staff</li>
          <li>Step 2 – A section will appear near the top of the screen.</li>
          <li>Click the ADD PATERNITY LEAVE DETAILS button</li>
          <li>Step 3 – Fill in the blanks accordingly and click the SAVE button</li>
          <li>Note: Child details will need to be entered for the staff in Master </li>
          <li>Employee Basic Details beforehand </li>

        </ul>

      </div>


    ),
  };

  return (
    <>
      <div className="flex justify-between pl-8 pt-2 pr-8">
        <div className="flex items-center">
          <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Paternity Leave Setting</h2>
          <Tooltip className="ml-8" content={TOOLTIP_CONTENT.paternity} />
        </div>

        <Breadcrumb items="Master,Employee Basic Details" />
      </div>

      <div className="p-4 bg-white mt-6 ml-8 mr-8 mb-8">
        {/* 🔹 Filters */}
        {/* 🔹 Filters */}
        <div className="flex justify-between mb-4 items-center">
          {/* Left side: Search */}
          <p></p>

          {/* Right side: Dropdowns */}

        </div>


        {
          listModalOpen && (
            <div className='bg-white rounded-lg shadow-lg mb-4 p-6'>
              <div className='flex gap-9 mb-3'>
                <div className='flex flex-col'>
                  <h3>Add Paternity Leave Details</h3>
                  <h3>[ {listModalOpen.employeeCode} : {listModalOpen.employeeName} ]</h3>

                </div>
                <div className="w-px bg-gray-300" />
                <div className='flex flex-row gap-12'>
                  <h3> Join Date: : <span>{listModalOpen?.joinDate}</span> </h3>
                  <h3> Working Days Per Week : <span>{listModalOpen?.daysWorkedPerWeek}</span> </h3>
                  <h3> Marital Status : <span>{listModalOpen?.martialStatus}</span> </h3>

                </div>

              </div>
              {addModalOpen && (
                <>
                  <div className="flex justify-between bg-blue-50 items-center rounded-t-md  py-3">
                    {/* Left Title */}
                    <h2 className="text-md text-blue-750 font-semibold capitalize">
                      Add / Edit Paternity Leave Details
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg mb-4 p-6">



                    <div className='grid grid-cols-3'>
                      {/* Leave Utilization Type */}
                      <div className="mb-4 ">
                        <label className="block text-sm font-medium mb-1">Leave Utilization Type</label>
                        <select
                          className="border rounded px-3 py-2 w-[300px]"
                          value={formData.leaveUtilizationType || ""}
                          onChange={(e) => setFormData({ ...formData, leaveUtilizationType: e.target.value })}
                        >
                          <option value="">-- Select --</option>
                          <option value="Flexible">Flexible</option>
                          <option value="Continuous">Continuous</option>
                        </select>
                      </div>

                      {/* Expiry Period */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Expiry Period</label>
                        <select
                          className="border rounded px-3 py-2 w-[300px]"
                          value={formData.expiryPeriod || ""}
                          onChange={(e) => setFormData({ ...formData, expiryPeriod: e.target.value })}
                        >
                          <option value="">-- Select --</option>
                          <option value="16 Weeks">16 Weeks</option>
                          <option value="12 Months">12 Months</option>
                        </select>
                      </div>

                      {/* Eligible Weeks (Radio) */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Eligible Weeks</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="eligibleWeeks"
                              value="2 Weeks"
                              checked={formData.eligibleWeeks === "2 Weeks"}
                              onChange={(e) => setFormData({ ...formData, eligibleWeeks: e.target.value })}
                              className="mr-2"
                            />
                            2 Weeks
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="eligibleWeeks"
                              value="4 Weeks"
                              checked={formData.eligibleWeeks === "4 Weeks"}
                              onChange={(e) => setFormData({ ...formData, eligibleWeeks: e.target.value })}
                              className="mr-2"
                            />
                            4 Weeks
                          </label>
                        </div>
                      </div>

                    </div>
                    {/* Child Select */}
                    <div className='flex gap-4 '>
                      <div className="mb-4 w-[200px]">
                        <label className="block text-sm font-medium mb-1">Child</label>
                        <Select
                          options={
                            listModalOpen?.childrenDetails?.map(child => ({
                              value: child.id,
                              label: `${child.childName} - ${child.dob}`,
                              isCitizen: child.singaporeCitizen,
                              dob: child.dob,
                              name: child.childName,
                              birthCert: child.birthCertificateNo
                            })) || []
                          }
                          value={
                            listModalOpen?.childrenDetails
                              ?.map(child => ({
                                value: child.id,
                                label: `${child.childName} - ${child.dob}`,
                                isCitizen: child.singaporeCitizen,
                                dob: child.dob,
                                name: child.childName,
                                birthCert: child.birthCertificateNo
                              }))
                              .find(opt => opt.value === formData.childId) || null
                          }
                          onChange={(selected) => {
                            setFormData({
                              ...formData,
                              childId: selected.value,
                              isSingaporeCitizen: selected.isCitizen,
                              childDob: selected.dob,
                              childName: selected.name,
                              birthCert: selected.birthCert
                            });
                          }}
                        />

                      </div>

                      {formData.childId && (
                        <div className="grid grid-cols-3 gap-8 mt-8 ml-9 ">
                          <div>
                            <label className="block text-sm font-medium mb-1">Is Singapore Citizen:<span>  {formData.isSingaporeCitizen ? "Yes" : "No"}</span></label>

                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Child DOB:<span>  {formData.childDob}</span></label>

                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Birth Certificate No:<span>  {formData.birthCert}</span></label>

                          </div>

                        </div>
                      )}

                    </div>

                    {/* Child Details */}



                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setaddModalOpen(false)}
                        className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        // onClick={handleSavePaternity}
                        className="px-4 py-2 text-sm text-white bg-[#1f3966] rounded hover:bg-[#16294d]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div className="bg-white rounded-lg shadow overflow-x-scroll mb-4">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Child SG Citizen</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Eligible Weeks</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Weeks</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Utilization Type</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Child Birth Due Date</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Child Birth Date</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Name of Child</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Eligible Days</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* If you have maternityLeaveData, map it here */}
                    {(!listModalOpen.maternityLeaveData || listModalOpen.maternityLeaveData.length === 0) ? (
                      <tr>
                        <td colSpan="11" className="text-center py-4 text-gray-500">
                          No Record Found
                        </td>
                      </tr>
                    ) : (
                      listModalOpen.maternityLeaveData.map((leave, index) => (
                        <tr key={index} className="hover:bg-gray-50 text-xs">
                          <td className="px-4 py-2">{leave.childCitizen}</td>
                          <td className="px-4 py-2">{leave.eligibleWeeks}</td>
                          <td className="px-4 py-2">{leave.paidWeeks}</td>
                          <td className="px-4 py-2">{leave.leaveType}</td>
                          <td className="px-4 py-2">{leave.childBirthDueDate}</td>
                          <td className="px-4 py-2">{leave.childBirthDate}</td>
                          <td className="px-4 py-2">{leave.childName}</td>
                          <td className="px-4 py-2">{leave.totalEligibleDays}</td>
                          <td className="px-4 py-2">{leave.status}</td>
                          <td className="px-4 py-2 text-blue-600 cursor-pointer">Edit</td>
                          <td className="px-4 py-2 text-red-600 cursor-pointer">Delete</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="flex justify-end items-center mb-4 p-4 gap-4">
                  <button onClick={() => setaddModalOpen(listModalOpen.childrenDetails)} className="px-3 py-1 text-sm text-white bg-[#1f3966] border border-[#1f3966] rounded hover:bg-[#16294d] hover:border-[#16294d] uppercase">
                    +  Add Paternity Leave Details
                  </button>

                  <button
                    onClick={() => setlistModalOpen(false)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          )
        }


        <div className="flex justify-between bg-blue-50 items-center rounded-t-md px-4 py-3">
          {/* Left Title */}
          <h2 className="text-md text-blue-750 font-semibold capitalize">
            Paternity Leave Setting
          </h2>

          {/* Right Side (Search + Add Button) */}
          <div className="flex items-center gap-4">
            {/* Search Box */}
            <div className="relative w-[300px] md:w-[400px]">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Employee Code / Name / Email"
                className="border  px-3 pl-10 py-2 w-full rounded-md"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Add Button */}

          </div>
        </div>



        {/* 🔹 Table */}
        <div className="bg-white rounded-lg shadow overflow-x-scroll">
          <table className="min-w-full divide-y divide-gray-200 overflow-scroll">
            <thead className="bg-gray-50 overflow-scroll">
              <tr className='overflow-scroll'>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Emp Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Employee Name</th>



                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Confirmation Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Days Worked / Week
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Marital Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Activate / View</th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {employees && employees.length > 0 ? (employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 text-xs">

                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.employeeCode}</td>
                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.employeeName}</td>


                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.departmentName}</td>
                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.joinDate}</td>
                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.confirmationDate}</td>
                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.daysWorkedPerWeek}</td>
                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.martialStatus}</td>



                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">
                    <FaList
                      style={{ color: "#f6b719", cursor: "pointer" }}
                      size="1rem"
                      onClick={() => {
                        if (emp.childrenDetails && emp.childrenDetails.length > 0) {
                          setlistModalOpen(emp);
                        } else {
                          toast.error("Please add child information from Employee Basic Details");
                        }
                      }}
                    />

                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan="14" className="text-center py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination */}
        <div className="flex w-full justify-end items-center mt-4 px-6">
          <div className="flex space-x-2 text-blue-500">
            {page > 1 && (
              <>
                <button
                  onClick={() => setPage(1)}
                  className="px-3 py-1 border rounded pag"
                >
                  First
                </button>
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1 border rounded pag"
                >
                  Prev
                </button>
              </>
            )}
            {page <= totalPages && (
              <>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1 border rounded pag"
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  className="px-3 py-1 border rounded pag"
                >
                  Last
                </button>
              </>
            )}
          </div>
        </div>
        {/* ✅ Pagination & Controls OUTSIDE table */}
        <div className="flex w-full  items-center mt-4  gap-4 px-6 mb-2">
          {/* Page size selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Page Size:</label>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="border rounded px-2 py-1 w-[100px] border-gray-400"
            >
              {[5, 10, 15, 20].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Pagination buttons */}


          {/* Go to page + info */}
          <div className="flex items-center space-x-2 gap-4">
            <label className="text-sm font-medium">Go to Page:</label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={page}
              onChange={(e) => {
                let val = Number(e.target.value);

                // Prevent NaN or invalid numbers
                if (!val || val < 1) {
                  setPage(1);
                } else if (val > totalPages) {
                  setPage(totalPages);
                } else {
                  setPage(val);
                }
              }}
              className="border rounded w-[100px] px-2 py-1 border-gray-400 mr-4"
            />


            <span className="text-sm  font-semibold ml-4">
              Page {page} of {totalPages}
            </span>
            <span className="text-sm gap-5 font-semibold">
              Total: {totalRecords}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaternityLeave
