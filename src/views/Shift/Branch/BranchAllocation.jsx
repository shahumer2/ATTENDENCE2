import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Select, { components } from "react-select";
import { toast } from "react-toastify";

// Replace with your actual API constants
import { GET_DEPARTMENT_LIST, SECTION_LISTT, EMPLOYEE_LIST, BRANCH_LIST, ASSIGN_BRANCH } from "Constants/utils";
import { GET_EMPLOYEESEARCH_DATA } from "Constants/utils";
import { Branchh_LIST } from "Constants/utils";

const BranchAllocation = () => {
    const { currentUser } = useSelector((state) => state.user);
    const token = currentUser?.token;

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
        queryKey: ["employees", searchTerm, filters],
        queryFn: async () => {
            const body = {
                searchTerm,
                departmentName: filters.departmentName,
                sectionName: filters.sectionName,
            };
            const res = await fetch(GET_EMPLOYEESEARCH_DATA, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
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

    const CustomMenuList = (props) => {
        return (
          <div className="w-full">
            {/* Header row */}
            <div className="bg-gray-100 text-sm font-semibold border border-gray-300 flex">
              <div className="w-28 border-r border-gray-300 px-2 py-1">Code</div>
              <div className="flex-1 px-2 py-0">Name</div>
            </div>
      
            {/* Options list */}
            <components.MenuList {...props}>{props.children}</components.MenuList>
          </div>
        );
      };
      
      // ✅ Custom option row (aligned with header)
      const CustomOption = (props) => {
        const { data } = props;
        return (
          <components.Option {...props}>
            <div className="flex text-sm w-full border-b border-gray-300 hover:bg-gray-50">
              <div className="w-28 border-r border-gray-300 px-2 py-1">{data.code}</div>
              <div className="flex-1 px-2 py-1">{data.name}</div>
            </div>
          </components.Option>
        );
      };

    return (
        <div className="flex gap-6 p-6">
            {/* Left Div */}
            <div className="w-2/3 bg-white p-4 shadow rounded">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search Employee..."
                    className="border rounded px-3 py-2 w-full mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Filters */}
                <div className="flex gap-4 mb-4">


                    <div className="flex flex-col">
                        <label>
                            Department <span className="text-red-700">*</span>
                        </label>
                        <Select
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
                            className="w-[20rem]"
                            isClearable
                            components={{
                                MenuList: CustomMenuList,
                                Option: CustomOption,
                            }}
                            formatOptionLabel={(option, { context }) =>
                                context === "value" ? `${option.code} - ${option.name}` : null
                            }
                            styles={{
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isFocused ? "white" : "white", // no blue on hover
                                    color: "#333",
                                    cursor: "pointer",
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    border: "1px solid gray",
                                    marginTop: 0,
                                }),
                            }}
                        />


                    </div>



                    <div className="flex flex-col ">
                        <label>Section <span className="text-red-700">*</span></label>
                        <Select
                            placeholder="Select Section"
                            value={filters.sectionName ? { value: filters.sectionName, label: filters.sectionName } : null}
                            onChange={(opt) => setFilters((f) => ({ ...f, sectionName: opt?.value || "" }))}
                            options={sections.map((s) => ({ value: s.sectionName, label: s.sectionName }))}
                            className="w-[20rem]"
                            isClearable
                        />
                    </div>
                </div>

                {/* Employee List */}
                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Select</th>
                            <th className="px-3 py-2 text-left">Employee Code</th>
                            <th className="px-3 py-2 text-left">Employee Name</th>
                        </tr>
                    </thead>
                    <tbody>
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

            {/* Right Div */}
            <div className="w-1/3 bg-white p-4 shadow rounded">
                <h3 className="text-lg font-semibold mb-4">Assign Branch</h3>

                <Select
                    placeholder="Select Branch"
                    value={branchId ? { value: branchId, label: `Branch ${branchId}` } : null}
                    onChange={(opt) => setBranchId(opt?.value || null)}
                    options={branches.map((b) => ({ value: b.id, label: b.branchName }))}
                    className="mb-4"
                    isClearable
                />

                <button
                    onClick={handleAssign}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                    Assign To
                </button>
            </div>
        </div>
    );
};

export default BranchAllocation;
