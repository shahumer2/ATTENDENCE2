import React, { useState } from 'react';
import { Field, ErrorMessage, FieldArray } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactSelect from 'react-select';
import { FaLock } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFieldArray } from 'formik'; // or similar for your form library
import { CustomField_LIST } from 'Constants/utils';
import { ADD_CustomField_DATA } from 'Constants/utils';
import { useSelector } from 'react-redux';
import { Fwl_LIST } from 'Constants/utils';
import useEmployee from 'hooks/useEmployee';
const ePayrollDTOTabs = ({ values, setFieldValue, appDetails, setAppDetails }) => {
     
    const { currentUser } = useSelector((state) => state.user);
    const token = currentUser?.token;
    const [activeTab, setActiveTab] = useState('basic');
    // for salary 
    const { RaceOption, bloodTypeOptions, applyOptions, periodOptions, religionOptions, nationalityOptions,EmployeeTypeOptions } = useEmployee()


    console.log(EmployeeTypeOptions, "gggggggggggggggggggggggggggggggggggg");
    const [rows, setRows] = useState([{
        mode: 'CASH',
        bankName: '',
        branchId: '',
        accountNo: '',
        percentage: 100,
    }, {
        mode: 'BANK GIRO 1',
        bankName: '',
        branchId: '',
        accountNo: '',
        percentage: 0,
    }, {
        mode: 'BANK GIRO 2',
        bankName: '',
        branchId: '',
        accountNo: '',
        percentage: 0,
    }, {
        mode: 'CHEQUE 1',
        bankName: '',
        branchId: '',
        accountNo: '',
        percentage: 0,
    }, {
        mode: 'CHEQUE 2',
        bankName: '',
        branchId: '',
        accountNo: '',
        percentage: 0,
    }]);
    const bankOptions = [
        { value: 'CITIBANK', label: 'CITIBANK N.A.' },
        { value: 'STANDARD_CHARTERED', label: 'Standard Chartered Bank (Singapore) Ltd.' },
        // Add more bank options as needed
    ];

    const handleBankChange = (index, selectedOption) => {
        const newRows = [...rows];
        newRows[index].bankName = selectedOption ? selectedOption.label : '';
        setRows(newRows);
    };

    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const initialValues = {
        reminders: [
            { refNos: '', expiryDate: '', desc: '' }
        ],
        contracts: [
            { contractNo: '', details: '', startDate: '', endDate: '' }
        ],
        // Add other initial values for your form fields
    };


    const tabs = [
        { id: 'basic', label: 'Basic' },
        { id: 'additional', label: 'Additional' },
        { id: 'personal', label: 'Personal' },
        { id: 'empHistory', label: 'Employment History' },
        { id: 'empEducation', label: 'Education' },
        { id: 'customFields', label: 'Custom Fields' },
        { id: 'momIntegration', label: 'MOM Integration' }
    ];
    // for fundsssss
    const [funds, setFunds] = useState([
        { code: 'SDF', name: 'SKILL DEVELOPMENT FUND', selected: false, apply: null, amount: '' },
        { code: 'MBMF', name: 'MBMF', selected: false, apply: null, amount: '' },
        { code: 'SINDA', name: 'SINDA', selected: false, apply: null, amount: '' },
        { code: 'CDAC', name: 'CDAC', selected: false, apply: null, amount: '' },
        { code: 'ECF', name: 'EURASIAN COMMUNITY FUND', selected: false, apply: null, amount: '' },
        { code: 'CC', name: 'COMMUNITY CHEST', selected: false, apply: null, amount: '' }
    ]);
    const payDayGroupOptions = [
        { value: "A", label: "(NO LONGER TO USE) 5 DAYS WORK" },
        { value: "6DAYS", label: "(NO LONGER TO USE) 6 DAYS WORK" },
        { value: "5 DAYS", label: "5 DAYS WORK PER WEEK" },
        { value: "5 MID", label: "5 DAYS WORK PER WEEK MID" },
        { value: "5.5MID", label: "5.5 DAY WORK PER WEEK MID" },
        { value: "5.5OFF", label: "5.5 DAYS WORK PER WEEK" },
        { value: "N", label: "SHIFT WORKER" }
    ];
    const handleFundSelect = (index) => {
        const updatedFunds = [...funds];
        updatedFunds[index].selected = !updatedFunds[index].selected;
        // Clear values when unselected
        if (!updatedFunds[index].selected) {
            updatedFunds[index].apply = null;
            updatedFunds[index].amount = '';
        }
        setFunds(updatedFunds);
    };

    const handleApplyChange = (index, option) => {
        const updatedFunds = [...funds];
        updatedFunds[index].apply = option;
        setFunds(updatedFunds);
    };

    const handleAmountChange = (index, value) => {
        const updatedFunds = [...funds];
        updatedFunds[index].amount = value;
        setFunds(updatedFunds);
    };
    //   const handleSubmit = () => {
    //     // Get only selected funds with their values
    //     const selectedFunds = funds.filter(fund => fund.selected)
    //       .map(({ code, name, apply, amount }) => ({ 
    //         code, 
    //         name, 
    //         apply: apply ? apply.value : null, 
    //         amount: parseFloat(amount) || 0 
    //       }));

    //     console.log("Selected Funds:", selectedFunds);
    //     // Here you would typically send this data to your API
    //   };
    //custom fieldsss

    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'view'
    const [newCustomField, setNewCustomField] = useState({
        fieldName: '',
        fieldType: '',

        reminderDays: ''
    });

    // Fetch custom fields from API
    const { data: customFieldsData, isLoading } = useQuery({
        queryKey: ['customFields', page],
        queryFn: async () => {
            const response = await fetch(`${CustomField_LIST}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch custom fields');
            return response.json();
        },
        keepPreviousData: true,
        onSuccess: (data) => {
            // When data loads, add all fields to the form automatically
            const fieldsToAdd = data.content.map(field => ({
                fieldId: field.id,
                fieldName: field.fieldName,
                fieldType: field.fieldType,
                value: field.fieldType === 'yesno' ? 'yes' : '',
                options: field.options || '',
                reminderDays: field.reminderDays || ''
            }));

            setFieldValue('customFields', fieldsToAdd);
        }
    });


    const { data: fwlOption, isLoading: optionsLoading } = useQuery({
        queryKey: ['fwlOption'],
        queryFn: async () => {
            try {
                const response = await fetch(`${Fwl_LIST}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching FWL options:', error);
                throw error;
            }
        },
        enabled: !!token,
        select: (data) => {
            if (!Array.isArray(data.content)) {
                console.error('Data is not an array:', data);
                return [
                    { label: 'Select', value: null, id: null }
                ];
            }

            return [
                { label: 'Select', value: null, id: null },
                ...data.content.map(fwl => ({
                    label: fwl.fwlName,
                    value: fwl.fwlName,  // You can use fwl.id as value if preferred
                    id: fwl.id
                }))
            ];
        }
    });

    // Add custom field mutation
    const addFieldMutation = useMutation({
        mutationFn: async (fieldData) => {
            const response = await fetch(`${ADD_CustomField_DATA}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fieldData),
            });
            if (!response.ok) throw new Error('Failed to add custom field');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['customFields']);
            setModalMode('view');
        }
    });

    const handleAddCustomField = () => {
        addFieldMutation.mutate(newCustomField);
    };

    const removeCustomField = (index) => {
        const newFields = [...values.customFields];
        newFields.splice(index, 1);
        setFieldValue('customFields', newFields);
    };

    const handleAddToForm = (field) => {
        const fieldExists = values.customFields?.some(f => f.fieldId === field.id);
        if (!fieldExists) {
            const fieldToAdd = {
                fieldId: field.id,
                fieldName: field.fieldName,
                fieldType: field.fieldType,
                value: field.fieldType === 'yesno' ? 'yes' : '',
                options: field.options || '',
                reminderDays: field.reminderDays || ''
            };

            setFieldValue('customFields', [...(values.customFields || []), fieldToAdd]);
        }
        setShowCustomFieldModal(false);
    };




    //for mom
    const [isPerformingHR, setIsPerformingHR] = useState(false);
    const hrFunctionOptions = [
        { value: 'Talent Attraction', label: 'Talent Attraction' },
        { value: 'Talent Management', label: 'Talent Management' },
        { value: 'Employee Experience and Relations', label: 'Employee Experience and Relations' },
        { value: 'Learning and Organisation Development', label: 'Learning and Organisation Development' },
        { value: 'HR Business Partner', label: 'HR Business Partner' },
        { value: 'Performance and Rewards', label: 'Performance and Rewards' },
        { value: 'Operations and Technology', label: 'Operations and Technology' }
    ];

    const hrJobLevelOptions = [
        { value: 'CHRO', label: 'CHRO' },
        { value: 'Head', label: 'Head' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Executive', label: 'Executive' },
        { value: 'Associate', label: 'Associate' }
    ];

    //

    const employerCPFOptions = [
        { value: '201307250CPTE01', label: '201307250CPTE01' },

    ];
    const employmentTypeOptions = [
        { id: 1, value: 'OVERSEAS NETWORKS & EXPERTISE PASS', label: 'OVERSEAS NETWORKS & EXPERTISE PASS' },
        { id: 2, value: 'PERSONALISED EMPLOYMENT PASS', label: 'PERSONALISED EMPLOYMENT PASS' },
        { id: 3, value: 'TRAINING EMPLOYMENT PASS', label: 'TRAINING EMPLOYMENT PASS' },
        { id: 4, value: 'TRAINING WORK PERMIT', label: 'TRAINING WORK PERMIT' },
        { id: 5, value: 'LONG TERM VISIT PASS', label: 'LONG TERM VISIT PASS' },
        { id: 6, value: 'DEPENDANT’S PASS', label: 'DEPENDANT’S PASS' },
        { id: 7, value: 'OTHERS', label: 'OTHERS' },
        { id: 8, value: '201307250CPTE01', label: '201307250CPTE01' }
    ];
    const idTypeOptions = [
        { value: '4', label: 'Work Permit No' },
        { value: '6', label: 'Passport No.(for non-resident director and seaman only)' },
        { value: '1', label: 'NRIC' },
        { value: '5', label: 'Malaysian I/C(for non-resident director and seaman only)' },
        { value: '3', label: 'Immigration File Ref' },
        { value: '2', label: 'FIN' },
        { value: '201307250CPTE01', label: '201307250CPTE01' } // Keeping your original option
    ];


    console.log(fwlOption, ")))))))")

    const premiseTypeOptions = [
        { value: 'type1', label: 'Type 1' },
        { value: 'type2', label: 'Type 2' },
        // ...
    ];

    const employeeTypeOptions = [
        { value: 'fulltime', label: 'Full-time' },
        { value: 'parttime', label: 'Part-time' },
        // ...
    ];
    const paymentModeOptions = [
        { value: 'Month', label: 'Month' },
        { value: 'Day', label: 'Day' },
        { value: 'Hour', label: 'Hour' },
        { value: 'Piece Based', label: 'Piece Based' },
        { value: 'Commision', label: 'Commision' },
        { value: 'Others', label: 'Others' },

    ];
    const occupationGroupOptions = [
        { value: 'Legislators_Senior_Officials_Managers', label: 'Legislators, Senior Officials and Managers' },
        { value: 'Professionals', label: 'Professionals' },
        { value: 'Associate_Professionals_Technicians', label: 'Associate Professionals and Technicians' },
        { value: 'Clerical_Support_Workers', label: 'Clerical Support Workers' },
        { value: 'Service_Sales_Workers', label: 'Service and Sales Workers' },
        { value: 'Agricultural_Fishery_Workers', label: 'Agricultural and Fishery Workers' },
        { value: 'Craftsmen_Related_Trades_Workers', label: 'Craftsmen and Related Trades Workers' },
        { value: 'Plant_Machine_Operators_Assemblers', label: 'Plant and Machine Operators and Assemblers' },
        { value: 'Cleaners_Labourers', label: 'Cleaners, Labourers and Related Workers' },
        { value: 'Armed_Forces_Diplomatic_Personnel', label: 'Armed Forces and Foreign Diplomatic Personnel' }
    ];

    const jobLevelOptions = [
        { value: 'Not_Applicable', label: 'Not Applicable' },

        // Cleaning - Conservancy
        { value: 'Cleaning_General_Cleaner_Conservancy', label: '[Cleaning] General Cleaner (Conservancy)' },
        { value: 'Cleaning_Restroom_Cleaner_Conservancy', label: '[Cleaning] Restroom Cleaner (Conservancy)' },
        { value: 'Cleaning_Refuse_Collector_Conservancy', label: '[Cleaning] Refuse Collector (Conservancy)' },
        { value: 'Cleaning_Mechanical_Drivers_Conservancy', label: '[Cleaning] Mechanical Drivers (Conservancy)' },
        { value: 'Cleaning_Multiskilled_Cleaner_Machine_Operator_Conservancy', label: '[Cleaning] Multi-skilled Cleaner cum Machine Operator (Conservancy)' },
        { value: 'Cleaning_Cleaning_Supervisory_Conservancy', label: '[Cleaning] Cleaning Supervisory (Conservancy)' },
        { value: 'Cleaning_Truck_Drivers_Conservancy', label: '[Cleaning] Truck Drivers (Conservancy)' },

        // Cleaning - F&B Establishment
        { value: 'Cleaning_General_Cleaner_FB', label: '[Cleaning] General Cleaner (F&B Establishment)' },
        { value: 'Cleaning_TableTop_Cleaner_FB', label: '[Cleaning] Table-Top Cleaner (F&B Establishment)' },
        { value: 'Cleaning_Dishwasher_FB', label: '[Cleaning] Dishwasher (F&B Establishment)' },
        { value: 'Cleaning_Refuse_Collector_FB', label: '[Cleaning] Refuse Collector (F&B Establishment)' },
        { value: 'Cleaning_Restroom_Cleaner_FB', label: '[Cleaning] Restroom Cleaner (F&B Establishment)' },
        { value: 'Cleaning_Multiskilled_Cleaner_Machine_Operator_FB', label: '[Cleaning] Multi-skilled Cleaner cum Machine Operator (F&B Establishment)' },
        { value: 'Cleaning_Cleaning_Supervisor_FB', label: '[Cleaning] Cleaning Supervisor (F&B Establishment)' },

        // Cleaning - Office & Commercial
        { value: 'Cleaning_General_Cleaner_Office', label: '[Cleaning] General Cleaner (Office & Commercial)' },
        { value: 'Cleaning_Indoor_Cleaner_Office', label: '[Cleaning] Indoor Cleaner (Office & Commercial)' },
        { value: 'Cleaning_Healthcare_Cleaner_Office', label: '[Cleaning] Healthcare Cleaner (Office & Commercial)' },
        { value: 'Cleaning_Outdoor_Cleaner_Office', label: '[Cleaning] Outdoor Cleaner (Office & Commercial)' },
        { value: 'Cleaning_Restroom_Cleaner_Office', label: '[Cleaning] Restroom Cleaner (Office & Commercial)' },
        { value: 'Cleaning_Multiskilled_Cleaner_Machine_Operator_Office', label: '[Cleaning] Multi-skilled Cleaner cum Machine Operator (Office & Commercial)' },
        { value: 'Cleaning_Cleaning_Supervisor_Office', label: '[Cleaning] Cleaning Supervisor (Office & Commercial)' },

        // Landscape
        { value: 'Landscape_Landscape_Worker', label: '[Landscape] Landscape Worker' },
        { value: 'Landscape_Landscape_Technician', label: '[Landscape] Landscape Technician' },
        { value: 'Landscape_Assistant_Landscape_Supervisor', label: '[Landscape] Assistant Landscape Supervisor' },
        { value: 'Landscape_Landscape_Supervisor', label: '[Landscape] Landscape Supervisor' },

        // Lift & Escalator
        { value: 'LiftEscalator_Assistant_Specialist', label: '[Lift & Escalator] Assistant Specialist (Lift & Escalator)' },
        { value: 'LiftEscalator_Specialist', label: '[Lift & Escalator] Specialist (Lift & Escalator)' },
        { value: 'LiftEscalator_Senior_Specialist', label: '[Lift & Escalator] Senior Specialist (Lift & Escalator)' },
        { value: 'LiftEscalator_Supervisor', label: '[Lift & Escalator] Supervisor (Lift & Escalator)' },
        { value: 'LiftEscalator_Principal_Specialist', label: '[Lift & Escalator] Principal Specialist (Lift & Escalator)' },
        { value: 'LiftEscalator_Senior_Supervisor', label: '[Lift & Escalator] Senior Supervisor (Lift & Escalator)' },
        { value: 'LiftEscalator_Master_Specialist', label: '[Lift & Escalator] (Specialist) Master Specialist (Lift & Escalator)' },

        // Security
        { value: 'Security_Security_Officer', label: '[Security] Security Officer' },
        { value: 'Security_Senior_Security_Officer', label: '[Security] Senior Security Officer' },
        { value: 'Security_Security_Supervisor', label: '[Security] Security Supervisor' },
        { value: 'Security_Senior_Security_Supervisor', label: '[Security] Senior Security Supervisor' },

        // Waste Management - Waste Collection
        { value: 'WasteManagement_Crew_Waste_Collection', label: '[Waste Management] Crew (Waste Collection)' },
        { value: 'WasteManagement_Senior_Crew_Waste_Collection', label: '[Waste Management] Senior Crew (Waste Collection)' },
        { value: 'WasteManagement_Team_Lead_Waste_Collection', label: '[Waste Management] Team Lead (Waste Collection)' },
        { value: 'WasteManagement_Supervisor_Waste_Collection', label: '[Waste Management] Supervisor (Waste Collection)' },
        { value: 'WasteManagement_Driver_Waste_Collection', label: '[Waste Management] Driver (Waste Collection)' },
        { value: 'WasteManagement_Hooklift_Driver_Waste_Collection', label: '[Waste Management] Hooklift Driver (Waste Collection)' },
        { value: 'WasteManagement_Senior_Driver_Waste_Collection', label: '[Waste Management] Senior Driver (Waste Collection)' },

        // Waste Management - Materials Recovery
        { value: 'WasteManagement_Sorter_Materials_Recovery', label: '[Waste Management] Sorter (Materials Recovery)' },
        { value: 'WasteManagement_Senior_Sorter_Materials_Recovery', label: '[Waste Management] Senior Sorter (Materials Recovery)' },
        { value: 'WasteManagement_Machine_Operator_Materials_Recovery', label: '[Waste Management] Machine Operator (Materials Recovery)' },
        { value: 'WasteManagement_Team_Lead_Materials_Recovery', label: '[Waste Management] Team Lead (Materials Recovery)' },
        { value: 'WasteManagement_Plant_Supervisor_Materials_Recovery', label: '[Waste Management] Plant Supervisor (Materials Recovery)' },

        // Retail
        { value: 'Retail_Cashier', label: '[Retail] Cashier' },
        { value: 'Retail_Retail_Assistant', label: '[Retail] Retail Assistant' },
        { value: 'Retail_Senior_Cashier', label: '[Retail] Senior Cashier' },
        { value: 'Retail_Senior_Retail_Assistant', label: '[Retail] Senior Retail Assistant' },
        { value: 'Retail_Assistant_Retail_Supervisor', label: '[Retail] Assistant Retail Supervisor' },
        { value: 'Retail_Retail_Supervisor', label: '[Retail] Retail Supervisor' },
        { value: 'Retail_Retail_Manager', label: '[Retail] Retail Manager' },

        // OPW
        { value: 'OPW_Administrative_Assistant', label: '[OPW] Administrative Assistant' },
        { value: 'OPW_Administrative_Executive', label: '[OPW] Administrative Executive' },
        { value: 'OPW_Administrative_Supervisor', label: '[OPW] Administrative Supervisor' },
        { value: 'OPW_General_Driver', label: '[OPW] General Driver' },
        { value: 'OPW_Specialised_Driver', label: '[OPW] Specialised Driver' },

        // FS PWM
        { value: 'FS_PWM_FoodDrink_Stall_Assistant_CatA', label: '[FS PWM] Food/Drink Stall Assistant - Category A' },
        { value: 'FS_PWM_Food_Service_Counter_Attendant_CatA', label: '[FS PWM] Food Service Counter Attendant - Category A' },
        { value: 'FS_PWM_Kitchen_Assistant_CatA', label: '[FS PWM] Kitchen Assistant - Category A' },
        { value: 'FS_PWM_Cook_CatA', label: '[FS PWM] Cook - Category A' },
        { value: 'FS_PWM_Senior_Cook_CatA', label: '[FS PWM] Senior Cook - Category A' },
        { value: 'FS_PWM_Kitchen_Assistant_CatB', label: '[FS PWM] Kitchen Assistant - Category B' },
        { value: 'FS_PWM_Cook_CatB', label: '[FS PWM] Cook - Category B' },
        { value: 'FS_PWM_Senior_Cook_CatB', label: '[FS PWM] Senior Cook - Category B' },
        { value: 'FS_PWM_Waiter_CatB', label: '[FS PWM] Waiter - Category B' },
        { value: 'FS_PWM_Waiter_Supervisor_CatB', label: '[FS PWM] Waiter Supervisor - Category B' },
        { value: 'FS_PWM_Manager_CatB', label: '[FS PWM] Manager - Category B' }
    ];

    const yesNoOptions = [
        {value: 'yes', label: 'Yes' },
        {value: 'no', label: 'No' }
        ];
        const jobRoleOptions = [
            { value: 'Actuarial_Other_General_Insn', label: 'Actuarial - Other (General Insn)' },
            { value: 'Actuarial_Other_Life_Insn', label: 'Actuarial - Other (Life Insn)' },
            { value: 'Actuarial_Pricing_General_Insn', label: 'Actuarial - Pricing (General Insn)' },
            { value: 'Actuarial_Pricing_Life_Insn', label: 'Actuarial - Pricing (Life Insn)' },
            { value: 'Actuarial_Product_Development_General_Insn', label: 'Actuarial - Product Development (General Insn)' },
            { value: 'Actuarial_Valuation_Life_Insn', label: 'Actuarial - Valuation (Life Insn)' },
            { value: 'Agency_Manager', label: 'Agency Manager' },
            { value: 'Applications_Developer_Associate_Software_Engineer', label: 'Applications Developer/ Associate Software Engineer' },
            { value: 'Account_Operations', label: 'Account Operations' },
            { value: 'Actuarial_Product_Development_Life_Insn', label: 'Actuarial - Product Development (Life Insn)' },
            { value: 'Actuarial_Valuation_General_Insn', label: 'Actuarial - Valuation (General Insn)' }
          ];
          const seniorityOptions = [
            { value: 'Non_Executive', label: 'Non-Executive' },
            { value: 'Analyst_Associate', label: 'Analyst/Associate' },
            { value: 'AVP_VP', label: 'AVP/VP' },
            { value: 'SVP_Director', label: 'SVP/Director' },
            { value: 'MD_Above_Non_Manager', label: 'MD & Above (Non-Manager)' },
            { value: 'MD_Above_Manager', label: 'MD & Above (Manager)' },
            { value: 'MD_Above_Leader', label: 'MD & Above (Leader)' }
          ];
          const businessAreaOptions = [
            { value: 'Accountancy', label: 'Accountancy' },
            { value: 'Asset_Management', label: 'Asset Management' },
            { value: 'Corporate_Banking', label: 'Corporate Banking' },
            { value: 'Human_Resource', label: 'Human Resource' },
            { value: 'Infocomm_Technology', label: 'Infocomm Technology' },
            { value: 'Insurance', label: 'Insurance' },
            { value: 'Investment_Banking', label: 'Investment Banking' },
            { value: 'Private_Banking_Wealth_Management', label: 'Private Banking and Wealth Management' },
            { value: 'Retail_Banking', label: 'Retail Banking' },
            { value: 'Sustainability_Standalone', label: 'Sustainability (Standalone Sustainability Team)' },
            { value: 'Others', label: 'Others' }
          ];
          const geoCoverageOptions = [
            { value: 'Global_50_Percent', label: 'Global (At least 50%)' },
            { value: 'Regional_50_Percent', label: 'Regional (At least 50%)' },
            { value: 'Domestic_100_Percent', label: 'Domestic (100%)' },
            { value: 'Domestic_50_to_99_Percent', label: 'Domestic (At least 50%, but less than 100%)' }
          ];


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tab headers */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={(e) =>{
                                e.preventDefault();
                             setActiveTab(tab.id)}}

                                
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
                    <>
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>BASIC DETAILS</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-3 gap-6">
                                {/* Short Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.shortName}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                shortName: e.target.value
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter short name"
                                    />
                                </div>

                                {/* Birth Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date*</label>
                                    <input
                                        type="date"
                                        value={appDetails.ePayrollDTO.birthDate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                birthDate: e.target.value
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* CPF/FWL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF/FWL</label>
                                    <ReactSelect
                                        value={fwlOption?.find(option => option.id === appDetails.ePayrollDTO.fwlId)}
                                        onChange={(option) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                fwlId: option?.id || null
                                            }
                                        })}
                                        options={fwlOption || []}
                                        getOptionValue={(option) => option.id}  // This tells ReactSelect to use the id for value comparison
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select"
                                        isClearable
                                    />
                                </div>

                                {/* PR Approval Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PR Approval Date*</label>
                                    <input
                                        type="date"
                                        value={appDetails.ePayrollDTO.prApprovalDate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                prApprovalDate: e.target.value
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Pay Day Group */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pay Day Group</label>
                                    <ReactSelect
                                        value={payDayGroupOptions?.find(option => option.value === appDetails.ePayrollDTO.payDayGroup)}
                                        onChange={(option) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                payDayGroup: option?.value || ''
                                            }
                                        })}
                                        options={payDayGroupOptions}
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select"
                                        isClearable
                                    />
                                </div>

                                {/* Last Pay Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Pay Date *</label>
                                    <input
                                        type="date"
                                        value={appDetails.ePayrollDTO.lastPayDate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                lastPayDate: e.target.value
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
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
                                    type="button"
                                    className="bg-blue-950 text-white px-6 h-9 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out shadow-sm mr-4 font-sm"
                                >
                                    CPF OPTIONS
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-950 text-white px-6 h-9 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out shadow-sm mr-4 font-sm"
                                >
                                    CUSTOM OT RATE <span className='text-red-600'>*</span>
                                </button>
                            </div>
                        </div>

                        {/* Salary Details */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Salary Details</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-3 gap-6">
                                {/* Basic Salary */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                                    <input
                                        type="number"
                                        value={appDetails.ePayrollDTO.basicSalary}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                basicSalary: parseFloat(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                {/* Increment */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Increment</label>
                                    <input
                                        type="number"
                                        value={appDetails.ePayrollDTO.increment}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                increment: parseFloat(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                {/* Increment Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Increment Date</label>
                                    <input
                                        type="date"
                                        value={appDetails.ePayrollDTO.incrementDate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                incrementDate: e.target.value
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Flat Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Flat Rate</label>
                                    <input
                                        type="number"
                                        value={appDetails.ePayrollDTO.flatRate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                flatRate: parseFloat(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                {/* Hourly Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                                    <input
                                        type="number"
                                        value={appDetails.ePayrollDTO.hourlyRate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                hourlyRate: parseFloat(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                {/* Daily Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate</label>
                                    <input
                                        type="number"
                                        value={appDetails.ePayrollDTO.dailyRate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                dailyRate: parseFloat(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                {/* Total Salary */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Salary</label>
                                    <input
                                        type="number"
                                        value={appDetails.ePayrollDTO.totalSalary}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                totalSalary: parseFloat(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                {/* Monthly Rate Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={appDetails.ePayrollDTO.monthlyRate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                monthlyRate: e.target.checked
                                            }
                                        })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">Monthly Rate</label>
                                </div>

                                {/* VIP Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={appDetails.ePayrollDTO.vip}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                vip: e.target.checked
                                            }
                                        })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">VIP</label>
                                </div>

                                {/* OT Rate Capped Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={appDetails.ePayrollDTO.otRateCapped}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                otRateCapped: e.target.checked
                                            }
                                        })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">OT Rate Capped</label>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Employment Details</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-3 gap-6">
                                {/* Employer CPF */}
                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer CPF *</label>
                                    <ReactSelect
                                        value={employerCPFOptions?.find(option => option.value === appDetails.ePayrollDTO.employeerCPF)}
                                        onChange={(option) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                employeerCPF: option?.value || ''
                                            }
                                        })}
                                        options={employerCPFOptions || []}
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select Employer CPF"
                                        isClearable
                                    />
                                </div>

                                {/* Employment Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                                    <ReactSelect
                                        value={EmployeeTypeOptions?.find(option => option.value === appDetails.ePayrollDTO.employeeTypeId)}
                                        onChange={(option) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                employeeTypeId: option?.id || null
                                            }
                                        })}
                                        options={EmployeeTypeOptions || []}
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select Employment Type"
                                        isClearable
                                    />
                                </div>

                                {/* ID Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                                    <ReactSelect
                                        value={idTypeOptions?.find(option => option.value === appDetails.ePayrollDTO.idType)}
                                        onChange={(option) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                idType: option?.label || ''
                                            }
                                        })}
                                        options={idTypeOptions || []}
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select ID Type"
                                        isClearable
                                    />
                                </div>

                                {/* NRIC/Work Permit/FIN */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NRIC/Work Permit/FIN *</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.nircWorkPermitFin}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                nircWorkPermitFin: e.target.value
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter NRIC/Work Permit/FIN"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Salary Pay Mode */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Salary Pay Mode</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className='border border-gray-400 rounded-md p-4 mb-5'>
                                <h2 className='mb-2 font-semibold'>Salary Pay Mode</h2>
                                <hr className='border border-l-black shadow-2xl mb-2' />
                                <table className="min-w-full shadow-xl rounded-md divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Mode</th>
                                            <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Bank Name</th>
                                            <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Branch ID</th>
                                            <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">A/C No</th>
                                            <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {appDetails.ePayrollDTO.salaryPayMode.map((row, index) => (
                                            <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
                                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{row.mode}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                    <ReactSelect
                                                        options={bankOptions}
                                                        onChange={(option) => {
                                                            const updatedPayModes = [...appDetails.ePayrollDTO.salaryPayMode];
                                                            updatedPayModes[index].bankName = option?.label || '';
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    salaryPayMode: updatedPayModes
                                                                }
                                                            });
                                                        }}
                                                        isClearable
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={row.branchId}
                                                        onChange={(e) => {
                                                            const updatedPayModes = [...appDetails.ePayrollDTO.salaryPayMode];
                                                            updatedPayModes[index].branchId = e.target.value;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    salaryPayMode: updatedPayModes
                                                                }
                                                            });
                                                        }}
                                                        className="border border-gray-300 rounded-md p-1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={row.accountNo}
                                                        onChange={(e) => {
                                                            const updatedPayModes = [...appDetails.ePayrollDTO.salaryPayMode];
                                                            updatedPayModes[index].accountNo = e.target.value;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    salaryPayMode: updatedPayModes
                                                                }
                                                            });
                                                        }}
                                                        className="border border-gray-300 rounded-md p-1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                    <input
                                                        type="number"
                                                        value={row.percentage}
                                                        onChange={(e) => {
                                                            const updatedPayModes = [...appDetails.ePayrollDTO.salaryPayMode];
                                                            updatedPayModes[index].percentage = parseFloat(e.target.value) || 0;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    salaryPayMode: updatedPayModes
                                                                }
                                                            });
                                                        }}
                                                        className="border border-gray-300 rounded-md p-1"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* <div className="mt-4">
          <button 
            onClick={() => console.log(appDetails.ePayrollDTO.salaryPayMode)} 
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Save
          </button>
        </div> */}
                            </div>
                        </div>
                    </>
                )}

                {/* Additional Tab */}
                {activeTab === 'additional' && (
                    <>
                        <div className='grid grid-cols-2 flex-2 gap-5'>
                            {/* Employee Information */}
                            <div className='border border-gray-400 rounded-md p-4 mb-5'>
                                <h2 className='mb-2 font-semibold'>Employee Information</h2>
                                <hr className='border border-l-black shadow-2xl mb-2' />
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Nationality */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nationality*</label>
                                        <ReactSelect
                                            value={nationalityOptions.find(opt => opt.value === appDetails.ePayrollDTO.additionalEmployee.nationalityId)}
                                            onChange={(option) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        nationalityId: option?.id || null
                                                    }
                                                }
                                            })}
                                            options={nationalityOptions}
                                            className="bg-white dark:bg-form-Field"
                                            classNamePrefix="react-select"
                                            placeholder="Select"
                                            isClearable
                                        />
                                    </div>

                                    {/* Religion */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                                        <ReactSelect
                                            value={religionOptions.find(opt => opt.value === appDetails.ePayrollDTO.additionalEmployee.religionId)}
                                            onChange={(option) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        religionId: option?.id || null
                                                    }
                                                }
                                            })}
                                            options={religionOptions}
                                            className="bg-white dark:bg-form-Field"
                                            classNamePrefix="react-select"
                                            placeholder="Select"
                                            isClearable
                                        />
                                    </div>

                                    {/* Race */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                                        <ReactSelect
                                            value={RaceOption.find(opt => opt.value === appDetails.ePayrollDTO.additionalEmployee.raceId)}
                                            onChange={(option) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        raceId: option?.id || null
                                                    }
                                                }
                                            })}
                                            options={RaceOption}
                                            className="bg-white dark:bg-form-Field"
                                            classNamePrefix="react-select"
                                            placeholder="Select"
                                            isClearable
                                        />
                                    </div>

                                    {/* Foreign ID No */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Foreign ID No*</label>
                                        <input
                                            type="text"
                                            value={appDetails.ePayrollDTO.additionalEmployee.forignIdNO}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        forignIdNO: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Passport Expiry */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry*</label>
                                        <input
                                            type="date"
                                            value={appDetails.ePayrollDTO.additionalEmployee.pssportExpiry}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        pssportExpiry: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Blood Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                                        <ReactSelect
                                            value={bloodTypeOptions.find(opt => opt.value === appDetails.ePayrollDTO.additionalEmployee.bloodType)}
                                            onChange={(option) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        bloodType: option?.value || ''
                                                    }
                                                }
                                            })}
                                            options={bloodTypeOptions}
                                            className="bg-white dark:bg-form-Field"
                                            classNamePrefix="react-select"
                                            placeholder="Select"
                                            isClearable
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* E.P / Work Permit Details */}
                            <div className='border border-gray-400 rounded-md p-4 mb-5'>
                                <h2 className='mb-2 font-semibold'>E.P / Work Permit Details</h2>
                                <hr className='border border-l-black shadow-2xl mb-2' />
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Work Permit No */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">E.P / Work Permit No*</label>
                                        <input
                                            type="text"
                                            value={appDetails.ePayrollDTO.additionalEmployee.workPermitNumber}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        workPermitNumber: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Issue Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date*</label>
                                        <input
                                            type="date"
                                            value={appDetails.ePayrollDTO.additionalEmployee.issueDate}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        issueDate: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Expiry Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
                                        <input
                                            type="date"
                                            value={appDetails.ePayrollDTO.additionalEmployee.expiryDate}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        expiryDate: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Extension Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Extension Date *</label>
                                        <input
                                            type="date"
                                            value={appDetails.ePayrollDTO.additionalEmployee.extensionDate || ''}
                                            onChange={(e) => setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    additionalEmployee: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                        extensionDate: e.target.value || null
                                                    }
                                                }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Allowance Section */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Allowance</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-3 gap-6">
                                {/* Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.additionalEmployee.allowanceEmp.code}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    allowanceEmp: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee.allowanceEmp,
                                                        code: e.target.value
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.additionalEmployee.allowanceEmp.name}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    allowanceEmp: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee.allowanceEmp,
                                                        name: e.target.value
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        value={appDetails.ePayrollDTO.additionalEmployee.allowanceEmp.amount}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    allowanceEmp: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee.allowanceEmp,
                                                        amount: parseFloat(e.target.value) || 0
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Apply */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apply</label>
                                    <ReactSelect
                                        value={applyOptions.find(opt => opt.value === appDetails.ePayrollDTO.additionalEmployee.allowanceEmp.apply)}
                                        onChange={(option) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    allowanceEmp: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee.allowanceEmp,
                                                        apply: option?.value || ''
                                                    }
                                                }
                                            }
                                        })}
                                        options={applyOptions}
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select"
                                        isClearable
                                    />
                                </div>

                                {/* Period */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                                    <ReactSelect
                                        value={periodOptions.find(opt => opt.value === appDetails.ePayrollDTO.additionalEmployee.allowanceEmp.period)}
                                        onChange={(option) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    allowanceEmp: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee.allowanceEmp,
                                                        period: option?.value || ''
                                                    }
                                                }
                                            }
                                        })}
                                        options={periodOptions}
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select"
                                        isClearable
                                    />
                                </div>

                                {/* From Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                    <input
                                        type="date"
                                        value={appDetails.ePayrollDTO.additionalEmployee.allowanceEmp.fromDate}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    allowanceEmp: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee.allowanceEmp,
                                                        fromDate: e.target.value
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* To Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                    <input
                                        type="date"
                                        value={appDetails.ePayrollDTO.additionalEmployee.allowanceEmp.toDate || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    allowanceEmp: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee.allowanceEmp,
                                                        toDate: e.target.value || null
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* CPF */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                    <ReactSelect
                                        value={employerCPFOptions.find(opt => opt.value === appDetails.ePayrollDTO.additionalEmployee.allowanceEmp.cpf)}
                                        onChange={(option) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    allowanceEmp: {
                                                        ...appDetails.ePayrollDTO.additionalEmployee.allowanceEmp,
                                                        cpf: option?.value || ''
                                                    }
                                                }
                                            }
                                        })}
                                        options={employerCPFOptions}
                                        className="bg-white dark:bg-form-Field"
                                        classNamePrefix="react-select"
                                        placeholder="Select"
                                        isClearable
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Other Reminder */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <div className='flex justify-between items-center mb-2'>
                                <h2 className='font-semibold'>Other Reminders</h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                additionalEmployee: {
                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                    otherReminders: [
                                                        ...(appDetails.ePayrollDTO.additionalEmployee.otherReminders || []),
                                                        {
                                                            referenceNumber: '',
                                                            expiryDate: '',
                                                            description: ''
                                                        }
                                                    ]
                                                }
                                            }
                                        });
                                    }}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Add Reminder
                                </button>
                            </div>
                            <hr className='border border-gray-300 mb-2' />
                            <div className='space-y-4'>
                                {(appDetails.ePayrollDTO.additionalEmployee.otherReminders || []).map((reminder, index) => (
                                    <div key={index} className='grid grid-cols-12 gap-4 items-end'>
                                        <div className='col-span-3'>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>Ref. Nos*</label>
                                            <input
                                                type='text'
                                                value={reminder.referenceNumber}
                                                onChange={(e) => {
                                                    const newReminders = [...appDetails.ePayrollDTO.additionalEmployee.otherReminders];
                                                    newReminders[index].referenceNumber = e.target.value;
                                                    setAppDetails({
                                                        ...appDetails,
                                                        ePayrollDTO: {
                                                            ...appDetails.ePayrollDTO,
                                                            additionalEmployee: {
                                                                ...appDetails.ePayrollDTO.additionalEmployee,
                                                                otherReminders: newReminders
                                                            }
                                                        }
                                                    });
                                                }}
                                                className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                                            />
                                        </div>
                                        <div className='col-span-3'>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>Expiry Date*</label>
                                            <input
                                                type='date'
                                                value={reminder.expiryDate}
                                                onChange={(e) => {
                                                    const newReminders = [...appDetails.ePayrollDTO.additionalEmployee.otherReminders];
                                                    newReminders[index].expiryDate = e.target.value;
                                                    setAppDetails({
                                                        ...appDetails,
                                                        ePayrollDTO: {
                                                            ...appDetails.ePayrollDTO,
                                                            additionalEmployee: {
                                                                ...appDetails.ePayrollDTO.additionalEmployee,
                                                                otherReminders: newReminders
                                                            }
                                                        }
                                                    });
                                                }}
                                                className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                                            />
                                        </div>
                                        <div className='col-span-5'>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>Description*</label>
                                            <input
                                                type='text'
                                                value={reminder.description}
                                                onChange={(e) => {
                                                    const newReminders = [...appDetails.ePayrollDTO.additionalEmployee.otherReminders];
                                                    newReminders[index].description = e.target.value;
                                                    setAppDetails({
                                                        ...appDetails,
                                                        ePayrollDTO: {
                                                            ...appDetails.ePayrollDTO,
                                                            additionalEmployee: {
                                                                ...appDetails.ePayrollDTO.additionalEmployee,
                                                                otherReminders: newReminders
                                                            }
                                                        }
                                                    });
                                                }}
                                                className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                                            />
                                        </div>
                                        <div className='col-span-1'>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newReminders = [...appDetails.ePayrollDTO.additionalEmployee.otherReminders];
                                                    newReminders.splice(index, 1);
                                                    setAppDetails({
                                                        ...appDetails,
                                                        ePayrollDTO: {
                                                            ...appDetails.ePayrollDTO,
                                                            additionalEmployee: {
                                                                ...appDetails.ePayrollDTO.additionalEmployee,
                                                                otherReminders: newReminders
                                                            }
                                                        }
                                                    });
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>






                        {/* Fund Contributions */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Fund Contributions</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <table className="min-w-full shadow-xl rounded-md divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Sel</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Code</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Name</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Apply</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-900 uppercase tracking-wider font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {funds.map((fund, index) => (
                                        <tr key={fund.code} className="even:bg-gray-50 hover:bg-gray-100">
                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={fund.selected}
                                                    onChange={() => {
                                                        const updatedFunds = [...funds];
                                                        updatedFunds[index].selected = !updatedFunds[index].selected;
                                                        if (!updatedFunds[index].selected) {
                                                            updatedFunds[index].apply = null;
                                                            updatedFunds[index].amount = '';
                                                        }
                                                        setFunds(updatedFunds);

                                                        // Update appDetails
                                                        const selectedFunds = updatedFunds
                                                            .filter(f => f.selected)
                                                            .map(({ code, name, apply, amount }) => ({
                                                                code,
                                                                name,
                                                                apply: apply?.value || '',
                                                                amount: parseFloat(amount) || 0
                                                            }));

                                                        setAppDetails({
                                                            ...appDetails,
                                                            ePayrollDTO: {
                                                                ...appDetails.ePayrollDTO,
                                                                additionalEmployee: {
                                                                    ...appDetails.ePayrollDTO.additionalEmployee,
                                                                    fundEmployee: selectedFunds
                                                                }
                                                            }
                                                        });
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{fund.code}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{fund.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                {fund.selected && (
                                                    <ReactSelect
                                                        options={[
                                                            { value: 'end', label: 'End' },
                                                            { value: 'mid', label: 'Mid' },
                                                            { value: 'end&mid', label: 'End & Mid' }
                                                        ]}
                                                        value={fund.apply}
                                                        onChange={(option) => {
                                                            const updatedFunds = [...funds];
                                                            updatedFunds[index].apply = option;
                                                            setFunds(updatedFunds);

                                                            // Update appDetails
                                                            const selectedFunds = updatedFunds
                                                                .filter(f => f.selected)
                                                                .map(({ code, name, apply, amount }) => ({
                                                                    code,
                                                                    name,
                                                                    apply: apply?.value || '',
                                                                    amount: parseFloat(amount) || 0
                                                                }));

                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    additionalEmployee: {
                                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                                        fundEmployee: selectedFunds
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                        className="w-40"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                {fund.selected && (
                                                    <input
                                                        type="number"
                                                        value={fund.amount || ''}
                                                        onChange={(e) => {
                                                            const updatedFunds = [...funds];
                                                            updatedFunds[index].amount = e.target.value;
                                                            setFunds(updatedFunds);

                                                            // Update appDetails
                                                            const selectedFunds = updatedFunds
                                                                .filter(f => f.selected)
                                                                .map(({ code, name, apply, amount }) => ({
                                                                    code,
                                                                    name,
                                                                    apply: apply?.value || '',
                                                                    amount: parseFloat(amount) || 0
                                                                }));

                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    additionalEmployee: {
                                                                        ...appDetails.ePayrollDTO.additionalEmployee,
                                                                        fundEmployee: selectedFunds
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                        className="border border-gray-300 rounded-md p-1 w-24"
                                                        min="0"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Personal Tab */}
                {activeTab === 'personal' && (
                    <div className="grid grid-cols-3 gap-6">
                        {/* Contact Information */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Contact Information</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Home Phone*</label>
                                    <input
                                        type="number"
                                        value={appDetails.ePayrollDTO.personalSection?.homePhone || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    homePhone: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Address Information</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-2 gap-6">
                                {/* Address Line 1 */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address 1*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.address1 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    address1: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street address, P.O. box, company name"
                                    />
                                </div>

                                {/* Address Line 2 */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.address2 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    address2: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Apartment, suite, unit, building, floor"
                                    />
                                </div>

                                {/* Address Line 3 */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address 3 (Optional)</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.address3 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    address3: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Additional address information"
                                    />
                                </div>

                                {/* Postal Code */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.postalCode || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    postalCode: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Postal/ZIP code"
                                    />
                                </div>

                                {/* City/Country */}
                                <div className="col-span-3 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City/Country *</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.cityCountry || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    cityCountry: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="City"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Foreign Address Information */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Foreign Address</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-2 gap-6">
                                {/* Foreign Address Line 1 */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address 1*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.foriegnAddress1 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    foriegnAddress1: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street address, P.O. box, company name"
                                    />
                                </div>

                                {/* Foreign Address Line 2 */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.foriegnAddress2 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    foriegnAddress2: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Apartment, suite, unit, building, floor"
                                    />
                                </div>

                                {/* Foreign Address Line 3 */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address 3 (Optional)</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.foriegnAddress3 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    foriegnAddress3: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Additional address information"
                                    />
                                </div>

                                {/* Foreign City */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.foriegnCity || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    foriegnCity: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="City"
                                    />
                                </div>

                                {/* Foreign State/Province */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Province*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.foriegnState || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    foriegnState: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="State or Province"
                                    />
                                </div>

                                {/* Foreign Postal Code */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.foriegnPostalCode || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    foriegnPostalCode: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Postal/ZIP code"
                                    />
                                </div>

                                {/* Foreign Country */}
                                <div className="col-span-3 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                                    <select
                                        value={appDetails.ePayrollDTO.personalSection?.foriegnCountry || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    foriegnCountry: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Country</option>
                                        <option value="US">United States</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="CA">Canada</option>
                                        <option value="AU">Australia</option>
                                        <option value="JP">Japan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Spouse Details Section */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Spouse Details</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.spouseName || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    spouseName: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">D.O.B*</label>
                                    <input
                                        type="date"
                                        value={appDetails.ePayrollDTO.personalSection?.spouseDobDate || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    spouseDobDate: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.spouseOccupation || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    spouseOccupation: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                                    <input
                                        type="tel"
                                        value={appDetails.ePayrollDTO.personalSection?.spousePhone || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    spousePhone: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact Information Section */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Emergency Contact Information</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.emergencyContactPerson || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    emergencyContactPerson: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship*</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.empergencyRelation || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    empergencyRelation: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                                    <input
                                        type="tel"
                                        value={appDetails.ePayrollDTO.personalSection?.emergencyPhone || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    emergencyPhone: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Remarks Section */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>Remarks</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-2 gap-6">
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remark 1</label>
                                    <textarea
                                        value={appDetails.ePayrollDTO.personalSection?.remark1 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    remark1: e.target.value
                                                }
                                            }
                                        })}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remark 2</label>
                                    <textarea
                                        value={appDetails.ePayrollDTO.personalSection?.remark2 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    remark2: e.target.value
                                                }
                                            }
                                        })}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remark 3</label>
                                    <textarea
                                        value={appDetails.ePayrollDTO.personalSection?.remark3 || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    remark3: e.target.value
                                                }
                                            }
                                        })}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* National Service Section */}
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <h2 className='mb-2 font-semibold'>National Service</h2>
                            <hr className='border border-l-black shadow-2xl mb-2' />
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NS Status</label>
                                    <select
                                        value={appDetails.ePayrollDTO.personalSection?.nsStatus || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    nsStatus: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Exempted">Exempted</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Not Applicable">Not Applicable</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NS Rank</label>
                                    <input
                                        type="text"
                                        value={appDetails.ePayrollDTO.personalSection?.nsRank || ''}
                                        onChange={(e) => setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                personalSection: {
                                                    ...appDetails.ePayrollDTO.personalSection,
                                                    nsRank: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
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
                    <div className='col-span-2'>
                        <div className='border border-gray-400 rounded-md p-4 mb-5'>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className='font-semibold'>Education Details</h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                employeeEducation: [
                                                    ...appDetails.ePayrollDTO.employeeEducation,
                                                    {
                                                        institutionName: "",
                                                        academicFromTo: "",
                                                        eductaionName: "",
                                                        country: "",
                                                        gpaGradePoint: 4.0,
                                                        majorCourse: "",
                                                        highestQualification: false
                                                    }
                                                ]
                                            }
                                        });
                                    }}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Add Education
                                </button>
                            </div>
                            <hr className='border border-l-black shadow-2xl mb-2' />

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic FromTo</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA/Grade Point Average</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Major/Cources</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Qualification</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {appDetails.ePayrollDTO.employeeEducation.map((education, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={education.institutionName}
                                                        onChange={(e) => {
                                                            const newEducation = [...appDetails.ePayrollDTO.employeeEducation];
                                                            newEducation[index].institutionName = e.target.value;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    employeeEducation: newEducation
                                                                }
                                                            });
                                                        }}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <select
                                                        value={education.eductaionName}
                                                        onChange={(e) => {
                                                            const newEducation = [...appDetails.ePayrollDTO.employeeEducation];
                                                            newEducation[index].eductaionName = e.target.value;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    employeeEducation: newEducation
                                                                }
                                                            });
                                                        }}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">Select Level</option>
                                                        <option value="A">A LEVEL/ STPM/ PRE-U</option>
                                                        <option value="ADIP">ADVANCE DIPLOMA</option>
                                                        <option value="CER">CERTIFICATE</option>
                                                        <option value="DEG">DEGREE</option>
                                                        <option value="DIP">DIPLOMA</option>
                                                        <option value="H_ITE">HIGHER NITEC</option>
                                                        <option value="ITE">ITC/NTC/NITEC</option>
                                                        <option value="MAS">MASTER</option>
                                                        <option value="N">N LEVEL/ PMR/ SRP</option>
                                                        <option value="O">O LEVEL/ SPM/ SECONDARY</option>
                                                        <option value="PHD">DOCTORATE</option>
                                                        <option value="PSLE">PSLE/ PRIMARY</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={education.country}
                                                        onChange={(e) => {
                                                            const newEducation = [...appDetails.ePayrollDTO.employeeEducation];
                                                            newEducation[index].country = e.target.value;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    employeeEducation: newEducation
                                                                }
                                                            });
                                                        }}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={education.academicFromTo}
                                                        onChange={(e) => {
                                                            const newEducation = [...appDetails.ePayrollDTO.employeeEducation];
                                                            newEducation[index].academicFromTo = e.target.value;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    employeeEducation: newEducation
                                                                }
                                                            });
                                                        }}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="YYYY-YYYY"
                                                    />
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <input
                                                        type="number"
                                                        value={education.gpaGradePoint}
                                                        onChange={(e) => {
                                                            const newEducation = [...appDetails.ePayrollDTO.employeeEducation];
                                                            newEducation[index].gpaGradePoint = parseFloat(e.target.value) || 0;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    employeeEducation: newEducation
                                                                }
                                                            });
                                                        }}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        step="0.1"
                                                        min="0"
                                                        max="4"
                                                    />
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={education.majorCourse}
                                                        onChange={(e) => {
                                                            const newEducation = [...appDetails.ePayrollDTO.employeeEducation];
                                                            newEducation[index].majorCourse = e.target.value;
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    employeeEducation: newEducation
                                                                }
                                                            });
                                                        }}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center h-full">
                                                        <input
                                                            type="checkbox"
                                                            checked={education.highestQualification}
                                                            onChange={(e) => {
                                                                const newEducation = [...appDetails.ePayrollDTO.employeeEducation];
                                                                newEducation[index].highestQualification = e.target.checked;
                                                                setAppDetails({
                                                                    ...appDetails,
                                                                    ePayrollDTO: {
                                                                        ...appDetails.ePayrollDTO,
                                                                        employeeEducation: newEducation
                                                                    }
                                                                });
                                                            }}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newEducation = [...appDetails.ePayrollDTO.employeeEducation];
                                                            newEducation.splice(index, 1);
                                                            setAppDetails({
                                                                ...appDetails,
                                                                ePayrollDTO: {
                                                                    ...appDetails.ePayrollDTO,
                                                                    employeeEducation: newEducation
                                                                }
                                                            });
                                                        }}
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
                        </div>
                    </div>
                )}

                {/* Custom Fields Tab */}
                {activeTab === 'customFields' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Custom Fields</h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCustomFieldModal(true);
                                    setModalMode('add');
                                }}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                Add New Custom Field
                            </button>
                        </div>

                        {/* Custom Fields Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yes/No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customFieldsData?.content?.map((field, index) => (
                                        <tr key={field.fieldId || index}>
                                            <td className="px-4 py-4 whitespace-nowrap">{field.id || `CF-${index + 1}`}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">{field.fieldName}</td>

                                            {/* Date Column */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {field.fieldType === 'date' && (
                                                    <input
                                                        type="date"
                                                        value={appDetails.ePayrollDTO.customFieldEmployeeDTO?.expiryDate || ''}
                                                        onChange={(e) => setAppDetails({
                                                            ...appDetails,
                                                            ePayrollDTO: {
                                                                ...appDetails.ePayrollDTO,
                                                                customFieldEmployeeDTO: {
                                                                    ...appDetails.ePayrollDTO.customFieldEmployeeDTO,
                                                                    expiryDate: e.target.value
                                                                }
                                                            }
                                                        })}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                )}
                                            </td>

                                            {/* Text Column */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {field.fieldType === 'text' && (
                                                    <input
                                                        type="text"
                                                        value={appDetails.ePayrollDTO.customFieldEmployeeDTO?.remarks || ''}
                                                        onChange={(e) => setAppDetails({
                                                            ...appDetails,
                                                            ePayrollDTO: {
                                                                ...appDetails.ePayrollDTO,
                                                                customFieldEmployeeDTO: {
                                                                    ...appDetails.ePayrollDTO.customFieldEmployeeDTO,
                                                                    remarks: e.target.value
                                                                }
                                                            }
                                                        })}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                )}
                                            </td>

                                            {/* Select Column */}
                                            <td className="px-4 py-4 whitespace-nowrap relative">
                                                {field.fieldType === 'select' && (
                                                    <select
                                                        value={appDetails.ePayrollDTO.customFieldEmployeeDTO?.customFieldListId || ''}
                                                        onChange={(e) => setAppDetails({
                                                            ...appDetails,
                                                            ePayrollDTO: {
                                                                ...appDetails.ePayrollDTO,
                                                                customFieldEmployeeDTO: {
                                                                    ...appDetails.ePayrollDTO.customFieldEmployeeDTO,
                                                                    customFieldListId: e.target.value
                                                                }
                                                            }
                                                        })}
                                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white z-50"
                                                    >
                                                        <option value="">Select an option</option>
                                                        {field.options?.split(',').map(option => (
                                                            <option key={option.trim()} value={option.trim()}>
                                                                {option.trim()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>

                                            {/* Yes/No Column */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {field.fieldType === 'yesno' && (
                                                    <select
                                                        value={appDetails.ePayrollDTO.customFieldEmployeeDTO?.yesNo || ''}
                                                        onChange={(e) => setAppDetails({
                                                            ...appDetails,
                                                            ePayrollDTO: {
                                                                ...appDetails.ePayrollDTO,
                                                                customFieldEmployeeDTO: {
                                                                    ...appDetails.ePayrollDTO.customFieldEmployeeDTO,
                                                                    yesNo: e.target.value
                                                                }
                                                            }
                                                        })}
                                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                )}
                                            </td>

                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => removeCustomField(index)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {customFieldsData?.content?.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                                                No custom fields added yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Add/View Custom Field Modal */}
                        {showCustomFieldModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            {modalMode === 'add' ? 'Add Custom Field' : 'Available Custom Fields'}
                                        </h3>
                                        <button
                                            onClick={() => setShowCustomFieldModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {modalMode === 'add' ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Field Name*</label>
                                                <input
                                                    type="text"
                                                    value={newCustomField.fieldName}
                                                    onChange={(e) => setNewCustomField({ ...newCustomField, fieldName: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter field name"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Field Type*</label>
                                                <select
                                                    value={newCustomField.fieldType}
                                                    onChange={(e) => setNewCustomField({ ...newCustomField, fieldType: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="">Select type</option>
                                                    <option value="text">Text</option>
                                                    <option value="numeric">Numeric</option>
                                                    <option value="yesno">Yes/No</option>
                                                    <option value="date">Date</option>
                                                    <option value="select">Select</option>
                                                </select>
                                            </div>

                                            {newCustomField.fieldType === 'select' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma separated)*</label>
                                                    <input
                                                        type="text"
                                                        value={newCustomField.options}
                                                        onChange={(e) => setNewCustomField({ ...newCustomField, options: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Option1, Option2, Option3"
                                                        required
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Days</label>
                                                <input
                                                    type="number"
                                                    value={newCustomField.reminderDays}
                                                    onChange={(e) => setNewCustomField({ ...newCustomField, reminderDays: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Number of days before reminder"
                                                />
                                            </div>

                                            <div className="mt-6 flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setModalMode('view')}
                                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                    disabled={addFieldMutation.isLoading}
                                                >
                                                    View Existing
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleAddCustomField}
                                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                                    disabled={addFieldMutation.isLoading}
                                                >
                                                    {addFieldMutation.isLoading ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field ID</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Name</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Type</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {isLoading ? (
                                                            <tr>
                                                                <td colSpan="4" className="px-4 py-4 text-center">Loading...</td>
                                                            </tr>
                                                        ) : customFieldsData?.data?.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="4" className="px-4 py-4 text-center">No custom fields found</td>
                                                            </tr>
                                                        ) : (
                                                            <>
                                                                {customFieldsData?.content?.map((field) => {
                                                                    const isFieldAdded = values.customFields?.some(f => f.fieldId === field.id);

                                                                    return (
                                                                        <tr key={field.id}>
                                                                            <td className="px-4 py-4 whitespace-nowrap">{field.id}</td>
                                                                            <td className="px-4 py-4 whitespace-nowrap">{field.fieldName}</td>
                                                                            <td className="px-4 py-4 whitespace-nowrap capitalize">{field.fieldType}</td>
                                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                                {!isFieldAdded && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleAddToForm(field)}
                                                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                                                    >
                                                                                        Add to Form
                                                                                    </button>
                                                                                )}
                                                                                {isFieldAdded && (
                                                                                    <span className="text-green-600">Added</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {customFieldsData?.totalPages > 1 && (
                                                <div className="flex items-center justify-between mt-4">
                                                    <button
                                                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                                                        disabled={page === 1 || isLoading}
                                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="text-sm text-gray-700">
                                                        Page {page} of {customFieldsData?.totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => setPage(p => Math.min(p + 1, customFieldsData?.totalPages))}
                                                        disabled={page === customFieldsData?.totalPages || isLoading}
                                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}

                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setModalMode('add')}
                                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Create New Field
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}






                {/* MOM Integration Tab */}
                {activeTab === 'momIntegration' && (
                    <div className='border border-gray-400 rounded-md p-4 mb-5'>
                        <h2 className='mb-2 font-semibold'>MOM</h2>
                        <hr className='border border-l-black shadow-2xl mb-2'></hr>
                        <div className="grid grid-cols-3 gap-6">
                            {/* Premise Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Premise Type</label>
                                <ReactSelect
                                    value={premiseTypeOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.premiseType)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                premiseType: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={premiseTypeOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* Postal Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    value={appDetails.ePayrollDTO.momIntegrationDTO.postalCode || ''}
                                    onChange={(e) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                postalCode: e.target.value
                                            }
                                        }
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter postal code"
                                />
                            </div>

                            {/* Street Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Name</label>
                                <input
                                    type="text"
                                    value={appDetails.ePayrollDTO.momIntegrationDTO.streetName || ''}
                                    onChange={(e) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                streetName: e.target.value
                                            }
                                        }
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter street name"
                                />
                            </div>

                            {/* Type of Employee */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Employee</label>
                                <ReactSelect
                                    value={employeeTypeOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.typeOfEmployee)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                typeOfEmployee: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={employeeTypeOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* Mode of Payment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Payment</label>
                                <ReactSelect
                                    value={paymentModeOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.modeOfPayment)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                modeOfPayment: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={paymentModeOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* Occupation Group */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation Group</label>
                                <ReactSelect
                                    value={occupationGroupOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.ocupationGroup)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                ocupationGroup: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={occupationGroupOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* PWM Job Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PWM Job Level</label>
                                <ReactSelect
                                    value={jobLevelOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.pnJOBLevel)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                pnJOBLevel: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={jobLevelOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* Is HR Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Is the employee performing HR functions/roles?</label>
                           
                                <ReactSelect
                                    value={yesNoOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.isHrRole)}
                                    onChange={(option) => {
                                        const isHrRole = option?.value || '';
                                        setAppDetails({
                                            ...appDetails,
                                            ePayrollDTO: {
                                                ...appDetails.ePayrollDTO,
                                                momIntegrationDTO: {
                                                    ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                    isHrRole: isHrRole,
                                                    ...(isHrRole !== 'yes' ? {
                                                        primaryHRFunction: '',
                                                        secondaryHRFunction: '',
                                                        hrJobLevelHeld: ''
                                                    } : {})
                                                }
                                            }
                                        });
                                    }}
                                    options={yesNoOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* Primary HR Function */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary HR Function</label>
                                <ReactSelect
                                    value={hrFunctionOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.primaryHRFunction)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                primaryHRFunction: option?.value || '',
                                                ...(option?.value === appDetails.ePayrollDTO.momIntegrationDTO.secondaryHRFunction ? {
                                                    secondaryHRFunction: ''
                                                } : {})
                                            }
                                        }
                                    })}
                                    options={hrFunctionOptions}
                                    className={`bg-white dark:bg-form-Field ${appDetails.ePayrollDTO.momIntegrationDTO.isHrRole !== 'yes' ? 'opacity-50' : ''}`}
                                    classNamePrefix="react-select"
                                    placeholder="Select primary function"
                                    isClearable
                                    isDisabled={appDetails.ePayrollDTO.momIntegrationDTO.isHrRole !== 'yes'}
                                />
                            </div>

                            {/* Secondary HR Function */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary HR Function</label>
                                <ReactSelect
                                    value={hrFunctionOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.secondaryHRFunction)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                secondaryHRFunction: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={hrFunctionOptions.filter(opt => opt.value !== appDetails.ePayrollDTO.momIntegrationDTO.primaryHRFunction)}
                                    className={`bg-white dark:bg-form-Field ${appDetails.ePayrollDTO.momIntegrationDTO.isHrRole !== 'yes' ? 'opacity-50' : ''}`}
                                    classNamePrefix="react-select"
                                    placeholder="Select secondary function"
                                    isClearable
                                    isDisabled={appDetails.ePayrollDTO.momIntegrationDTO.isHrRole !== 'yes'}
                                />
                            </div>

                            {/* HR Job Level held */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">HR Job Level held</label>
                                <ReactSelect
                                    value={hrJobLevelOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.hrJobLevelHeld)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                hrJobLevelHeld: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={hrJobLevelOptions}
                                    className={`bg-white dark:bg-form-Field ${appDetails.ePayrollDTO.momIntegrationDTO.isHrRole !== 'yes' ? 'opacity-50' : ''}`}
                                    classNamePrefix="react-select"
                                    placeholder="Select job level"
                                    isClearable
                                    isDisabled={appDetails.ePayrollDTO.momIntegrationDTO.isHrRole !== 'yes'}
                                />
                            </div>

                            {/* Job Roles */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Roles</label>
                                <ReactSelect
                                    value={jobRoleOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.businessArea)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                businessArea: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={jobRoleOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* Seniority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seniority</label>
                                <ReactSelect
                                    value={seniorityOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.sceniority)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                sceniority: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={seniorityOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* Business Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Area</label>
                                <ReactSelect
                                    value={businessAreaOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.businessArea)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                businessArea: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={businessAreaOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>

                            {/* Geographical Coverage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Geographical Coverage</label>
                                <ReactSelect
                                    value={geoCoverageOptions.find(opt => opt.value === appDetails.ePayrollDTO.momIntegrationDTO.geoGraphocalCoverage)}
                                    onChange={(option) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                geoGraphocalCoverage: option?.value || ''
                                            }
                                        }
                                    })}
                                    options={geoCoverageOptions}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                    isClearable
                                />
                            </div>
                        </div>

                        {/* Text Areas */}
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">PWM Job Descriptions</label>
                                <textarea
                                    value={appDetails.ePayrollDTO.momIntegrationDTO.mainJobDuties || ''}
                                    onChange={(e) => setAppDetails({
                                        ...appDetails,
                                        ePayrollDTO: {
                                            ...appDetails.ePayrollDTO,
                                            momIntegrationDTO: {
                                                ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                mainJobDuties: e.target.value
                                            }
                                        }
                                    })}
                                    className="w-full p-2 border mt-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter job descriptions"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Main Job Duties<span className='text-red-600'> (Limit to 100 char)</span></label>
                                <textarea
                                    value={appDetails.ePayrollDTO.momIntegrationDTO.mainJobDuties || ''}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 100) {
                                            setAppDetails({
                                                ...appDetails,
                                                ePayrollDTO: {
                                                    ...appDetails.ePayrollDTO,
                                                    momIntegrationDTO: {
                                                        ...appDetails.ePayrollDTO.momIntegrationDTO,
                                                        mainJobDuties: e.target.value
                                                    }
                                                }
                                            });
                                        }
                                    }}
                                    className="w-full p-2 border mt-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter main job duties"
                                    rows={4}
                                    maxLength={100}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {appDetails.ePayrollDTO.momIntegrationDTO.mainJobDuties?.length || 0}/100 characters
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ePayrollDTOTabs;