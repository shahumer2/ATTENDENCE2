import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MdDelete, MdSearch } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { GET_AllowanceSearch_URL } from "Constants/utils";

// 🔄 Fetch allowance criteria using search API (POST)
// const fetchAllowanceCriteria = async ({ queryKey }) => {
//   const [, { token, page, size, search }] = queryKey;

//   // Build request payload
//   const payload = search && search.trim() !== "" ? { searchText: search } : {};

//   const response = await axios.post(
//     `http://localhost:8081/api/allowance-criteria/search?page=${page}&size=${size}`,
//     payload,
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );

//   return response.data;
// };

const fetchAllowanceCriteria = async ({ queryKey }) => {
  const [, { token, page, size, search }] = queryKey;

  // Build request payload
  const payload = search && search.trim() !== "" ? { searchText: search } : {};

  const response = await axios.post(
    `${GET_AllowanceSearch_URL}?page=${page}&size=${size}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};


// Delete allowance criteria
const deleteAllowance = async ({ id, token }) => {
  await axios.delete(`http://localhost:8081/api/allowance-criteria/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};




const ViewAllowance = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // search state
  const [search, setSearch] = useState("");
const [searchInput, setSearchInput] = useState("");
const [currentPage, setCurrentPage] = useState(1); // ✅ track current page




  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allowanceCriteria", { token, page, size, search }],
    queryFn: fetchAllowanceCriteria,
    enabled: !!token,
    keepPreviousData: true,
  });

  const criteria = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const [goToPage, setGoToPage] = useState(""); // For go-to-page input
const totalRows = data?.totalElements || 0;

  const handleGoToPage = () => {
    if (!goToPage) return;
    const pageNumber = parseInt(goToPage, 10) - 1; // convert to 0-based
    if (pageNumber >= 0 && pageNumber < data.totalPages) {
      setPage(pageNumber);
    } else {
      toast.error("Invalid page number");
    }
    setGoToPage(""); // reset input
  };


  // ✅ Client-side filtering (fallback if backend doesn't filter)
