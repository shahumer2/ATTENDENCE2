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
import { FaEdit } from 'react-icons/fa';
import { SECTIONDEPARTMENT_VIEW } from 'Constants/utils';
import { Alert } from 'react-bootstrap';

const ViewEmployee = () => {
  const [depId, setdepId] = useState(null)
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

  const [filters, setFilters] = useState({
    depId:"",
    employeeStatus: "", // active/resigned/empty
    departmentName: "",
    sectionName: "",
    designationName: "",
    gender: "",
    resignedFrom: "" // if resigned is selected
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
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await fetch(GET_DEPARTMENT_LIST, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch departments");
      return res.json();
    },
    enabled: !!token
  });

  const { data: sections = [] } = useQuery({
    queryKey: ["sections", filters.departmentName],
    queryFn: async () => {
      if (!filters.departmentName) return [];
      const res = await fetch(`${SECTIONDEPARTMENT_VIEW}/${filters?.depId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch sections");
      return res.json();
    },
    enabled: !!token && !!filters.departmentName
  });

  const { data: designations = [] } = useQuery({
    queryKey: ["designations"],
    queryFn: async () => {
      const res = await fetch(DESIGNATIONS_LIST, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch designations");
      return res.json();
    },
    enabled: !!token
  });
  console.log(designations, "jju");

  // 🔹 Fetch employees with filters
  const fetchEmployees = useCallback(async () => {
    try {
      let baseUrl = GET_EMPLOYEESEARCH_DATA;
      // if (filters.employeeStatus === "Active Employees") baseUrl = GET_ACTIVE_EMPLOYEE_DATA;
      // else if (filters.employeeStatus === "resigned") baseUrl = GET_RESIGNED_EMPLOYEE_DATA;
      // else baseUrl = GET_EMPLOYEESEARCH_DATA;

      const body = {
        searchTerm: debouncedSearchTerm,
        departmentName: filters.departmentName,
        sectionName: filters.sectionName,
        designationName: filters.designationName,
        gender: filters.gender,
        resignedFrom: filters.employeeStatus === "resigned" ? filters.resignedFrom : undefined,
        isActive: filters.employeeStatus === "Active Employees" ? true : undefined,

      };


      const res = await fetch(`${baseUrl}?page=${page }&size=${pageSize}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Failed to fetch employees");

      const data = await res.json();
      setEmployees(data.content || []);
      setTotalItems(data?.totalElements || 0);
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);
    } catch (error) {
      toast.error(error.message);
    }
  }, [filters, debouncedSearchTerm, currentPage, itemsPerPage, token,page, pageSize]);

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

  // 🔹 Pagination


  return (
    <>
      <div className="flex justify-between pl-8 pt-2 pr-8">
        <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Employee Basic Details</h2>
        <Breadcrumb items="Master,Employee Basic Details" />
      </div>

      <div className="p-4 bg-white mt-6 ml-8 mr-8 mb-8">
        {/* 🔹 Filters */}
        {/* 🔹 Filters */}
        <div className="flex justify-between mb-4 items-center">
          {/* Left side: Search */}
        <p></p>

          {/* Right side: Dropdowns */}
          <div className="flex gap-3 items-center">
            <div className="flex flex-col w-44">
              <label className='text-sm font-semibold mb-2'>Employee Status</label>
              {/* Employee Status */}
              <Select
                placeholder="Status"
                value={filters.employeeStatus ? { value: filters.employeeStatus, label: filters.employeeStatus } : null}
                onChange={(opt) =>
                  setFilters((f) => ({
                    ...f,
                    employeeStatus: opt?.value || "",
                    sectionName: "",
                    departmentName: "",
                    designationName: "",
                    gender: ""
                  }))
                }
                options={[
                  { value: "", label: "All Employee" },
                  { value: "Active Employees", label: "Active Employee" },
                  { value: "resigned", label: "Resigned Employee" },
                ]}
                className="w-44"
                label="Employee Status"
              />
            </div>
            {/* Resigned Date (if resigned status) */}
            {filters.employeeStatus === "resigned" && (
              <div className="flex flex-col w-44">
                <label className='text-sm font-semibold mb-2'>Resigned From</label>
                <input
                  type="date"
                  className="border rounded px-3 py-2 w-44"
                  value={filters.resignedFrom}
                  onChange={(e) => setFilters((f) => ({ ...f, resignedFrom: e.target.value }))}
                />
              </div>
            )}
            {/* Filter Type */}

            <div className="flex flex-col w-44">
              <label className='text-sm font-semibold mb-2'>Filter Type</label>
              <Select
                placeholder="Filter Type"
                value={filters.filterType ? { value: filters.filterType, label: filters.filterType } : null}
                onChange={(opt) =>
                  setFilters((f) => ({
                    ...f,
                    filterType: opt?.value || "",
                    departmentName: "",
                    sectionName: "",
                    designationName: "",
                    gender: ""
                  }))
                }
                options={[
                  { value: "", label: "--No Filter--" },
                  { value: "department", label: "Department" },
                  { value: "section", label: "Section" },
                  { value: "designation", label: "Designation" },
                  { value: "gender", label: "Gender" },
                ]}
                className="w-44 capitalize"
                isClearable
              />
            </div>



            {/* Dynamic fields based on filter type */}
            {filters.filterType === "department" && (
              <div className="flex flex-col w-44">
                <label className='text-sm font-semibold mb-2'>Department</label>

                <Select
                  placeholder="Select"
                  value={filters.departmentName ? { value: filters.departmentName, label: filters.departmentName } : null}
                  onChange={(opt) => setFilters((f) => ({ ...f, departmentName: opt?.value || "" }))}
                  options={departments.map((dep) => ({ value: dep.departmentName, label: `${dep.departmentName} -  ${dep.departmentCode}` }))}
                  className="w-44 uppercase"
                  isClearable
                />
              </div>
            )}

            {filters.filterType === "section" && (
              <>
                <div className="flex flex-col w-44">
                  <label className='text-sm font-semibold mb-2'>Department</label>
                  <Select
                    placeholder="Select"
                    value={filters.departmentName ? { value: filters.departmentName, label: filters.departmentName,id: filters.depId } : null}
                    onChange={(opt) => setFilters((f) => ({ ...f, departmentName: opt?.value, depId: opt?.id || "",   sectionName: "" }))}
                    options={departments.map((dep) => ({ value: dep.departmentName, label: dep.departmentName , id: dep.id}))}
                    className="w-44"
                    isClearable
                  />
                </div>
                {filters.departmentName && (
                  <div className="flex flex-col w-44">
                    <label className='text-sm font-semibold mb-2'>Section</label>
                    <Select
                      placeholder="Select Section"
                      value={filters.sectionName ? { value: filters.sectionName, label: filters.sectionName } : null}
                      onChange={(opt) => setFilters((f) => ({ ...f, sectionName: opt?.value || "" }))}
                      options={sections.map((sec) => ({ value: sec.sectionName, label: sec.sectionName }))}
                      className="w-44"
                      isClearable
                    />
                  </div>
                )}
              </>
            )}

            {filters.filterType === "designation" && (
              <div className="flex flex-col w-44">
                <label className='text-sm font-semibold mb-2'>Designation</label>
                <Select
                  placeholder="Select Designation"
                  value={filters.designationName ? { value: filters.designationName, label: filters.designationName } : null}
                  onChange={(opt) => setFilters((f) => ({ ...f, designationName: opt?.value || "" }))}
                  options={designations.map((d) => ({ value: d.designationName, label: d.designationName }))}
                  className="w-44"
                  isClearable
                />
              </div>
            )}

            {filters.filterType === "gender" && (
              <div className="flex flex-col w-44">
                <label className='text-sm font-semibold mb-2'>Gender</label>
                <Select
                  placeholder="Select Gender"
                  value={filters.gender ? { value: filters.gender, label: filters.gender } : null}
                  onChange={(opt) => setFilters((f) => ({ ...f, gender: opt?.value || "" }))}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  className="w-36"
                  isClearable
                />
              </div>
            )}



         
          </div>
        </div>

        
        <div className="flex justify-between bg-blue-50 items-center rounded-t-md px-4 py-3">
  {/* Left Title */}
  <h2 className="text-md text-blue-750 font-semibold capitalize">
   LIST OF EMPLOYEES
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
    <button
       style={{ backgroundColor: "#337ab7" }}
  onClick={() => navigate("/admin/employee/add")}
  className="flex items-center gap-2  hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
>
  <IoAdd size={20} />
  NEW
</button>
  </div>
</div>



        {/* 🔹 Table */}
        <div className="bg-white rounded-lg shadow overflow-x-scroll">
        <table className="min-w-full divide-y divide-gray-200 overflow-scroll">
                <thead className="bg-gray-50 overflow-scroll">
              <tr className='overflow-scroll'>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Edit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Short Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">NRIC/Work Permit/FIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Designation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
  Finger Print/Face IDs
</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Email Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Resign Date</th>
               

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 text-xs">
                     <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">
                  <FaEdit size="0.9rem" style={{ color: "#337ab7" }} onClick={()=> alert("edit")} />
                  </td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.employeeCode}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.employeeName}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.ePayrollDTO.shortName}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.ePayrollDTO.nircWorkPermitFin}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.gender}</td>

                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.departmentName}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.sectionName}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.designationName}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.fingerPrint}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.email}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.joinDate}</td>
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">{emp.resignationDate}</td>
                        
                        <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">
                  <FaEdit size="1.3rem" style={{ color: "#337ab7" }} onClick={() => handleDelete(emp.id)} />
                  </td>
                  <td className="uppercase px-6 py-4 text-xs text-gray-700 whitespace-nowrap">
                  <MdDelete style={{ color: "#d97777" }} size="1.3rem" onClick={() => handleDelete(emp.id)} />
                  </td>
                </tr>
              ))}
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
                        className="px-3 py-1 border rounded"
                      >
                        First
                      </button>
                      <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        className="px-3 py-1 border rounded"
                      >
                        Prev
                      </button>
                    </>
                  )}
                  {page <= totalPages && (
                    <>
                      <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        className="px-3 py-1 border rounded"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setPage(totalPages)}
                        className="px-3 py-1 border rounded"
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
  );
};

export default ViewEmployee;
