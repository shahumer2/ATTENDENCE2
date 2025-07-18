import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Groups_LIST } from 'Constants/utils';
import useGroup from 'hooks/useGroup';

const Group = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);


  const {handleDelete}=useGroup()
  // Fetch groups
  const { data: groupData, isLoading, isError, error } = useQuery({
    queryKey: ['groups', currentPage],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage - 1); // Spring uses 0-based page numbers
        queryParams.append('size', 10); // Page size

        const response = await fetch(`${Groups_LIST}?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
      }
    },
    enabled: !!token,
  });
console.log(groupData,"jjkk");
  const totalPages = Math.ceil((groupData?.totalElements || 0) / 10);

  if (isError) {
    toast.error(error.message);
    return <div>Error loading groups</div>;
  }

  return (
    <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Group List</h2>
        <button
          onClick={() => navigate("/admin/ETMS/groups/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Group
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <>
            <table className="min-w-full shadow-xl rounded-md border divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                    Number of Groups
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupData?.length > 0 ? (
                  groupData.map((group) => (
                    <tr key={group.id} className="even:bg-gray-50 hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {group.numberOfGrps}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <div className='flex flex-row gap-3'>
                          <CiEdit 
                            color='green' 
                            className='cursor-pointer' 
                            size={25} 
                            onClick={() => navigate(`/admin/ETMS/groups/update/${group.id}`)}
                          />
                          <MdDelete 
                            color='red' 
                            className='cursor-pointer' 
                            size={25}
                            onClick={()=>handleDelete(group.id)}
                            // Add delete functionality here
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center">
                      No groups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {groupData?.content?.length > 0 && (
              <div className="flex justify-between items-center mt-4 p-4">
                <div className="text-sm text-gray-700">
                  Showing {groupData.content.length} of {groupData.totalElements} groups
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Group;