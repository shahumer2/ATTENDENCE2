import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

// Fetch allowance criteria with pagination
const fetchAllowanceCriteria = async ({ queryKey }) => {
  const [, { token, page, size }] = queryKey;
  const response = await axios.get(
    `http://localhost:8081/api/allowance-criteria/fetch-all?page=${page}&size=${size}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data; // Page<AllowanceCriteriaDTO>
};

const ViewAllowance = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();

  // pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); // default page size

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allowanceCriteria", { token, page, size }],
    queryFn: fetchAllowanceCriteria,
    enabled: !!token,
    keepPreviousData: true,
  });

  const criteria = data?.content || [];
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    if (isError) toast.error(error?.message || "Failed to load allowance criteria");
  }, [isError, error]);

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Allowance Criteria List</h2>
        <button
          onClick={() => navigate("/admin/allowance/view")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Allowance
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : criteria.length > 0 ? (
          <>
            <table className="min-w-full shadow-xl rounded-md border divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                    Allowance Code
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                    Allowance Name
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                    Allowance Amount
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{item.allowanceCode}</td>
                    <td className="px-6 py-4">{item.allowanceName}</td>
                    <td className="px-6 py-4">{item.allowanceAmount}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/allowance/UpdateAllowance/${item.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Allowance"
                      >
                        <CiEdit size={20} />
                      </button>
                      <button
                        onClick={() =>
                          window.confirm("Delete not implemented yet")
                        }
                        className="text-red-600 hover:text-red-800"
                        title="Delete Allowance"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination + Page Size Controls */}
            <div className="flex justify-between items-center mt-4">
              {/* Page size dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-gray-700 text-sm">
                  Page Size:
                </label>
                <select
                  id="pageSize"
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(0); // reset to first page when size changes
                  }}
                  className="border rounded px-2 py-1"
                >
                  {[5, 10, 20, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                {[...Array(totalPages).keys()].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded ${
                      p === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {p + 1}
                  </button>
                ))}

                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-gray-500">No criteria found</div>
        )}
      </div>
    </div>
  );
};

export default ViewAllowance;
