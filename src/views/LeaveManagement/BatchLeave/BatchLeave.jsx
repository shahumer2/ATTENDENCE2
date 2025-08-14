import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GET_EMPLOYEE_DATA, GET_DEPARTMENT_LIST } from 'Constants/utils';
import { useSelector } from 'react-redux';
import { SECTION_LIST } from 'Constants/utils';
import { Leavetype_LIST } from 'Constants/utils';
import ReactSelect from 'react-select';
import { ADD_BatchLeave_DATA } from 'Constants/utils';
import { SECTION_LISTT } from 'Constants/utils';
import { DESIGNATIONS_LIST } from 'Constants/utils';
import { CATEGORYS_LIST } from 'Constants/utils';
import { AWSS_LIST } from 'Constants/utils';

const BatchLeave = () => {
    const { currentUser } = useSelector((state) => state.user);
    const token = currentUser?.token;

    // State for filter selection
    const [filterType, setFilterType] = useState('employee');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [activeTab, setActiveTab] = useState('applyLeave');

    // Form states
    const [applyLeaveForm, setApplyLeaveForm] = useState({
        startDate: null,
        endDate: null,
        leaveTypeId: '',
        remarks: ''
    });

    const [creditAnnualLeaveForm, setCreditAnnualLeaveForm] = useState({
        daysToBeCredited: '',
        annualLeaveDate: null,
        annualLeaveRemark: ''
    });

    const [offInLieuForm, setOffInLieuForm] = useState({
        offInLieuLeaveType: 'Hourly',
        offInLieudaysHoursCredited: '',
        offInLieuExpiryDate: null,
        offInLieuRemarks: ''
    });

    const [deleteLeaveForm, setDeleteLeaveForm] = useState({
        startDate: null,
        endDate: null,
        leaveType: 'Full Day'
    });

    // Field mapping for each filter type
    const FIELD_MAPPING = {
        employee: {
            id: 'id',
            code: 'employeeCode',
            name: 'employeeName'
        },
        department: {
            id: 'id',
            code: 'departmentCode',
            name: 'departmentName'
        },
        section: {
            id: 'id',
            code: 'sectionCode',
            name: 'sectionName'
        },
        designation: {
            id: 'id',
            code: 'designationCode',
            name: 'designationName'
        },
        category: {
            id: 'id',
            code: 'categoryCode',
            name: 'categoryName'
        },
        aws: {
            id: 'id',
            code: 'awsCode',
            name: 'awsName'
        }
    };

    // API endpoints configuration
    const API_CONFIG = {
        employee: {
            list: GET_EMPLOYEE_DATA,
            key: 'employee'
        },
        department: {
            list: GET_DEPARTMENT_LIST,
            key: 'department'
        },
        section: {
            list: SECTION_LISTT,
            key: 'section'
        },
        designation: {
            list: DESIGNATIONS_LIST,
            key: 'designation'
        },
        category: {
            list: CATEGORYS_LIST,
            key: 'category'
        },
        aws: {
            list: AWSS_LIST,
            key: 'aws'
        },
        applyBatchLeave: ADD_BatchLeave_DATA
    };

    // Fetch data based on filter type
    const { data: items = [], isLoading, refetch } = useQuery({
        queryKey: ['items', filterType],
        queryFn: async () => {
            const response = await axios.get(API_CONFIG[filterType].list, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        },
        onSuccess: () => {
            setSelectedItems([]);
            setSelectAll(false);
        },
        onError: (error) => {
            toast.error(`Failed to fetch ${filterType} data`);
        }
    });

    // Apply batch leave mutation
    const { mutate: applyBatchLeave, isLoading: submitting } = useMutation({
        mutationFn: (data) => axios.post(API_CONFIG.applyBatchLeave, data, {
          
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }),

        onSuccess: () => {
            toast.success('Operation completed successfully');
            setSelectedItems([]);
            setSelectAll(false);
            refetch();

            // Reset forms
            setApplyLeaveForm({
                startDate: null,
                endDate: null,
                leaveTypeId: '',
                remarks: ''
            });
            setCreditAnnualLeaveForm({
                daysToBeCredited: '',
                annualLeaveDate: null,
                annualLeaveRemark: ''
            });
            setOffInLieuForm({
                offInLieuLeaveType: 'Hourly',
                offInLieudaysHoursCredited: '',
                offInLieuExpiryDate: null,
                offInLieuRemarks: ''
            });
            setDeleteLeaveForm({
                startDate: null,
                endDate: null,
                leaveType: 'Full Day'
            });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to complete operation');
        }
    });

    // Handle filter type change
    const handleFilterChange = (type) => {
        setFilterType(type);
        setSearchTerm('');
    };

    // Handle item selection
    const handleItemSelect = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    // Handle select all
    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        setSelectedItems(checked ? items.map(item => item[FIELD_MAPPING[filterType].id]) : []);
    };

    // Handle form changes
    const handleApplyLeaveChange = (e) => {
        const { name, value } = e.target;
        setApplyLeaveForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCreditAnnualLeaveChange = (e) => {
        const { name, value } = e.target;
        setCreditAnnualLeaveForm(prev => ({ ...prev, [name]: value }));
    };

    const handleOffInLieuChange = (e) => {
        const { name, value } = e.target;
        setOffInLieuForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDeleteLeaveChange = (e) => {
        const { name, value } = e.target;
        setDeleteLeaveForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle date changes
    const handleApplyLeaveDateChange = (date, field) => {
        setApplyLeaveForm(prev => ({ ...prev, [field]: date }));
    };

    const handleCreditAnnualLeaveDateChange = (date) => {
        setCreditAnnualLeaveForm(prev => ({ ...prev, annualLeaveDate: date }));
    };

    const handleOffInLieuDateChange = (date) => {
        setOffInLieuForm(prev => ({ ...prev, offInLieuExpiryDate: date }));
    };

    const handleDeleteLeaveDateChange = (date, field) => {
        setDeleteLeaveForm(prev => ({ ...prev, [field]: date }));
    };

    // Handle form submissions
    const handleApplyLeaveSubmit = (e) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            toast.error('Please select at least one item');
            return;
        }

        const payload = {
            [`${filterType}Ids`]: selectedItems,
            startDate: applyLeaveForm.startDate?.toISOString().split('T')[0],
            endDate: applyLeaveForm.endDate?.toISOString().split('T')[0],
            leaveTypeId: applyLeaveForm.leaveTypeId,
            remarks: applyLeaveForm.remarks
        };

        applyBatchLeave(payload);
    };

    const handleCreditAnnualLeaveSubmit = (e) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            toast.error('Please select at least one item');
            return;
        }

        const payload = {
            [`${filterType}Ids`]: selectedItems,
            daysToBeCredited: creditAnnualLeaveForm.daysToBeCredited,
            annualLeaveDate: creditAnnualLeaveForm.annualLeaveDate?.toISOString().split('T')[0],
            annualLeaveRemark: creditAnnualLeaveForm.annualLeaveRemark
        };

        applyBatchLeave(payload);
    };

    const handleOffInLieuSubmit = (e) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            toast.error('Please select at least one item');
            return;
        }

        const payload = {
            [`${filterType}Ids`]: selectedItems,
            offInLieuLeaveType: offInLieuForm.offInLieuLeaveType,
            offInLieudaysHoursCredited: offInLieuForm.offInLieudaysHoursCredited,
            offInLieuExpiryDate: offInLieuForm.offInLieuExpiryDate?.toISOString().split('T')[0],
            offInLieuRemarks: offInLieuForm.offInLieuRemarks
        };

        applyBatchLeave(payload);
    };

    const handleDeleteLeaveSubmit = (e) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            toast.error('Please select at least one item');
            return;
        }

        const payload = {
            [`${filterType}Ids`]: selectedItems,
            startDate: deleteLeaveForm.startDate?.toISOString().split('T')[0],
            endDate: deleteLeaveForm.endDate?.toISOString().split('T')[0],
            leaveType: deleteLeaveForm.leaveType
        };

        applyBatchLeave(payload);
    };

    // Filter items based on search term
    const filteredItems = items.filter(item => {
        const fields = FIELD_MAPPING[filterType];
        return (
            item[fields.code]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[fields.name]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const { data: leaveCatOptions, isLoading: optionssddzLoading } = useQuery({
        queryKey: ['leaveCatOptions'],
        queryFn: async () => {
            try {
                const response = await fetch(`${Leavetype_LIST}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data, "leave cat_________________");
                return data;
            } catch (error) {
                console.error('Error fetching FWL options:', error);
                throw error;
            }
        },
        enabled: !!token,
        select: (data) => {
            if (!Array.isArray(data.content)) {
                console.error('Data is not an array:', data.content);
                return [
                    { label: 'Select', value: null, id: null }
                ];
            }

            return [
                { label: 'Select', value: null, id: null },
                ...data.content.map(cat => ({
                    label: `${cat.leaveTypeCode}, ${cat.leaveTypeName}`,
                    value: cat.id,  // You can use fwl.id as value if preferred
                    id: cat.id
                }))
            ];
        }
    });
    console.log(leaveCatOptions, "jj");

    return (
        <div className="container mx-auto p-6">

            <div className='p-4 bg-white'>
            <h1 className="text-2xl font-bold mb-6">Batch Leave</h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left panel - Radio buttons */}
                <div className="w-full lg:w-1/4 bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">Filter By</h2>

                    <div className="space-y-2">
                        {[
                            { value: 'employee', label: 'employee' },
                            { value: 'department', label: 'Department' },
                            { value: 'section', label: 'Section' },
                            { value: 'designation', label: 'Designation' },
                            { value: 'category', label: 'Category' },
                            { value: 'aws', label: 'AWS' }
                        ].map((option) => (
                            <div key={option.value} className="flex items-center">
                                <input
                                    type="radio"
                                    id={option.value}
                                    name="filterType"
                                    value={option.value}
                                    checked={filterType === option.value}
                                    onChange={() => handleFilterChange(option.value)}
                                    className="mr-2"
                                />
                                <label htmlFor={option.value}>{option.label}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle panel - Items List */}
                <div className="flex-1 bg-white p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            {filterType.charAt(0).toUpperCase() + filterType.slice(1)} List
                        </h2>
                        <input
                            type="text"
                            className="p-2 border rounded"
                            placeholder={`Search ${filterType}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : filteredItems.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                disabled={items.length === 0}
                                            />
                                        </th>
                                        <th className="py-2 px-4 text-left">Code</th>
                                        <th className="py-2 px-4 text-left">Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map(item => {
                                        const fields = FIELD_MAPPING[filterType];
                                        return (
                                            <tr key={item[fields.id]} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(item[fields.id])}
                                                        onChange={() => handleItemSelect(item[fields.id])}
                                                    />
                                                </td>
                                                <td className="py-2 px-4">{item[fields.code]}</td>
                                                <td className="py-2 px-4">{item[fields.name]}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No {filterType} data found
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs for different operations */}
            <div className="mt-6 bg-white p-4 rounded shadow">
                <div className="flex border-b">
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'applyLeave' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('applyLeave')}
                    >
                        Apply Leave
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'creditAnnualLeave' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('creditAnnualLeave')}
                    >
                        Credit Annual Leave
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'offInLieu' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('offInLieu')}
                    >
                        Add Off-in-Lieu
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'deleteLeave' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('deleteLeave')}
                    >
                        Delete Leave
                    </button>
                </div>

                {/* Apply Leave Tab */}
                {activeTab === 'applyLeave' && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-4">Apply Leave</h3>
                        <form onSubmit={handleApplyLeaveSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <DatePicker
                                        selected={applyLeaveForm.startDate}
                                        onChange={(date) => handleApplyLeaveDateChange(date, 'startDate')}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-[300px] p-2 border rounded"
                                        placeholderText="dd/mm/yyyy"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <DatePicker
                                        selected={applyLeaveForm.endDate}
                                        onChange={(date) => handleApplyLeaveDateChange(date, 'endDate')}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-[300px] p-2 border rounded"
                                        placeholderText="dd/mm/yyyy"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                    <ReactSelect
                                        value={leaveCatOptions?.find(option => option.id === applyLeaveForm.leaveTypeId) || null}
                                        onChange={(option) => setApplyLeaveForm(prev => ({
                                            ...prev,
                                            leaveTypeId: option?.id || ''
                                        }))}
                                        options={leaveCatOptions || []}
                                        //   getOptionValue={(option) => option.id}
                                        //   getOptionLabel={(option) => option.label || option.name}  // Use appropriate property for display
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select"
                                        isClearable
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                    <input
                                        type="text"
                                        name="remarks"
                                        value={applyLeaveForm.remarks}
                                        onChange={handleApplyLeaveChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Remarks"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                                disabled={submitting}
                            >
                                {submitting ? 'Applying...' : 'Apply'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Credit Annual Leave Tab */}
                {activeTab === 'creditAnnualLeave' && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-4">Credit Annual Leave</h3>
                        <form onSubmit={handleCreditAnnualLeaveSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of days to be credited (per staff)</label>
                                    <input
                                        type="number"
                                        name="daysToBeCredited"
                                        value={creditAnnualLeaveForm.daysToBeCredited}
                                        onChange={handleCreditAnnualLeaveChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Enter number of days"
                                        required
                                    />
                                </div>
                                <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <DatePicker
                                        selected={creditAnnualLeaveForm.annualLeaveDate}
                                        onChange={handleCreditAnnualLeaveDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-[380px] p-2 border rounded"
                                        placeholderText="dd/mm/yyyy"
                                        required
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Limit 100 characters)</label>
                                    <input
                                        type="text"
                                        name="annualLeaveRemark"
                                        value={creditAnnualLeaveForm.annualLeaveRemark}
                                        onChange={handleCreditAnnualLeaveChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Remarks"
                                        maxLength={100}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                                disabled={submitting}
                            >
                                {submitting ? 'Processing...' : 'Credit Annual Leave'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Off-in-Lieu Tab */}
                {activeTab === 'offInLieu' && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-4">Add Off-in-Lieu</h3>
                        <form onSubmit={handleOffInLieuSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="offInLieuLeaveType"
                                                value="Hourly"
                                                checked={offInLieuForm.offInLieuLeaveType === 'Hourly'}
                                                onChange={handleOffInLieuChange}
                                                className="mr-2"
                                            />
                                            Hourly
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="offInLieuLeaveType"
                                                value="Daily"
                                                checked={offInLieuForm.offInLieuLeaveType === 'Daily'}
                                                onChange={handleOffInLieuChange}
                                                className="mr-2"
                                            />
                                            Daily
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        No. of {offInLieuForm.offInLieuLeaveType === 'Hourly' ? 'hours' : 'days'} to be credited (per staff)
                                    </label>
                                    <input
                                        type="text"
                                        name="offInLieudaysHoursCredited"
                                        value={offInLieuForm.offInLieudaysHoursCredited}
                                        onChange={handleOffInLieuChange}
                                        className="w-full p-2 border rounded"
                                        placeholder={`Enter number of ${offInLieuForm.offInLieuLeaveType === 'Hourly' ? 'hours' : 'days'}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <DatePicker
                                        selected={offInLieuForm.offInLieuExpiryDate}
                                        onChange={handleOffInLieuDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full p-2 border rounded"
                                        placeholderText="dd/mm/yyyy"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Limit 100 characters)</label>
                                    <input
                                        type="text"
                                        name="offInLieuRemarks"
                                        value={offInLieuForm.offInLieuRemarks}
                                        onChange={handleOffInLieuChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Remarks"
                                        maxLength={100}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                                disabled={submitting}
                            >
                                {submitting ? 'Processing...' : 'Add Off-in-Lieu'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Delete Leave Tab */}
                {activeTab === 'deleteLeave' && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Leave</h3>
                        <form onSubmit={handleDeleteLeaveSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <DatePicker
                                        selected={deleteLeaveForm.startDate}
                                        onChange={(date) => handleDeleteLeaveDateChange(date, 'startDate')}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full p-2 border rounded"
                                        placeholderText="dd/mm/yyyy"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <DatePicker
                                        selected={deleteLeaveForm.endDate}
                                        onChange={(date) => handleDeleteLeaveDateChange(date, 'endDate')}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full p-2 border rounded"
                                        placeholderText="dd/mm/yyyy"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['Full Day', 'AM', 'PM', 'Hourly', 'Off-in-Lieu Setting', 'Credit'].map(type => (
                                            <label key={type} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="leaveType"
                                                    value={type}
                                                    checked={deleteLeaveForm.leaveType === type}
                                                    onChange={handleDeleteLeaveChange}
                                                    className="mr-2"
                                                />
                                                {type}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:bg-red-300"
                                disabled={submitting}
                            >
                                {submitting ? 'Deleting...' : 'Delete Leave'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default BatchLeave;