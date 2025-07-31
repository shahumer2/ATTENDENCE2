import { Field } from 'formik'
import useEmployee from 'hooks/useEmployee'
import React from 'react'
import ReactSelect from 'react-select'

const ELeaveTabs = ({values, setFieldValue, appDetails, setAppDetails}) => {
    const { EmployeeOptions,excludeDaysOptions } = useEmployee()
    console.log(EmployeeOptions, "________________");


    return (
        <div>
            <div className='p-3 gap-5'>
                {/* Basic Details Section */}
                <div className='border border-gray-400 rounded-md p-4 mb-5'>
                    <h2 className='mb-2 font-semibold'>Basic Details</h2>
                    <hr className='border border-l-black shadow-2xl mb-2'></hr>
                    <div className="grid grid-cols-3 gap-6">
                        {/* Short Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Name*</label>
                            <input
                                type="text"
                                value={appDetails.eLeaveDTO.shortName}
                                onChange={(e) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        shortName: e.target.value
                                    }
                                })}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Default Replacement Staff */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Replacement Staff*</label>
                            <ReactSelect
                                value={EmployeeOptions.find(opt => opt.value === appDetails.eLeaveDTO.defaultReplacementStaffId)}
                                onChange={(option) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        defaultReplacementStaffId: option?.id || null
                                    }
                                })}
                                options={EmployeeOptions}
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                            />
                        </div>

                        {/* Exclude Days */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exclude Days</label>
                            <ReactSelect
                                value={excludeDaysOptions.find(opt => opt.value === appDetails.eLeaveDTO.excludeDays)}
                                onChange={(option) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        excludeDays: option?.value || ''
                                    }
                                })}
                                options={excludeDaysOptions}
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                            />
                        </div>

                        {/* Home Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Home Phone*</label>
                            <input
                                type="tel"
                                value={appDetails.eLeaveDTO.homePhone}
                                onChange={(e) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        homePhone: e.target.value
                                    }
                                })}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Alternate Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Email*</label>
                            <input
                                type="email"
                                value={appDetails.eLeaveDTO.alternateEmail}
                                onChange={(e) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        alternateEmail: e.target.value
                                    }
                                })}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Leave Approver Details Section */}
                <div className='border border-gray-400 rounded-md p-4 mb-5'>
                    <h2 className='mb-2 font-semibold'>Leave Approver Details</h2>
                    <hr className='border border-l-black shadow-2xl mb-2'></hr>
                    <div className="grid grid-cols-3 gap-6">
                        {/* Final Approver */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Final*</label>
                            <ReactSelect
                                value={EmployeeOptions.find(opt => opt.value === appDetails.eLeaveDTO.lApproverFinalId)}
                                onChange={(option) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        lApproverFinalId: option?.id || null
                                    }
                                })}
                                options={EmployeeOptions}
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                            />
                        </div>

                        {/* Second Approver */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Second</label>
                            <ReactSelect
                                value={EmployeeOptions.find(opt => opt.value === appDetails.eLeaveDTO.lApproverSecondId)}
                                onChange={(option) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        lApproverSecondId: option?.id || null
                                    }
                                })}
                                options={EmployeeOptions}
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                            />
                        </div>

                        {/* First Approver */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First</label>
                            <ReactSelect
                                value={EmployeeOptions.find(opt => opt.value === appDetails.eLeaveDTO.lApproverFirstId)}
                                onChange={(option) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        lApproverFirstId: option?.id || null
                                    }
                                })}
                                options={EmployeeOptions}
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                            />
                        </div>
                    </div>
                </div>

                {/* FWA Approver Details Section */}
                <div className='border border-gray-400 rounded-md p-4 mb-5'>
                    <h2 className='mb-2 font-semibold'>FWA Approver Details</h2>
                    <hr className='border border-l-black shadow-2xl mb-2'></hr>
                    <div className="grid grid-cols-3 gap-6">
                        {/* Final Approver */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Final*</label>
                            <ReactSelect
                                value={EmployeeOptions.find(opt => opt.value === appDetails.eLeaveDTO.fwaApproverFinalId)}
                                onChange={(option) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        fwaApproverFinalId: option?.id || null
                                    }
                                })}
                                options={EmployeeOptions}
                                className="bg-white dark:bg-form-Field z-999"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                menuPosition="fixed"
                                isClearable
                            />
                        </div>

                        {/* Second Approver */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Second</label>
                            <ReactSelect
                                value={EmployeeOptions.find(opt => opt.value === appDetails.eLeaveDTO.fwaApproverSecondId)}
                                onChange={(option) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        fwaApproverSecondId: option?.id || null
                                    }
                                })}
                                options={EmployeeOptions}
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                                menuPosition="fixed"
                            />
                        </div>

                        {/* First Approver */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First</label>
                            <ReactSelect
                                value={EmployeeOptions.find(opt => opt.value === appDetails.eLeaveDTO.fwaApproverFirstId)}
                                onChange={(option) => setAppDetails({
                                    ...appDetails,
                                    eLeaveDTO: {
                                        ...appDetails.eLeaveDTO,
                                        fwaApproverFirstId: option?.id || null
                                    }
                                })}
                                options={EmployeeOptions}
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                                menuPosition="fixed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ELeaveTabs
