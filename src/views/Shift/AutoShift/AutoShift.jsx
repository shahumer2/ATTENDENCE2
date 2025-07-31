import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

// Fetch all AutoShifts
const fetchAllAutoShifts = async (token) => {
  const response = await axios.get('http://localhost:8081/api/autoshift/viewAll', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Delete AutoShift by ID
const deleteAutoShift = async ({ id, token }) => {
  return axios.delete(`http://localhost:8081/api/autoshift/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const AutoShift = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch AutoShifts
  const {
    data: autoShifts,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['autoShifts'],
    queryFn: () => fetchAllAutoShifts(token),
    enabled: !!token,
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

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">AutoShift List</h2>
        <button
          onClick={() => navigate("/admin/ETMS/AutoShift/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add AutoShift
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <table className="min-w-full shadow-xl rounded-md border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                  AutoShift Code
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                  AutoShift Name
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {autoShifts?.content?.length > 0 ? (
                autoShifts.content.map((shift, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{shift.autoShiftCode}</td>
                    <td className="px-6 py-4">{shift.autoShiftName}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/ETMS/AutoShift/edit/${shift.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit AutoShift"
                      >
                        <CiEdit size={20} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this AutoShift?")) {
                            deleteShift({ id: shift.id });
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete AutoShift"
                      >
                        <MdDelete size={20} />
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
        )}
      </div>
    </div>
  );
};

export default AutoShift;
