import React from 'react'

const jam = () => {
  return (
    <div>

{activeTab === 'basic' && (
    <>
        <div className='border border-gray-400 rounded-md p-4 mb-5'>
            <h2 className='mb-2 font-semibold'>BASIC DETAILS</h2>
            <hr className=' border border-l-black shadow-2xl mb-2'></hr>
            <div className="grid grid-cols-3 gap-6   ">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Name </label>
                    <Field
                        name="shortName"
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter amount"
                    />
                    <ErrorMessage name="shortName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date*</label>
                    <Field
                        type="date"
                        name="birthDate"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >

                    </Field>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF/FWL</label>
                    <ReactSelect
                        name="DutyRoasterCode"
                        // value={DutyRoasterOptions?.DutyRoasterCodes?.find(option => option.value === values.DutyRoasterCode)}
                        // onChange={(option) => {
                        //     console.log('DutyRoaster Code selected:', option);
                        //     setFieldValue('DutyRoasterCode', option?.value || null);
                        // }}
                        // options={DutyRoasterOptions?.DutyRoasterCodes || []}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select"
                        isClearable
                    // isLoading={optionsLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PR Approval Date*</label>
                    <Field
                        type="date"
                        name="prApproval"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >

                    </Field>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pay Day Group</label>
                    <ReactSelect
                        name="DutyRoasterCode"
                        // value={DutyRoasterOptions?.DutyRoasterCodes?.find(option => option.value === values.DutyRoasterCode)}
                        // onChange={(option) => {
                        //     console.log('DutyRoaster Code selected:', option);
                        //     setFieldValue('DutyRoasterCode', option?.value || null);
                        // }}
                        // options={DutyRoasterOptions?.DutyRoasterCodes || []}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select"
                        isClearable
                    // isLoading={optionsLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Pay Date *</label>
                    <Field
                        type="date"
                        name="prApproval"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >

                    </Field>
                </div>


            </div>
            <div className="flex justify-end mt-8">
                <button
                    type="button"
                    className="bg-blue-950 text-white px-6 h-9 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out shadow-sm mr-4 font-sm"
                >
                    Voluntary CPF
                </button>
                <button
                    type="submit"
                    className="bg-blue-950 text-white px-6 h-9 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out shadow-sm mr-4 font-sm"
                >
                    CPF OPTIONS
                </button>
                <button
                    type="submit"
                    className="bg-blue-950 text-white px-6 h-9 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out shadow-sm mr-4 font-sm"
                >
                    CUSTOM OT RATE <span className='text-red-600'>*</span>
                </button>
            </div>
        </div>

        <div className='border border-gray-400 rounded-md p-4 mb-5'>
            <h2 className='mb-2 font-semibold'>Salary Details</h2>
            <hr className=' border border-l-black shadow-2xl mb-2'></hr>






            <div className='p-4 flex flex-row  bg-red-200'>
                <h2 className='text-red-900 flex items-center gap-3'><FaLock /><span > Access Denied</span></h2>

            </div>




        </div>

        {/*         emp details */}

        <div className='border border-gray-400 rounded-md p-4 mb-5'>
            <h2 className='mb-2 font-semibold'>Employment Details</h2>
            <hr className=' border border-l-black shadow-2xl mb-2'></hr>
            <div className="grid grid-cols-3 gap-6   ">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer CPF *</label>
                    <ReactSelect
                        name="EmployerCPF*"
                        // value={DutyRoasterOptions?.DutyRoasterCodes?.find(option => option.value === values.DutyRoasterCode)}
                        // onChange={(option) => {
                        //     console.log('DutyRoaster Code selected:', option);
                        //     setFieldValue('DutyRoasterCode', option?.value || null);
                        // }}
                        // options={DutyRoasterOptions?.DutyRoasterCodes || []}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select Employer CPF"
                        isClearable
                    // isLoading={optionsLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                    <ReactSelect
                        name="DutyRoasterCode"
                        // value={DutyRoasterOptions?.DutyRoasterCodes?.find(option => option.value === values.DutyRoasterCode)}
                        // onChange={(option) => {
                        //     console.log('DutyRoaster Code selected:', option);
                        //     setFieldValue('DutyRoasterCode', option?.value || null);
                        // }}
                        // options={DutyRoasterOptions?.DutyRoasterCodes || []}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select Employment Type"
                        isClearable
                    // isLoading={optionsLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                    <ReactSelect
                        name="DutyRoasterCode"
                        // value={DutyRoasterOptions?.DutyRoasterCodes?.find(option => option.value === values.DutyRoasterCode)}
                        // onChange={(option) => {
                        //     console.log('DutyRoaster Code selected:', option);
                        //     setFieldValue('DutyRoasterCode', option?.value || null);
                        // }}
                        // options={DutyRoasterOptions?.DutyRoasterCodes || []}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select ID Type"
                        isClearable
                    // isLoading={optionsLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NRIC/Work Permit/FIN * </label>
                    <Field
                        name="shortName"
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter NRIC/Work Permit/FIN"
                    />
                    <ErrorMessage name="shortName" component="div" className="text-red-500 text-xs mt-1" />
                </div>







            </div>

        </div>

        {/* Salary Pay Mode */}
        <div className='border border-gray-400 rounded-md p-4 mb-5'>
            <h2 className='mb-2 font-semibold'>Salary Pay Mode</h2>
            <hr className=' border border-l-black shadow-2xl mb-2'></hr>
            <div className='border border-gray-400 rounded-md p-4 mb-5'>
                <h2 className='mb-2 font-semibold'>Salary Pay Mode</h2>
                <hr className='border border-l-black shadow-2xl mb-2' />
                <table className="min-w-full shadow-xl rounded-md   divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">Mode</th>
                            <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">Bank Name</th>
                            <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">Branch ID</th>
                            <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">A/C No</th>
                            <th className="px-6 py-3 text-left text-xs  text-gray-900 uppercase tracking-wider font-semibold">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rows.map((row, index) => (
                            <tr key={index} className="even:bg-gray-50 hover:bg-gray-100 ">
                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{row.mode}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                    <ReactSelect
                                        options={bankOptions}
                                        onChange={(option) => handleBankChange(index, option)}
                                        isClearable
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                    <input
                                        type="text"
                                        value={row.branchId}
                                        onChange={(e) => handleChange(index, 'branchId', e.target.value)}
                                        className="border border-gray-300 rounded-md p-1"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                    <input
                                        type="text"
                                        value={row.accountNo}
                                        onChange={(e) => handleChange(index, 'accountNo', e.target.value)}
                                        className="border border-gray-300 rounded-md p-1"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                    <input
                                        type="number"
                                        value={row.percentage}
                                        onChange={(e) => handleChange(index, 'percentage', e.target.value)}
                                        className="border border-gray-300 rounded-md p-1"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <button onClick={() => console.log(rows)} className="bg-blue-500 text-white p-2 rounded-md">
                        Save
                    </button>
                </div>
            </div>


        </div>

















        <div className='col-span-2'>
                            <div className='border border-gray-400 rounded-md p-4 mb-5'>
                                <FieldArray name="contracts">
                                    {({ push, remove }) => (
                                        <>
                                            <div className="flex justify-between items-center mb-2">
                                                <h2 className='font-semibold'>Contract Details</h2>
                                                <button
                                                    type="button"
                                                    onClick={() => push({ contractNo: '', details: '', startDate: '', endDate: '' })}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                                >
                                                    Add Contract
                                                </button>
                                            </div>
                                            <hr className='border border-l-black shadow-2xl mb-2' />

                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract No</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {values.contracts && values.contracts.map((contract, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-4 whitespace-nowrap">
                                                                    <Field
                                                                        type="text"
                                                                        name={`contracts.${index}.contractNo`}
                                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap">
                                                                    <Field
                                                                        type="text"
                                                                        name={`contracts.${index}.details`}
                                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap">
                                                                    <Field
                                                                        type="date"
                                                                        name={`contracts.${index}.startDate`}
                                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap">
                                                                    <Field
                                                                        type="date"
                                                                        name={`contracts.${index}.endDate`}
                                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-4 whitespace-nowrap">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => remove(index)}
                                                                        className="text-red-600 hover:text-red-900"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                </FieldArray>
                            </div>
                        </div>
    </>
    

)}





















      
    </div>
  )
}

export default jam
