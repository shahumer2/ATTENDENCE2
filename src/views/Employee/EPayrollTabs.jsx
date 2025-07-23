import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactSelect from 'react-select';

const EPayrollTabs = ({ values, setFieldValue }) => {
    const [activeTab, setActiveTab] = useState('basic');

    const tabs = [
        { id: 'basic', label: 'Basic' },
        { id: 'additional', label: 'Additional' },
        { id: 'personal', label: 'Personal' },
        { id: 'empHistory', label: 'Employment History' },
        { id: 'empEducation', label: 'Education' },
        { id: 'customFields', label: 'Custom Fields' },
        { id: 'momIntegration', label: 'MOM Integration' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tab headers */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab content */}
            <div className="p-6 ">
                {/* Basic Tab */}
                {activeTab === 'basic' && (
                    <div className="grid grid-cols-3 gap-6 border border-gray-400 rounded-md p-5 ">
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
                                placeholder="Select DutyRoaster Code"
                                isClearable
                                // isLoading={optionsLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                            <Field
                                name="accountNumber"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Account number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF Contribution</label>
                            <Field
                                as="select"
                                name="cpfContribution"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Option</option>
                                <option value="full">Full CPF</option>
                                <option value="partial">Partial CPF</option>
                                <option value="none">No CPF</option>
                            </Field>
                        </div>
                    </div>
                )}

                {/* Additional Tab */}
                {activeTab === 'additional' && (
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transport Allowance</label>
                            <Field
                                name="transportAllowance"
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter amount"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Allowance</label>
                            <Field
                                name="mealAllowance"
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter amount"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Housing Allowance</label>
                            <Field
                                name="housingAllowance"
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>
                )}

                {/* Personal Tab */}
                {activeTab === 'personal' && (
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Income Tax Number</label>
                            <Field
                                name="taxNumber"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tax number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Relief</label>
                            <Field
                                name="taxRelief"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tax relief"
                            />
                        </div>
                    </div>
                )}

                {/* Employment History Tab */}
                {activeTab === 'empHistory' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Employer</label>
                                <Field
                                    name="previousEmployer"
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <Field
                                    name="previousPosition"
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Previous position"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <Field
                                    name="previousDuration"
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. 2 years"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
                            <Field
                                as="textarea"
                                name="reasonForLeaving"
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Reason for leaving previous job"
                            />
                        </div>
                    </div>
                )}

                {/* Education Tab */}
                {activeTab === 'empEducation' && (
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                            <Field
                                as="select"
                                name="highestQualification"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Qualification</option>
                                <option value="phd">PhD</option>
                                <option value="masters">Master's Degree</option>
                                <option value="bachelors">Bachelor's Degree</option>
                                <option value="diploma">Diploma</option>
                                <option value="highSchool">High School</option>
                            </Field>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                            <Field
                                name="institution"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Institution name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Graduation</label>
                            <Field
                                name="graduationYear"
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="YYYY"
                            />
                        </div>
                    </div>
                )}

                {/* Custom Fields Tab */}
                {activeTab === 'customFields' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Field 1</label>
                                <Field
                                    name="customField1"
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Custom value"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Field 2</label>
                                <Field
                                    name="customField2"
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Custom value"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Field 3</label>
                                <Field
                                    name="customField3"
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Custom value"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* MOM Integration Tab */}
                {activeTab === 'momIntegration' && (
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Work Pass Type</label>
                            <Field
                                as="select"
                                name="workPassType"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Pass Type</option>
                                <option value="ep">Employment Pass</option>
                                <option value="sp">S Pass</option>
                                <option value="wp">Work Permit</option>
                                <option value="dp">Dependent Pass</option>
                                <option value="ltvp">LTVP</option>
                            </Field>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Work Pass Number</label>
                            <Field
                                name="workPassNumber"
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Pass number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pass Expiry Date</label>
                            <DatePicker
                                selected={values.passExpiryDate ? new Date(values.passExpiryDate) : null}
                                onChange={(date) => setFieldValue('passExpiryDate', date)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholderText="Select date"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EPayrollTabs;