const filteredCriteria = criteria
    ? criteria.filter(
        (item) =>
          item.allowanceCode?.toString().includes(search) ||
          item.allowanceName?.toLowerCase().includes(search.toLowerCase())
      )
    : criteria;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteAllowance({ id, token }),
    onSuccess: () => {
      toast.success("Allowance deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allowanceCriteria"] });
    },
    onError: () => {
      toast.error("Failed to delete allowance");
    },
  });

  useEffect(() => {
    if (isError) toast.error(error?.message || "Failed to load allowance criteria");
  }, [isError, error]);

  return (

    <div style={{ backgroundColor: "#eaf1f8", minHeight: "100vh", paddingTop: "0px", paddingBottom: "20px" }}>
    <>
          <div style={{ display: "flex", alignItems: "center" }}>
                  <h2
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "20px",
                      color: "#091e42",
                      paddingLeft: "40px",
                      paddingTop: "30px",
                      marginRight: "8px",
                    }}
                  >
                    Allowance
                  </h2>

                    {/* Tooltip Wrapper */}
                    <div className="relative flex items-center justify-center w-4 h-4 mr-3" style={{ paddingTop: "30px"}}>
                                                                                <span className="text-yellow-500 text-xs cursor-pointer group inline-flex items-center justify-center">
                                                                                <span
                                                              style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                width: "14px",
                                                                height: "14px",
                                                                borderRadius: "50%",
                                                                backgroundColor: "#fac863",
                                                                color: "white",
                                                                fontSize: "14px",
                                                                fontWeight: "bold",
                                                              }}
                                                            >
                                                              i
                                                            </span>

                                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-yellow-100 text-black text-sm px-4 py-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-normal text-left pointer-events-none">
                                                        <p className="mb-2">
                                                          This page lets you setup daily allowances and their eligible criteria.
                                                        </p>
                                                        <p className="mb-2">
                                                          Assignment of allowance(s) to staff can be done in <strong>Allowance Settings &gt; Staff Allowance</strong>.
                                                        </p>
                                                        <p>
                                                          Allowances can also be assigned to shift in <strong>Shift Settings &gt; Shift Master</strong>, 
                                                          which indirectly will also be assigned to the staff if the staff is working on that shift.
                                                        </p>
                                                      </div>

                                                                                </span>
                    </div>

                      <div className="w-full flex justify-end pr-10 pt-5">
                      <p
                        style={{
                          fontSize: "17px",
                          fontWeight: 500,
                          lineHeight: 1.43,
                          letterSpacing: "0.14px",
                          color: "#4B5563", // gray-600
                        }}
                      >
                        Allowance Setting <span style={{ color: "#9CA3AF" }}>&gt;</span>{" "}
                        <span style={{ color: "#111827" }}>Allowance</span>
                      </p>
                    </div>


                </div>


                      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
                      
                        <ToastContainer position="top-right" autoClose={3000} />

                      <div className="flex justify-end items-center mb-4">
                    <button
                      onClick={() => navigate("/admin/allowance/view")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center gap-2"
                    >
                      <span className="text-2xl font-bold">+</span>
                      <span>Add Allowance</span>
                    </button>
                  </div>


                      


                        <div className="bg-white rounded-lg shadow overflow-hidden">
                          {isLoading ? (
                            <div className="p-4 text-center">
                              <span className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 inline-block"></span>
                            </div>
                          ) : filteredCriteria.length > 0 ? (
                            <>

                    {/* Table 1: Header + Search */}
                            <div className="ui-bg-blue-light ui-mb--2"style={{ backgroundColor: "#eaf1f8" }}>
                              <table className="min-w-full border divide-y divide-gray-200">
                                <thead>
                                  <tr>
                                    <th colSpan={6} className="flex justify-between items-center w-full pl-3 pr-3 pt-2 pb-2">
                                      {/* Left: Heading */}
                                      <span className="font-bold text-[16px] text-[#292d33]">
                                        Allowance List
                                      </span>

                                      {/* Right: Search */}
                                      <div className="relative w-[450px]">
                                        <input
                                          type="text"
                                          placeholder="Enter Allowance Code or Allowance Name..."
                                          value={searchInput}
                                          onChange={(e) => setSearchInput(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              setSearch(searchInput);
                                              setPage(0);
                                            }
                                          }}
                                          className="border rounded px-3 py-2 w-full pr-10 
                                                    focus:outline-none focus:ring-2 focus:ring-blue-400 
                                                    placeholder:font-normal"
                                        />
                                        <button
                                          onClick={() => {
                                            setSearch(searchInput);
                                            setPage(0);
                                          }}
                                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600"
                                        >
                                          <MdSearch size={20} />
                                        </button>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </div>


                  {/* 🔹 Table 2: Data Table */}
                          <div>
                              <table className="min-w-full shadow-xl rounded-md border divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                    <tr>
                      <th
                        style={{
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "#323232",
                          padding: "10px 55px",
                          verticalAlign: "middle",
                          border: "0",
                          borderRight: "1px solid #ccc",
                          textAlign: "left",
                        }}
                      >
                        Allowance Code
                      </th>

                      <th
                        style={{
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "#323232",
                          padding: "10px 55px",
                          verticalAlign: "middle",
                          border: "0",
                          borderRight: "1px solid #ccc",
                          textAlign: "left",
                        }}
                      >
                        Allowance Name
                      </th>

                      <th
                        style={{
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "#323232",
                          padding: "10px 55px",
                          verticalAlign: "middle",
                          border: "0",
                          borderRight: "1px solid #ccc",
                          textAlign: "left",
                        }}
                      >
                        Allowance Amount
                      </th>

                        <th
                        style={{
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "#323232",
                          padding: "10px 5px",
                          paddingLeft: "41px",
                          verticalAlign: "middle",
                          border: "0",
                          borderRight: "1px solid #ccc",
                          textAlign: "center",
                        }}
                      >
                        Edit
                      </th>

                        <th
                        style={{
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "#323232",
                          padding: "10px 2px",
                          paddingRight: "31px",
                          verticalAlign: "middle",
                          border: "0",
                          borderRight: "1px solid #ccc",
                          textAlign: "center",
                        }}
                      >
                      Delete
                      </th>

                     
                    </tr>
                  </thead>

                                <tbody>
                                  {filteredCriteria.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                      <td
                                      style={{
                                        padding: "10px",
                                        paddingLeft:"73px",
                                      fontSize: "0.875rem",
                                      lineHeight: "1.25rem",
                                        fontWeight: 500,
                                        color: "#323232",
                                        verticalAlign: "middle",
                                        borderBottom: "1px solid #e5e7eb", // light gray border
                                        textAlign: "left", // ✅ aligns text to the right
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {item.allowanceCode}
                                    </td>
                                    <td
                                      style={{
                                        padding: "10px",
                                        paddingLeft:"73px",
                                      fontSize: "0.875rem",
                                      lineHeight: "1.25rem",
                                        fontWeight: 500,
                                        color: "#323232",
                                        verticalAlign: "middle",
                                        borderBottom: "1px solid #e5e7eb", // light gray border
                                        textAlign: "left", // ✅ aligns text to the right
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {item.allowanceName}
                                    </td>
                                    <td
                                      style={{
                                        padding: "10px",
                                        paddingLeft:"73px",
                                      fontSize: "0.875rem",
                                      lineHeight: "1.25rem",
                                        fontWeight: 500,
                                        color: "#323232",
                                        verticalAlign: "middle",
                                        borderBottom: "1px solid #e5e7eb", // light gray border
                                        textAlign: "left", // ✅ aligns text to the right
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {item.allowanceAmount}
                                    </td>
                                     

                                      <td className="px-6 py-4 text-right" style={{ borderBottom: "1px solid #ccc" }}>
                                        <button
                                          onClick={() =>
                                            navigate(`/admin/allowance/UpdateAllowance/${item.id}`)
                                          }
                                          className="text-blue-600 hover:text-blue-800 "
                                          title="Edit Allowance"
                                        >
                                          <FaEdit size="1.3rem" style={{ color: "#337ab7" }}  />
                                        </button>
                                      </td>

                                      <td className="px-6 py-4 text-center" style={{ borderBottom: "1px solid #ccc" }}>
                                        <button
                                          onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this allowance?")) {
                                              deleteMutation.mutate({ id: item.id });
                                            }
                                          }}
                                          className="text-red-600 hover:text-red-800"
                                          title="Delete Allowance"
                                        >
                                          <MdDelete size="1.3rem" style={{ color: "#d97777" }}/>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}

                                  
                  
                                </tbody>

                                 
                              </table>
                                {/* Pagination Controls */}
                    
                    <div className="flex flex-wrap items-center pt-7 pb-3 gap-4 px-6 mb-2 bg-white">
                      {/* Page Size Selector */}
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Page Size:</label>
                        <select
                          id="pageSize"
                          value={size}
                          onChange={(e) => {
                            setSize(Number(e.target.value));
                            setPage(0);
                          }}
                          className="border rounded px-2 py-1 w-[100px] border-gray-400"
                        >
                          {[5, 10, 20, 50].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Go To Page */}
                      <div className="flex items-center ml-4">
                        <label className="mr-2">Go to page:</label>
                        <div className="flex">
                          <input
                            type="number"
                            value={goToPage}
                            onChange={(e) => setGoToPage(e.target.value)}
                            className="border px-2 py-1 w-16 rounded-l"
                            min="1"
                            max={totalPages}
                          />
                          <button
                            onClick={handleGoToPage}
                            className="bg-blue-500 text-white px-3 py-1 rounded-r"
                          >
                            Go
                          </button>
                        </div>
                      </div>

                      <span className="text-sm font-semibold ml-4">
                        Page: {page + 1} of {totalPages}
                      </span>

                      <span className="text-sm gap-5 font-semibold ml-4">
                        Total: {totalRows}
                      </span>
                    </div>

                   
                  </div>



                            
                            </>
                          ) : (
                            <div className="p-4 text-center text-gray-500">No criteria found</div>
                          )}
                        </div>
                      </div>
    </>
    </div>
  );
};

export default ViewAllowance;
