import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import ReactSelect from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

import { CiEdit, CiSearch } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { GET_DutyRoasterSearch_URL } from 'Constants/utils';
import { DutyRoaster_LIST } from 'Constants/utils';
import Tooltip from 'components/Tooltip/Tooltip';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
import { FaEdit } from 'react-icons/fa';
const DutyRoaster = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isActiveFilter, setIsActiveFilter] = useState(null);
  const [searchParams, setSearchParams] = useState({
    DutyRoasterCode: null,
    DutyRoasterName: null
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all DutyRoasters for dropdown options
  const { data: DutyRoasterOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['DutyRoasterOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${DutyRoaster_LIST}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data from API:', data); // This shows it's an array
        return data?.content;
      } catch (error) {
        console.error('Error fetching DutyRoaster options:', error);
        throw error;
      }
    },
    enabled: !!token,
    select: (data) => {
      console.log('Data in select function:', data); // Should log the array

      // Since data is directly the array, we don't need data.content
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return {
          DutyRoasterNames: [{ label: 'Select', value: null }],
          DutyRoasterCodes: [{ label: 'Select', value: null }]
        };
      }

      const transformed = {
        DutyRoasterNames: [
          { label: 'Select', value: null },
          ...data.map(DutyRoaster => ({
            label: DutyRoaster.dutyRoasterName,
            value: DutyRoaster.dutyRoasterName
          }))
        ],
        DutyRoasterCodes: [
          { label: 'Select', value: null },
          ...data.map(DutyRoaster => ({
            label: DutyRoaster.dutyRoasterCode,
            value: DutyRoaster.dutyRoasterCode
          }))
        ]
      };

      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  // Fetch filtered DutyRoasters based on search params
  // Fetch filtered DutyRoasters based on search params
  const { data: DutyRoasterData, isLoading, isError, error } = useQuery({
    queryKey: ['DutyRoasters', currentPage, debouncedSearchTerm, isActiveFilter ,page, pageSize],
    queryFn: async () => {
      const requestBody = {
        page: currentPage - 1,
        size: 10,
        searchTerm: debouncedSearchTerm || "",   // ✅ single search field
        isActive: isActiveFilter,            // ✅ active/inactive filter
      };

      const response = await fetch(`${GET_DutyRoasterSearch_URL}?page=${page - 1}&size=${pageSize}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to fetch DutyRoasters');

      const data = await response.json();
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalElements || 0);
      console.log('Filtered DutyRoaster data:', data);
      return data;
    },
    enabled: !!token,
    keepPreviousData: true
  });

  const handleSearchSubmit = (values) => {
    console.log('Search form submitted with values:', values);
    setSearchParams({
      DutyRoasterCode: values.DutyRoasterCode,
      DutyRoasterName: values.DutyRoasterName
    });
    setCurrentPage(1);
  };



  if (isError) {
    toast.error(error.message);
    return <div>Error loading DutyRoasters</div>;
  }
  console.log(DutyRoasterData, "jamshed");

  const TOOLTIP_CONTENT = {
    shift: (
      <>

        <p className="mb-2">
          This page lets you setup duty roster for staff.</p>

        <p>A duty roster in our system concept refers to a working pattern that keeps on repeating itself based on a pre-defined period.</p>

        <p>A duty roster can be set from 1 day up to 42 days of repetition, and can accommodate 6 groups of staff per roster.</p>

        <p>To indicate which staff falls under the Duty Roaster scheme, you can set it up at Master {"> "}Employee Basic Details {"> "} E-TMS tab {"> "} Shift Details section</p>







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
          <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">DutyRoster List</h2>
          <Tooltip className="ml-8" content={TOOLTIP_CONTENT.shift} />
        </div>
        <Breadcrumb className="pr-4" items={`Shift Settings,Duty Roaster `} />
      </div>
      <div className="p-4 bg-white mt-[30px] ml-8 mr-8 mb-8">
        {/* Header + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <p></p>

          <button
            onClick={() => navigate("/admin/ETMS/DutyRoaster/add")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add DutyRoster
          </button>
        </div>

        {/* Search Form */}
        <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
          <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
            Duty Roster
          </h2>

          <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
            <input
              type="text"
              placeholder={`Enter The Duty Roster Code or Duty Roster Name `}
              className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {/* Search Icon inside input */}
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <>
              <table className="min-w-full shadow-xl rounded-md border  divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      DutyRoster Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      DutyRoster Name
                    </th>
                    <th className='w-[50%]'></th>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Edit
                    </th>
                    <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {DutyRoasterData?.content?.length > 0 ? (
                    DutyRoasterData.content.map((DutyRoaster) => (
                      <tr key={DutyRoaster.id} className="even:bg-gray-50 hover:bg-gray-100 capitalize">
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {DutyRoaster.dutyRoasterCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {DutyRoaster.dutyRoasterName}
                        </td>
                        <td></td>

                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          <div className='flex flex-row gap-3'>
                          <FaEdit size="1.3rem" style={{ color: "#337ab7" }} onClick={() => navigate(`/admin/ETMS/DutyRoasterUpdate/${DutyRoaster.id}`)} />
                           

                          </div>
                        </td>
                        <td>
                        <MdDelete style={{ color: "#d97777" }} size="1.3rem" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-sm text-gray-500 text-center">
                        No DutyRosters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex w-full justify-end items-center mt-4 px-6">
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

export default DutyRoaster;