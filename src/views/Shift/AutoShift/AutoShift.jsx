import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CiEdit, CiSearch } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import Tooltip from 'components/Tooltip/Tooltip';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { debounce } from 'lodash';
import { FaEdit } from 'react-icons/fa';
import { AutoShift_LIST } from 'Constants/utils';
import { Delete_Autoshift_URL } from 'Constants/utils';
// Fetch all AutoShifts


// Delete AutoShift by ID
// const deleteAutoShift = async ({ id, token }) => {
//   return axios.delete(`http://localhost:8081/api/autoshift/delete/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

const deleteAutoShift = async ({ id, token }) => {
  return axios.delete(`${Delete_Autoshift_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


const AutoShift = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isActiveFilter, setIsActiveFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  console.log(page,"kk");
  // Fetch AutoShifts
  const {
    data: autoShifts,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['autoShifts', page, debouncedSearchTerm, isActiveFilter, pageSize],  // dependencies
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: 10,
        searchTerm: debouncedSearchTerm || "",  // ✅ single search field
        isActive: isActiveFilter,               // ✅ active/inactive filter
      };

      const response = await fetch(`${AutoShift_LIST}?page=${page - 1}&size=${pageSize}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to fetch Auto Shifts');

      const data = await response.json();
      console.log(data,"kkiikkii");

      // If you maintain pagination state
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);

      console.log('Filtered AutoShift data:', data);
      return data;
    },
    enabled: !!token,
    keepPreviousData: true,
  });


  // Show error toast if data fetch fails
  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to load AutoShifts");
    }
  }, [isError, error]);

  // Delete mutation with toast
  const { mutate: deleteShift, isLoading: isDeleting } = useMutation({
    mutationFn: ({ id }) => deleteAutoShift({ id, token }),
    onSuccess: () => {
      toast.success('AutoShift deleted successfully');
      queryClient.invalidateQueries(['autoShifts']);
    },
    onError: () => {
      toast.error('Failed to delete AutoShift');
    },
  });
  const TOOLTIP_CONTENT = {
    shift: (
      <>

        <p className="mb-2">
          This page lets you setup auto shift(s).</p>


        <p>  Shifts are automatically assigned to staff based on their clock-in timing.</p>


        <p>To indicate which staff falls under the auto shift scheme, you can set it up at Master </p>
        <p> Employee Basic Details<span>{'>'}</span>  E-TMS tab {'>'}Shift Details section</p>




      </>
    ),
  };
  const debounceSearch = useCallback(

    debounce((value) => setDebouncedSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value); // ✅ will update debouncedSearchTerm
  };
  return (
    <>
      <div className="flex justify-between pl-8 pt-2 pr-8">

        <div className="flex items-center">
          <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Auto Shift</h2>
          <Tooltip className="ml-8" content={TOOLTIP_CONTENT.shift} />
        </div>
       <Breadcrumb
  className="pr-4"
  items={["Shift Settings", "AutoShift"]}
  renderItem={(item, index) => (
    <li
      key={index}
      className="text-lg font-medium leading-[1.5] tracking-[0.14px] text-center border-r border-gray-300 px-2 last:border-r-0"
    >
      <a
        href="#"
        className="no-underline bg-transparent text-gray-700 hover:underline"
      >
        {item}
      </a>
    </li>
  )}
/>

      </div>
      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold"></h2>
          {/* <button
            onClick={() => navigate("/admin/ETMS/AutoShift/add")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add AutoShift
          </button> */}
          <button
  onClick={() => navigate("/admin/ETMS/AutoShift/add")}
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
>
  + Add AutoShift
</button>

        </div>


        <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
          <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
            Auto Shift
          </h2>

          <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
            <input
              type="text"
              placeholder={`Enter The AutoShift Code or AutoShift Name `}
              className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {/* Search Icon inside input */}
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <>
              <table className="min-w-full shadow-xl rounded-md border divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      AutoShift Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      AutoShift Name
                    </th>
                    <th className='w-[50%]'></th>
                    <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Edit
                    </th>
                    <th className="px-3 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {autoShifts?.content?.length > 0 ? (
                    autoShifts.content.map((shift, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{shift.autoShiftCode}</td>
                        <td className="px-6 py-4">{shift.autoShiftName}</td>
                        <td></td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/ETMS/AutoShift/edit/${shift.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit AutoShift"
                          >
                            <FaEdit size="1.3rem" style={{ color: "#337ab7" }} />
                          </button>

                        </td>
                        <td>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this AutoShift?")) {
                                deleteShift({ id: shift.id });
                              }
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Delete AutoShift"
                          >
                            <MdDelete style={{ color: "#d97777" }} size="1.3rem" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No AutoShifts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

            </>

          )}
        </div>
      </div>
    </>
  );
};

export default AutoShift;
