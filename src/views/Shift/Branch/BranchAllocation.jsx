import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Select, { components } from "react-select";
import { toast } from "react-toastify";

// Replace with your actual API constants
import { GET_DEPARTMENT_LIST, SECTION_LISTT, EMPLOYEE_LIST, BRANCH_LIST, ASSIGN_BRANCH } from "Constants/utils";
import { GET_EMPLOYEESEARCH_DATA } from "Constants/utils";
import { Branchh_LIST } from "Constants/utils";
import TwoColumnSelect from "views/TableSelect/TwoColumnSelect";
import Tooltip from "components/Tooltip/Tooltip";
import Breadcrumb from "components/Breadcum/Breadcrumb";
import { CiSearch } from "react-icons/ci";

const BranchAllocation = () => {
    const { currentUser } = useSelector((state) => state.user);
    const token = currentUser?.token;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    // State
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        departmentName: "",
        sectionName: "",
    });
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [branchId, setBranchId] = useState(null);

    // Departments
    const { data: departments = [] } = useQuery({
        queryKey: ["departments"],
        queryFn: async () => {
            const res = await fetch(GET_DEPARTMENT_LIST, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error("Failed to fetch departments");
            return res.json();
        },
        enabled: !!token,
    });

    // Sections based on Department
    const { data: sections = [] } = useQuery({
        queryKey: ["sections", filters.departmentName],
        queryFn: async () => {
            if (!filters.departmentName) return [];
            const res = await fetch(`${SECTION_LISTT}?department=${filters.departmentName}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error("Failed to fetch sections");
            return res.json();
        },
        enabled: !!token && !!filters.departmentName,
    });

    // Employees (filtered)
    const { data: employees = [] } = useQuery({
        queryKey: ["employees", searchTerm, filters,pageSize,totalPages],
        queryFn: async () => {
            const body = {
                searchTerm,
                departmentName: filters.departmentName,
                sectionName: filters.sectionName,
            };
            const res = await fetch(`${GET_EMPLOYEESEARCH_DATA}?page=${page}&size=${pageSize}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            setTotalItems(data?.totalElements || 0);
            setTotalPages(data?.totalPages || 1);
            setTotalRecords(data?.totalElements || 0);
            if (!res.ok) throw new Error("Failed to fetch employees");
            return res.json();
        },
        enabled: !!token,
    });

    // Branch list
    const { data: branches = [] } = useQuery({
        queryKey: ["branches"],
        queryFn: async () => {
            const res = await fetch(Branchh_LIST, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error("Failed to fetch branches");
            return res.json();
        },
        enabled: !!token,
    });

    // Handle employee checkbox toggle
    const handleEmployeeSelect = (id) => {
        setSelectedEmployees((prev) =>
            prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
        );
    };

    // Handle assign
    const handleAssign = async () => {
        if (!branchId || selectedEmployees.length === 0) {
            toast.error("Please select at least one employee and a branch.");
            return;
        }

        const body = {
            employeeIds: selectedEmployees,
            branchId: branchId,
        };

        try {
            const res = await fetch(ASSIGN_BRANCH, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Failed to assign branch");

            toast.success("Branch assigned successfully!");
            setSelectedEmployees([]);
            setBranchId(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

 
    const TOOLTIP_CONTENT = {
        branchAllo: (
            <div>
                <p className="mb-2">
                    This page lets you assign staff to their default branch. (Staff can still be planned to work in different branches)</p>
                <p>How to assign staff to a branch:</p>
                <p>Step 1: Filter the staff using Department or Section filter if necessary</p>
                <p>Step 2: Select the staff in the Employee List table</p>
                <p>Step 3: Select the Branch in the dropdown list</p>
                <p>Step 4: Click UPDATE button</p>
                <p>The branch of the staff will be updated and shown in the Employee List table accordingly.</p>




            </div>
        ),
    };

    return (

        <>
            <div className="flex justify-between pl-8 pt-2 pr-8">

                <div className="flex items-center">
                    <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Employee Allocation</h2>
                    <Tooltip content={TOOLTIP_CONTENT.branchAllo} />
                </div>
                <Breadcrumb className="pr-4" items={`Shift Settings
,Employee Allocation`} />
            </div>
            <div className="flex gap-6 p-6 h-[500px]">
                {/* Left Div */}
                <div className="w-2/3 bg-white p-4 shadow rounded">
                    {/* Search */}

                    <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
                        <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
                        EMPLOYEE LIST
                        </h2>

                        <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
                            <input
                                type="text"
                                placeholder="Search Employee..."
                                className="border rounded px-7 py-1 w-full "
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* Search Icon inside input */}
                            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>











                    {/* Filters */}
                    <div className="flex gap-4 mb-4 mt-3">


                        <div className="flex flex-col ">
                            <label>
                                Department <span className="text-red-700">*</span>
                            </label>
                            <TwoColumnSelect
                                placeholder="Select Department"
                                value={
                                    filters.departmentName
                                        ? {
                                            value: filters.departmentName,
                                            code: filters.departmentCode,
                                            name: filters.departmentName,
                                        }
                                        : null
                                }
                                onChange={(opt) =>
                                    setFilters((f) => ({
                                        ...f,
                                        departmentName: opt?.value || "",
                                        departmentCode: opt?.code || "",
                                        sectionName: "",
                                    }))
                                }
                                options={departments.map((d) => ({
                                    value: d.departmentName,
                                    code: d.departmentCode,
                                    name: d.departmentName,
                                }))}
                            />


                        </div>



                        <div className="flex flex-col ">
                            <label>Section <span className="text-red-700">*</span></label>
                            <TwoColumnSelect
                                placeholder="Select Section"
                                value={
                                    filters.sectionName
                                        ? { value: filters.sectionName, code: filters.sectionCode, name: filters.sectionName }
                                        : null
                                }
                                onChange={(opt) =>
                                    setFilters((f) => ({
                                        ...f,
                                        sectionName: opt?.value || "",
                                        sectionCode: opt?.code || "",
                                    }))
                                }
                                options={sections.map((s) => ({
                                    value: s.sectionName,
                                    code: s.sectionCode,
                                    name: s.sectionName,
                                }))}
                            />
                        </div>
                    </div>

                    {/* Employee List */}

                    <div className="h-[200px] overflow-y-auto border rounded">
                        <table className="w-full border overflow-y-scroll h-[50px]">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 py-2 text-left">Select</th>
                                    <th className="px-3 py-2 text-left">Employee Code</th>
                                    <th className="px-3 py-2 text-left">Employee Name</th>
                                </tr>
                            </thead>
                            <tbody className="overflow-y-scroll h-[20px]">
                                {employees?.content?.map((emp) => (
                                    <tr key={emp.id} className="border-t">
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.includes(emp.id)}
                                                onChange={() => handleEmployeeSelect(emp.id)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">{emp.employeeCode}</td>
                                        <td className="px-3 py-2">{emp.employeeName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-[300px]">
                        <div className="flex w-full bg-white justify-end items-center mt-1 px-6">
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

                        <div className="flex w-full  items-center mt-4  gap-4 px-6 mb-[100px]">
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

                </div>

                {/* Right Div */}
                <div className="w-1/3 bg-white p-4 shadow rounded">
                    <h3 className="text-lg font-semibold mb-4">Assign Branch</h3>

                    <TwoColumnSelect
                        placeholder="Select Branch"
                        value={
                            branchId
                                ? { value: branchId, code: branches.find((b) => b.id === branchId)?.branchCode, name: branches.find((b) => b.id === branchId)?.branchName }
                                : null
                        }
                        onChange={(opt) => setBranchId(opt?.value || null)}
                        options={branches.map((b) => ({
                            value: b.id,
                            code: b.branchCode,
                            name: b.branchName,
                        }))}
                    />

                    <button
                        onClick={handleAssign}
                        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full"
                    >
                        Assign To
                    </button>
                </div>
            </div>

        </>
    );
};

export default BranchAllocation;
