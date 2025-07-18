import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';


import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { GET_AutoShiftSearch_URL } from 'Constants/utils';
const AutoShift = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    AutoShiftCode: null,
    AutoShiftName: null
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all AutoShifts for dropdown options



  // const totalPages = Math.ceil((AutoShiftData?.totalElements || 0) / 10);

  // if (isError) {
  //   toast.error(error.message);
  //   return <div>Error loading AutoShifts</div>;
  // }

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">AutoShift List</h2>
        <button
          onClick={() => navigate("/admin/ETMS/AutoShift/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add AutoShift
        </button>
      </div>

      {/* Search Form */}
      <div className='items-center justify-center'>
        
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : ( */}
          <>
            <table className="min-w-full shadow-xl rounded-md border  divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                    AutoShift Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                    AutoShift Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                   Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              
              </tbody>
            </table>

            {/* Pagination */}
       
          </>
        
      </div>
    </div>
  );
};

export default AutoShift;