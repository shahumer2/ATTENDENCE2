import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MdDelete, MdSearch } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { GET_AllowanceSearch_URL, Delete_Allowance_URL } from "Constants/utils";

const ViewJob = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // pagination + search state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // ✅ Fetch jobs API (POST call)
// Function to fetch jobs
  const fetchJobs = async () => {
    const response = await axios.post(
      "http://localhost:8081/api/jobs/search",
      {}, // sending empty object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobs", { page, size, search }],
    queryFn: fetchJobs,
    keepPreviousData: true,
  });

  // ✅ Delete job mutation
  const deleteJob = async (id) => {
    await axios.delete(`${Delete_Allowance_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const mutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      toast.error("Failed to delete job.");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      mutation.mutate(id);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#eaf1f8",
        minHeight: "100vh",
        paddingBottom: "20px",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
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
          JobMaster
        </h2>
        <div className="w-full flex justify-end pr-10 pt-5">
          <p className="text-[17px] font-medium text-gray-600">
            Master <span className="text-gray-400">&gt;</span>{" "}
            <span className="text-gray-900">Job Master</span>
          </p>
        </div>
      </div>

      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
        {/* Add Button */}
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => navigate("/admin/job/addJob")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center gap-2"
          >
            <span className="text-2xl font-bold">+</span>
            <span>Add Job</span>
          </button>
        </div>

        {/* Search */}
        <div
          className="ui-bg-blue-light ui-mb--2"
          style={{ backgroundColor: "#eaf1f8" }}
        >
          <table className="min-w-full border divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  colSpan={6}
                  className="flex justify-between items-center w-full pl-3 pr-3 pt-2 pb-2"
                >
                  <span className="font-bold text-[16px] text-[#292d33]">
                    Job List
                  </span>
                  <div className="relative w-[450px]">
                    <input
                      type="text"
                      placeholder="Enter Job Code or Job Name..."
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

        {/* Data Table */}
        <div>
          <table className="min-w-full shadow-xl rounded-md border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-700">Job Code</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-700">Job Name</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-700">Location</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-700">Postal Code</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-700">Job Status</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-700 text-center">Edit</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-700 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">Loading...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="7" className="text-center text-red-500 p-4">
                    {error.message}
                  </td>
                </tr>
              ) : data?.content?.length > 0 ? (
                data.content.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 border">{job.jobCode}</td>
                    <td className="px-6 py-3 border">{job.jobName}</td>
                    <td className="px-6 py-3 border">{job.address}</td>
                    <td className="px-6 py-3 border">{job.postalCode}</td>
    <td className="px-6 py-3 border">
  {Number(job.status) === 1 ? "Active" : "Inactive"}
</td>





                    <td className="px-6 py-3 border text-center">
                      <button
                        onClick={() => navigate(`/admin/job/edit/${job.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                    </td>
                    <td className="px-6 py-3 border text-center">
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-6 py-3 bg-white">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {data?.totalPages || 1}
          </span>
          <button
            onClick={() =>
              setPage((old) =>
                data?.totalPages && old + 1 < data.totalPages ? old + 1 : old
              )
            }
            disabled={!data?.totalPages || page + 1 >= data.totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewJob;
