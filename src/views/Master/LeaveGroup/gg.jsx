import React from 'react'
import { debounce } from 'lodash';
const gg = () => {

    //for pagination 

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [isActiveFilter, setIsActiveFilter] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const debounceSearch = useCallback(

        debounce((value) => setDebouncedSearchTerm(value), 300),
        []
    );
 
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        debounceSearch(e.target.value); // ✅ will update debouncedSearchTerm
    };

    //fetch table data 
    const { data: tableData, isLoading, isError, error } = useQuery({
        queryKey: [activeTab, currentPage, debouncedSearchTerm, isActiveFilter],
        queryFn: async () => {
            const requestBody = {
                page: currentPage - 1,
                size: 10,
                searchTerm: debouncedSearchTerm || "",   // ✅ single search field
                isActive: isActiveFilter,            // ✅ active/inactive filter
            };

            const response = await fetch(currentApi.SEARCH, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`Failed to fetch ${activeTab} data`);
            const result = await response.json();

            setTotalPages(result?.totalPages || 1);
            setTotalRecords(result?.totalElements || 0);
            return result

        },
        enabled: !!token,
        keepPreviousData: true
    });




    //status toggler 

    const { mutate: toggleStatus } = useMutation({
        mutationFn: async ({ id, isActive }) => {
            const response = await fetch(`${currentApi.statusUpdate}/${id}/active`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isActive }),
            });
            if (!response.ok) {
                // parse backend error instead of throwing a plain Error
                const errorData = await response.json();
                // throw structured error so onError can use it
                throw { status: response.status, ...errorData };
            }

            return response.json();



        },
        onSuccess: () => {
            toast.success('Status updated successfully');

            //for refetch
            queryClient.invalidateQueries([activeTab]);

        },
        onError: async (error) => {
            console.log(error, "))((");
            let errorMsg = error.message;
            const employeeData = error.employees || [];




            setErrorModal({
                open: true,
                message: errorMsg,
                employees: employeeData,
                employeeCount: employeeData.length || 0
            });
        }

    });

    const handleStatusChange = (id, currentStatus) => {
        const currentApi = API_CONFIG[activeTab.toUpperCase()];
        toggleStatus({ id, isActive: !currentStatus, statusKey: currentApi.statusKey });
    };
    return (


        <>
            <div className="flex justify-between pl-8 pt-2 pr-8">

                <div className="flex items-center">
                    <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">{activeTab}</h2>
                    <Tooltip content={TOOLTIP_CONTENT[activeTab]} />
                </div>
                <Breadcrumb className="pr-4" items={`Master, ${activeTab}`} />
            </div>
    //{/* fetch table data  */}


            <div>
                <div className="flex justify-between items-center mb-4">
                    {/* ✅ Left side: show filters only for Leave Type */}
                    {!isAdding && TAB_CONFIG[activeTab].label === "Leave Type" && (
                        <div className="flex items-center space-x-4 gap-12 text-sm">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    checked={isActiveFilter === null}
                                    onChange={() => setIsActiveFilter(null)}
                                    className="accent-[#337ab7]"
                                />
                                <span className="capitalize">All {activeTab}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    checked={isActiveFilter === true}
                                    onChange={() => setIsActiveFilter(true)}
                                    className="accent-[#337ab7]"
                                />
                                <span className="capitalize">Active {activeTab}</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    checked={isActiveFilter === false}
                                    onChange={() => setIsActiveFilter(false)}
                                    className="accent-[#337ab7]"
                                />
                                <span className="capitalize">Inactive {activeTab}</span>
                            </label>
                        </div>
                    )}

                    {/* ✅ Right side: Add button is always here */}
                    {!isAdding && (
                        <div>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Add {TAB_CONFIG[activeTab].label}
                            </button>
                        </div>
                    )}
                </div>












//for search box and name




                <>


                </>



                <div className="flex justify-between bg-blue-50 items-center rounded-t-md">
                    <h2 className="text-md mt-3 mb-4 text-blue-750 rounded-t-md ml-4 font-semibold capitalize">
                        {activeTab} List
                    </h2>

                    <div className="relative mt-3 mr-2 mb-2 w-[400px] md:w-[500px]">
                        <input
                            type="text"
                            placeholder={`Enter The ${activeTab} Code or ${activeTab} Name `}
                            className=" uppercase text-xs pl-8 w-[480px] pr-4 py-3 border rounded-xl"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {/* Search Icon inside input */}
                        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>












            </div>


            {/*  toggler header  */}

            <th className="text-left  py-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-[1%]">
                Active / InActive
            </th>
            const {statusKey} = API_CONFIG[activeTab.toUpperCase()];
            <td className=" py-4 whitespace-nowrap">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item[statusKey]}
                        onChange={() => handleStatusChange(item.id, item[statusKey])}
                    />
                    {/* ✅ Smaller size switch */}
                    <div className="relative w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                    after:h-3 after:w-3 after:transition-all"></div>
                    <span className="ml-2 text-xs font-medium">
                        {/* {item[statusKey] ? 'Active' : 'InActive'} */}
                    </span>
                </label>
            </td>


            {/*      error moal  */}

            {errorModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[900px]">
                        <h2 className="text-lg font-semibold text-black-600 mb-4 capitalize rounded-md">{activeTab}</h2>
                        <hr></hr>
                        <p className="mb-4  text-white p-3" style={{ backgroundColor: '#d97777e3' }}>{errorModal.message}</p>

                        {errorModal.employees.length > 0 && (
                            <table
                                className="w-full border border-gray-300 overflow-scroll font-extralight"
                                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                            >
                                <thead className='text-sm'>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border font-sm w-[250px] text-left" style={{ fontWeight: "700" }}>Employee Code</th>
                                        <th className="p-2 border w-[650px] text-left">Employee Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {errorModal.employees.map((emp, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2 border">{emp.employeeCode}</td>
                                            <td className="p-2 border">{emp.employeeName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div className="flex justify-end mt-4 gap-2">
                            <button

                                className="px-8 border py-2 bg-white-500 text-black rounded"
                            >
                                Total Record: {errorModal.employeeCount}
                            </button>
                            <button
                                onClick={() => setErrorModal({ open: false, message: '', employees: [], employeeCount: 0 })}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* ✅ Pagination & Controls OUTSIDE table */}
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

            <MdDelete style={{ color: "#d97777" }} size="1.3rem" />
            <FaEdit size="1.3rem" style={{ color: "#337ab7" }} />



        </>
    )
}

export default gg
