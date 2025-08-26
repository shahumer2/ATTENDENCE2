import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useEmployee from 'hooks/useEmployee';
import { User, Calendar, Briefcase, Users, X } from 'lucide-react';
import ReactSelect from 'react-select';
import { components } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { FaInfoCircle } from "react-icons/fa";
import { DutyRoaster_LIST } from 'Constants/utils';
import { GET_ShiftSearch_URL } from 'Constants/utils';
import { AutoShift_VIEW } from 'Constants/utils';
import EPayrollTabs from './EPayrollTabs';
import ELeaveTabs from './ELeaveTabs';
import Breadcrumb from 'components/Breadcum/Breadcrumb';
const AddEmployee = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const [children, setChildren] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePic, setprofilePic] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [confirmationDate, setConfirmationDate] = useState(null);
  const [leaveCalDate, setleaveCalDate] = useState(null);
  const [resignationDate, setResignationDate] = useState(null);
  const [appDetails, setAppDetails] = useState({
    etmsDetailsDto: {
      otType: '', // Default value
      flatHourlyRate: 0.0, // Changed from flatHourlyRate to flatHourlyRateRate
      eligibleWorkingHourPerWeek: 0, // Changed from eligibleWorkingHoursPerWeek
      restDay: '', // New field
      shiftId: null, // New field
      dutyRosterId: null, // New field
      autoShiftId: null, // New field
      branchId: null // New field
    },
    ePayrollDTO: {
      shortName: '',
      birthDate: '',
      prApprovalDate: '',
      payDayGroup: '',
      lastPayDate: '',
      monthlyRate: false,
      vip: false,
      otRateCapped: false,
      basicSalary: 0,
      increment: 0,
      incrementDate: '',
      flatRate: 0,
      hourlyRate: 0,
      dailyRate: 0,
      totalSalary: 0,
      onceMonth: false,
      twiceMonth: false,
      endMonthPay: 0,
      midMonthPay: 0,
      fixedAmount: 0,
      employeerCPF: '',
      idType: '',
      nircWorkPermitFin: '',
      employeeTypeId: null,
      fwlId: null,
      salaryPayMode: [
        { mode: 'CASH', bankId: '', branchId: '', accountNumber: '', percentage: 100 },
        { mode: 'BANK GIRO 1', bankId: '', branchId: '', accountNumber: '', percentage: 0 },
        { mode: 'BANK GIRO 2', bankId: '', branchId: '', accountNumber: '', percentage: 0 },
        { mode: 'CHEQUE 1', bankId: '', branchId: '', accountNumber: '', percentage: 0 },
        { mode: 'CHEQUE 2', bankId: '', branchId: '', accountNumber: '', percentage: 0 }
      ],

      addtionalEmployee: {
        nationalityId: null,
        religionId: null,
        raceId: null,
        forignIdNO: '',
        passportNumber: '',
        pssportExpiry: '',
        bloodType: '',
        workPermitNumber: '',
        issueDate: '',
        expiryDate: '',
        extensionDate: null,
        allowanceEmp: {
          code: '',
          name: '',
          amount: 0,
          apply: '',
          period: '',
          fromDate: '',
          toDate: null,
          cpf: ''
        },
        otherReminder: [{
          referenceNumber: '',
          expiryDate: '',
          description: ''
        }
        ],
        fundEmployee: []
      },

      personalSection: {
        homePhone: "",
        address1: "",
        address2: "",
        address3: "",
        postalCode: "",
        cityCountry: "",
        foriegnAddress1: "",
        foriegnAddress2: "",
        foriegnAddress3: "",
        foriegnCity: "",
        foriegnState: "",
        foriegnPostalCode: "",
        foriegnCountry: "",
        spouseName: "",
        spouseDobDate: null,
        spouseOccupation: "",
        spousePhone: "",
        emergencyContactPerson: "",
        empergencyRelation: "",
        emergencyPhone: "",
        remark1: "",
        remark2: "",
        remark3: "",
        nsStatus: "",
        nsRank: ""
      },


      employeeEducation: [
        {
          institutionName: "",
          academicFromTo: "",
          eductaionName: "",
          country: "",
          gpaGradePoint: 0.0,
          majorCourse: "",
          highestQualification: true
        }
      ],

      customFieldEmployeeDTO: {
        customFieldListId: null,
        expiryDate: null,
        remarks: '',
        yesNo: ""
      },

      momIntegrationDTO: {
        premiseType: "",
        postalCode: "",
        streetName: "",
        typeOfEmployee: "",
        modeOfPayment: "",
        ocupationGroup: "",
        pnJOBLevel: "",
        isHrRole: "",
        primaryHRFunction: "",
        secondaryHRFunction: "",
        hrJobLevelHeld: "",
        sceniority: "",
        businessArea: "",
        geoGraphocalCoverage: "",
        mainJobDuties: ""
      }



    },






    eLeaveDTO: {
      shortName: "",
      defaultReplacementStaffId: null,
      excludeDays: "",
      homePhone: "",
      alternateEmail: "",
      lApproverFinalId: null,
      lApproverSecondId: null,
      lApproverFirstId: null,
      fwaApproverFinalId: null,
      fwaApproverSecondId: null,
      fwaApproverFirstId: null
    },


    // mobileAttendance: {
    //   geoFencing: false,
    //   radius: '',
    //   checkInMethod: ''
    // },
    // eHR: {
    //   accessLevel: '',
    //   canViewSalaries: false,
    //   canEditEmployees: false
    // }
  });

  // Initial form values
  const { initialValues, handleSubmit, RestDay, rateOptions, designationOptions, awsOptions, depOptions, categoryOptions, leaveCatOptions } = useEmployee({
    profilePic,
    startDate,
    confirmationDate,
    leaveCalDate,
    resignationDate,
    profileImage,
    children,
    appDetails, // Add this
    setAppDetails
  });
  console.log(leaveCatOptions, "-------------leave--------------");

  // Validation schema
  const validationSchema = Yup.object().shape({
    // employeeCode: Yup.string().required('Required'),
    // employeeName: Yup.string().required('Required'),
    // email: Yup.string().email('Invalid email').required('Required'),
    // phoneNumber: Yup.string().required('Required'),
  });

  //shift tanstack

  const { data: shiftOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ['shiftOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${GET_ShiftSearch_URL}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data from API:', data); // This shows it's an array
        return data;
      } catch (error) {
        console.error('Error fetching shift options:', error);
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
          shiftNames: [{ label: 'Select', value: null }],
          // shiftCodes: [{ label: 'Select', value: null }]
        };
      }

      const transformed = {
        shiftNames: [
          { label: 'Select', value: null },
          ...data.map(shift => ({
            label: shift.shiftName,
            value: shift.shiftName,
            id: shift.id
          }))
        ],
        // shiftCodes: [
        //   { label: 'Select', value: null },
        //   ...data.map(shift => ({
        //     label: shift.shiftCode,
        //     value: shift.shiftCode
        //   }))
        // ]
      };

      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  //duty roster
  const { data: dutyRoster, isLoading: optionLoading } = useQuery({
    queryKey: ['dutyRosterOptions'],
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

        return data; // Return the entire response object
      } catch (error) {
        console.error('Error fetching shift options:', error);
        throw error;
      }
    },
    enabled: !!token,
    select: (data) => {


      if (!Array.isArray(data.content)) {
        console.error('Data content is not an array:', data);
        return {
          dutyRoasteroption: [{ label: 'Select', value: null, id: null }],
        };
      }

      const transformed = {
        dutyRoasteroption: [
          { label: 'Select', value: null, id: null },  // here ... becuase we are combining two arrays
          ...data?.content?.map(roster => ({
            label: roster.dutyRoasterName,
            value: roster.dutyRoasterCode,
            id: roster.id // Include the id in each option
          }))
        ],
      };


      return transformed;
    }
  });


  // autoshft

  const { data: autoShift, isLoading: optionssLoading } = useQuery({
    queryKey: ['autoShiftOptions'],
    queryFn: async () => {
      try {
        const response = await fetch(`${AutoShift_VIEW}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw data from autoshift:', data); // This shows it's an array
        return data;
      } catch (error) {
        console.error('Error fetching shift options:', error);
        throw error;
      }
    },
    enabled: !!token,
    select: (data) => {
      console.log('Data in select function:', data); // Should log the array

      // Since data is directly the array, we don't need data.content
      if (!Array.isArray(data.content)) {
        console.error('Data is not an array:', data);
        return {
          AutoSHift: [{ label: 'Select', value: null }],
          // shiftCodes: [{ label: 'Select', value: null }]
        };
      }

      const transformed = {
        AutoSHift: [
          { label: 'Select', value: null },
          ...data.content.map(autoShift => ({
            label: autoShift.autoShiftCode,
            value: autoShift.autoShiftCode,
            id: autoShift.id
          }))
        ],
        // shiftCodes: [
        //   { label: 'Select', value: null },
        //   ...data.map(shift => ({
        //     label: shift.shiftCode,
        //     value: shift.shiftCode
        //   }))
        // ]
      };

      console.log('Transformed options:', transformed);
      return transformed;
    }
  });

  //app access

  const [selectedApps, setSelectedApps] = useState({
    'E-TMS': false,
    'E-payroll': false,
    'E-LEAVE': false,
    'MOBILEATTENDENCE': false,
    'E-HR': false
  });


  const [activeTab, setActiveTab] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState('basic'); // 'basic', 'etmsDetailsDto', 'ePayroll', etc.

  // Add this effect to set the first available tab as active when apps are selected
  useEffect(() => {
    if (!activeTab || !selectedApps[activeTab]) {
      const firstSelectedApp = Object.keys(selectedApps).find(app => selectedApps[app]);
      if (firstSelectedApp) {
        setActiveTab(firstSelectedApp);
      }
    }
  }, [selectedApps]);
  ///////////////////////////////

  // Handle child addition
  const addChild = () => {
    setChildren([...children, {
      childName: '',
      dob: null,
      gender: '',
      birthCertificateNo: '',
      singaporeCitizen: false
    }]);
  };

  // Handle child removal
  const removeChild = (index) => {
    const updatedChildren = [...children];
    updatedChildren.splice(index, 1);
    setChildren(updatedChildren);
  };

  // Handle child field change
  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...children];
    updatedChildren[index][field] = value;
    setChildren(updatedChildren);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setprofilePic(file);
      };
      reader.readAsDataURL(file);
    }
  };

  //shift setting 
  const [selectedSetting, setSelectedSetting] = useState(null);
  const handleDutyRoasterChange = (option) => {
    setAppDetails({
      ...appDetails,
      etmsDetailsDto: {
        ...appDetails.etmsDetailsDto,
        dutyRosterId: option?.id || null // Also save to appDetails.etmsDetailsDto
      }
    });
  }

  // Handle duty roaster change




  const handleAutoShiftChange = (option) => {
    setAppDetails({
      ...appDetails,
      etmsDetailsDto: {
        ...appDetails.etmsDetailsDto,
        autoShiftId: option?.id || null // Also save to appDetails.etmsDetailsDto
      }
    });
  };

  const handleScheduleChange = (option) => {
    setAppDetails({
      ...appDetails,
      etmsDetailsDto: {
        ...appDetails.etmsDetailsDto,
        branchId: option?.id || null // Also save to appDetails.etmsDetailsDto
      }
    });
  };

  return (
    <>
      <div className="flex justify-between pl-14 pt-2 pr-8">

        <div className="flex items-center">
          <h2 className="mt-1 font-bold text-lg capitalize text-blue-900">Employee Basic Details</h2>

        </div>
        <Breadcrumb className="pr-4" items={`Master,Employee Basic Details`} />
      </div>
      <div className="bg-blue-50 min-h-screen pt-2">
        <div className="max-w-6xl mx-auto">


          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                {/* General Section */}
                <div className="  items-center bg-white rounded-lg shadow-md overflow-hidden">
                  <div className='h-[50px] mt-1 mr-1 flex justify-end'>
                    <ReactSelect
                      name="appAccess"
                      className="bg-white text-black dark:bg-form-Field w-64"
                      classNamePrefix="react-select"
                      placeholder="SELECT APP ACCESS"
                      isClearable
                      components={{
                        Menu: (props) => (
                          <components.Menu {...props}>
                            <div className="p-2">
                              {Object.keys(selectedApps).map((app) => (
                                <label key={app} className="flex items-center text-black space-x-2 p-2 hover:bg-gray-100 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedApps[app]}
                                    onChange={(e) => setSelectedApps({ ...selectedApps, [app]: e.target.checked })}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                  />
                                  <span>{app.split(0, 1).join('-')}</span>
                                </label>
                              ))}
                            </div>
                          </components.Menu>
                        ),
                      }}
                    />
                  </div>
                  {/* <div className="bg-blue-600 text-white p-4 flex items-center">
                  <User className="mr-2" size={20} />
                  <h2 className="text-lg font-semibold">General</h2>
                </div> */}

                  {/* Application Tabs Section */}
                  <div className="flex border-b bg-blue-600  text-white border-gray-200 mb-2">
                    <button
                      className={`px-12 py-2 font-xs ${activeMainTab === 'basic' ? 'text-white-600 border-b-2 border-blue-600 bg-blue-900' : 'text-white-500'}`}
                      onClick={(e) => {

                        e.preventDefault();
                        setActiveMainTab('basic')
                      }

                      }
                    >
                      General
                    </button>
                    {selectedApps['E-TMS'] && (
                      <button
                        className={`px-4 py-2 font-xs ${activeMainTab === 'etmsDetailsDto' ? 'text-white-600 border-b-2 border-blue-600 bg-blue-900' : 'text-white-500'}`}
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveMainTab('etmsDetailsDto')
                        }}

                      >
                        E-TMS
                      </button>
                    )}




                    {selectedApps['E-payroll'] && (
                      <button
                        className={`px-4 py-2 font-xs ${activeMainTab === 'ePayroll' ? 'text-white-600 border-b-2 border-blue-600 bg-blue-900' : 'text-white-500'}`}
                        onClick={(e) => {
                          e.preventDefault()

                          setActiveMainTab('ePayroll')
                        }
                        }

                      >
                        E-Payroll
                      </button>
                    )}
                    {selectedApps['E-LEAVE'] && (
                      <button
                        className={`px-4 py-2 font-xs ${activeMainTab === 'eLeave' ? 'text-white-600 border-b-2 border-blue-600 bg-blue-900' : 'text-white-500'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveMainTab('eLeave')
                        }

                        }

                      >
                        E-LEAVE
                      </button>
                    )}
                    {/* Add similar buttons for other apps */}
                  </div>




                  {/* /General */}

                  {activeMainTab === 'basic' && (
                    <>
                      <div className="p-4 m-4 rounded-md border border-gray-500">
                        <h2 className='font-semibold text-lg'>Basic Details</h2>
                        <hr className="my-2 border-t-2 border-gray-300" />
                        <div className=" p-3 flex border rounded-md">

                          <div className="w-3/4 pr-6">
                            <div className="grid grid-cols-3 gap-6 mb-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code*</label>
                                <Field
                                  name="employeeCode"
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter code"
                                />
                                <ErrorMessage name="employeeCode" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name*</label>
                                <Field
                                  name="employeeName"
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter full name"
                                />
                                <ErrorMessage name="employeeName" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <Field
                                  as="select"
                                  name="gender"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </Field>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <Field
                                  as="select"
                                  name="martialStatus"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select Status</option>
                                  <option value="single">Single</option>
                                  <option value="married">Married</option>
                                  <option value="divorced">Divorced</option>
                                  <option value="widowed">Widowed</option>
                                </Field>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                                <Field
                                  name="email"
                                  type="email"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="email@example.com"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number*</label>
                                <Field
                                  name="phoneNumber"
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter phone number"
                                />
                                <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                                {/* <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholderText="Select date"
                              /> */}
                                <Field
                                  name="joinDate"
                                  type="date"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter phone number"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Date</label>
                                <DatePicker
                                  selected={confirmationDate}
                                  onChange={(date) => setConfirmationDate(date)}
                                  className="w-full p-2 mr-8 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholderText="Select date"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Probation Months</label>
                                <Field
                                  name="probationMonths"
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter months"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fingerprint ID</label>
                                <Field
                                  name="fingerPrint"
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter ID"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Face ID</label>
                                <Field
                                  name="faceId"
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter ID"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Calculation Date</label>
                                {/* <DatePicker
                                selected={leaveCalDate}
                                onChange={(date) => setleaveCalDate(date)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholderText="Select date"
                              /> */}

                                <Field
                                  name="leaveCalDate"
                                  type="date"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter phone number"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resignation Date</label>
                                <DatePicker
                                  selected={resignationDate}
                                  onChange={(date) => setResignationDate(date)}
                                  className="w-full p-2 border mr-8 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholderText="Select date"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resignation Reason</label>
                                <Field
                                  name="resignationReason"
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter reason if applicable"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="w-1/4 pl-6">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-40 h-40 bg-gray-100 rounded-full mb-4 overflow-hidden border-4 border-gray-200 shadow-md">
                                {profileImage ? (
                                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <User size={64} />
                                  </div>
                                )}
                              </div>
                              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm text-sm font-medium">
                                Upload Photo
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                />
                              </label>
                              <p className="text-xs text-gray-500 mt-2 text-center">JPEG or PNG, max 1MB</p>
                            </div>
                          </div>



                        </div>



                      </div>
                      {/* Department Section */}
                      <div className="mb-6  bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-600 text-white p-4 flex items-center">
                          <Briefcase className="mr-2" size={20} />
                          <h2 className="text-lg font-semibold">Department Details</h2>
                        </div>
                        <div className="p-6 border border-gray-500 m-4 rounded-md">
                          <div className="grid grid-cols-4 gap-6 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                              <ReactSelect
                                value={depOptions?.find(option => option.id === values.departmentId) || null}
                                onChange={(option) => setFieldValue("departmentId", option?.id || null)}
                                options={depOptions || []}
                                getOptionValue={(option) => option.id}
                                getOptionLabel={(option) => option.label || option.name}  // Use appropriate property for display
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                              <ReactSelect
                                value={designationOptions?.find(option => option.id === values.designationId) || null}

                                onChange={(option) => setFieldValue("designationId", option?.id || null)}
                                options={designationOptions || []}
                                getOptionValue={(option) => option.id}  // This tells ReactSelect to use the id for value comparison
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">AWS</label>
                              <ReactSelect

                                value={awsOptions?.find(option => option.id === values.awsId) || null}

                                onChange={(option) => setFieldValue("awsId", option?.id || null)}
                                options={awsOptions || []}
                                getOptionValue={(option) => option.id}  // This tells ReactSelect to use the id for value comparison
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Group</label>
                              <Field
                                as="select"
                                name="holidayGroup"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Holiday Group</option>
                                <option value="group1">Group 1</option>
                                <option value="group2">Group 2</option>
                              </Field>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-6 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked Per Day</label>
                              <Field
                                as="select"
                                name="hoursWorkedPerDay"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Hours</option>
                                <option value="8">8 Hours</option>
                                <option value="9">9 Hours</option>
                              </Field>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Days Worked Per Week</label>
                              <Field
                                as="select"
                                name="daysWorkedPerWeek"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Days</option>
                                <option value="5">5 Days</option>
                                <option value="6">6 Days</option>
                              </Field>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked Per Year</label>
                              <Field
                                as="select"
                                name="hoursWorkedPerYear"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Hours</option>
                                <option value="2080">2080 Hours</option>
                                <option value="2340">2340 Hours</option>
                              </Field>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Part Time</label>
                              <Field
                                as="select"
                                name="partTime"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Option</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </Field>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                              <ReactSelect
                                value={categoryOptions?.find(option => option.id === values.categoryId) || null}
                                onChange={(option) => setFieldValue("categoryId", option?.id || null)}
                                options={categoryOptions || []}
                                getOptionValue={(option) => option.id}
                                getOptionLabel={(option) => option.label || option.name}  // Use appropriate property for display
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                                menuPosition='fixed'
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Category</label>
                              <ReactSelect
                                value={leaveCatOptions?.find(option => option.id === values.leaveCategoryId) || null}

                                onChange={(option) => setFieldValue("leaveCategoryId", option?.id || null)}
                                options={leaveCatOptions || []}
                                getOptionValue={(option) => option.id}  // This tells ReactSelect to use the id for value comparison
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select"
                                isClearable
                                menuPosition='fixed'
                              />
                            </div>
                          </div>
                        </div>
                      </div>




                      {/* Children Details Section */}
                      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <Users className="mr-2" size={20} />
                            <h2 className="text-lg font-semibold">Children Details</h2>
                          </div>
                          <button
                            type="button"
                            onClick={addChild}
                            className="bg-white text-blue-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-50 transition duration-150 ease-in-out shadow-sm"
                          >
                            Add Child
                          </button>
                        </div>
                        <div className="p-6">
                          {children.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
                              <Users size={48} className="mx-auto text-gray-400 mb-2" />
                              <p className="text-gray-500">No children added yet</p>
                              <button
                                type="button"
                                onClick={addChild}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Add a child record
                              </button>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Cert No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SG Citizen</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {children.map((child, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                          type="text"
                                          value={child.childName}
                                          onChange={(e) => handleChildChange(index, 'childName', e.target.value)}
                                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="Child name"
                                        />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <DatePicker
                                          selected={child.dob}
                                          onChange={(date) => handleChildChange(index, 'dob', date.toISOString().split('T')[0] || "")}
                                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                          placeholderText="Select date"
                                        />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                          value={child.gender}
                                          onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                          <option value="">Select</option>
                                          <option value="male">Male</option>
                                          <option value="female">Female</option>
                                        </select>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                          type="text"
                                          value={child.birthCertificateNo}
                                          onChange={(e) => handleChildChange(index, 'birthCertificateNo', e.target.value)}
                                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="Certificate number"
                                        />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <input
                                          type="checkbox"
                                          checked={child.singaporeCitizen}
                                          onChange={(e) => handleChildChange(index, 'singaporeCitizen', e.target.checked)}

                                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                          type="button"
                                          onClick={() => removeChild(index)}
                                          className="flex items-center text-red-600 hover:text-red-800"
                                        >
                                          <X size={16} className="mr-1" /> Remove
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </>

                  )}
                  {activeMainTab === 'etmsDetailsDto' && selectedApps['E-TMS'] && (
                    <>
                      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-600 text-white p-4 flex items-center">
                          <Briefcase className="mr-2" size={20} />
                          <h2 className="text-lg font-semibold">E-TMS Details</h2>
                        </div>
                        <div className="p-6 ">
                          <div className="grid grid-cols-3 gap-6 ">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">OT Type</label>
                              <ReactSelect
                                options={rateOptions}
                                value={rateOptions.find(option => option.value === appDetails?.etmsDetailsDto?.otType)}
                                onChange={(option) => setAppDetails({
                                  ...appDetails,
                                  etmsDetailsDto: {
                                    ...appDetails.etmsDetailsDto,
                                    otType: option.value,
                                    // Reset hours when changing OT type (optional)
                                    eligibleWorkingHoursPerWeek: ['flat', 'hourly'].includes(option.value)
                                      ? appDetails.etmsDetailsDto.eligibleWorkingHoursPerWeek
                                      : ''
                                  }
                                })}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                  menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Flat/Hourly</label>
                              <input
                                type="number"
                                value={appDetails.etmsDetailsDto.flatHourlyRate || ''}
                                onChange={(e) => setAppDetails({
                                  ...appDetails,
                                  etmsDetailsDto: { ...appDetails.etmsDetailsDto, flatHourlyRate: e.target.value }
                                })}
                                disabled={!['flat', 'hourly'].includes(appDetails?.etmsDetailsDto?.otType)}
                                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${['flat', 'hourly'].includes(appDetails?.etmsDetailsDto?.otType)
                                  ? 'border-blue-500 bg-white'  // Highlighted when editable
                                  : 'border-gray-300 bg-gray-100'  // Grayed out when disabled
                                  }`}
                                placeholder={
                                  ['flat', 'hourly'].includes(appDetails?.etmsDetailsDto?.otType)
                                    ? "Enter hours"
                                    : "Select Flat or Hourly rate first"
                                }
                              />
                            </div>



                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Weekly OT</label>
                              <div className="flex items-center mt-2">
                                <label className="inline-flex items-center mr-4">
                                  <input
                                    type="radio"
                                    checked={appDetails.etmsDetailsDto.weeklyOT === true}
                                    onChange={() => setAppDetails({
                                      ...appDetails,
                                      etmsDetailsDto: { ...appDetails.etmsDetailsDto, weeklyOT: true }
                                    })}
                                    className="form-radio h-4 w-4 text-blue-600"
                                  />
                                  <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    checked={appDetails.etmsDetailsDto.weeklyOT === false}
                                    onChange={() => setAppDetails({
                                      ...appDetails,
                                      etmsDetailsDto: { ...appDetails.etmsDetailsDto, weeklyOT: false }
                                    })}
                                    className="form-radio h-4 w-4 text-blue-600"
                                  />
                                  <span className="ml-2">No</span>
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Eligible Working Hours Per Week</label>
                              <input
                                type="number"
                                value={appDetails.etmsDetailsDto.eligibleWorkingHourPerWeek}
                                onChange={(e) => setAppDetails({
                                  ...appDetails,
                                  etmsDetailsDto: { ...appDetails.etmsDetailsDto, eligibleWorkingHourPerWeek: e.target.value || 44.00 }
                                })}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter hours"
                              />
                            </div>
                          </div>
                        </div>
                      </div>



                      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-600 text-white p-4 flex items-center">
                          <Briefcase className="mr-2" size={20} />
                          <h2 className="text-lg font-semibold">Shift /Branch Details</h2>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-3 gap-6">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours/Shift</label>
                              <ReactSelect
                                name="shiftId"
                                value={shiftOptions?.shiftNames?.find(option => option.value === values.shiftName)}
                                onChange={(option) => {
                                  console.log('Shift Name selected:', option);
                                  setAppDetails({
                                    ...appDetails,
                                    etmsDetailsDto: {
                                      ...appDetails.etmsDetailsDto,
                                      shiftId: option?.id || null // Also save to appDetails.etmsDetailsDto
                                    }
                                  });

                                }}
                                options={shiftOptions?.shiftNames || []}
                                className="bg-white dark:bg-form-Field z-9999"
                                classNamePrefix="react-select"
                                placeholder="Select Shift Name"
                                isClearable
                                styles={{
                                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                  menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                                isLoading={optionsLoading}
                                menuPosition="fixed"
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Rest Day</label>
                              <ReactSelect
                                options={RestDay}
                                value={RestDay.find(option => option.value === appDetails?.etmsDetailsDto?.otType)}
                                onChange={(option) => setAppDetails({
                                  ...appDetails,
                                  etmsDetailsDto: {
                                    ...appDetails.etmsDetailsDto,
                                    restDay: option.value,
                                  }
                                })}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                  menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                              />
                            </div>
                          </div>

                          <hr className='mb-3 border shadow-2xl'></hr>

                          <div
                            className="p-3 alert text-xs mb-4"
                            style={{
                              color: "#0c5460",
                              backgroundColor: "#d1ecf1",
                              border: "1px solid #bee5eb",
                              borderRadius: "4px"
                            }}
                          >
                            <h2 className="flex flex-row gap-3 items-center">
                              <FaInfoCircle />
                              The 3 Settings Below Are Optional. You Can Choose Only 1 out Of 3 Settings If Applicable
                            </h2>
                          </div>


                          {/* Radio buttons in one line */}
                          <div className="flex gap-6 mb-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="settingType"
                                value="dutyRoaster"
                                checked={selectedSetting === 'dutyRoaster'}
                                onChange={() => setSelectedSetting('dutyRoaster')}
                                className="form-radio h-4 w-4 text-blue-600"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700">Duty Roaster/Group</span>
                            </label>

                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="settingType"
                                value="autoShift"
                                checked={selectedSetting === 'autoShift'}
                                onChange={() => setSelectedSetting('autoShift')}
                                className="form-radio h-4 w-4 text-blue-600"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700">Auto Shift</span>
                            </label>

                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="settingType"
                                value="schedule"
                                checked={selectedSetting === 'schedule'}
                                onChange={() => setSelectedSetting('schedule')}
                                className="form-radio h-4 w-4 text-blue-600"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700">Schedule</span>
                            </label>
                          </div>

                          {/* Conditional React Select fields based on radio selection */}
                          {selectedSetting === 'dutyRoaster' && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Duty Roster/Group</label>
                              <ReactSelect
                                options={dutyRoster.dutyRoasteroption}
                                onChange={(option) => handleDutyRoasterChange(option)}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select Duty Roaster/Group"
                                styles={{
                                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                  menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                              />
                            </div>
                          )}

                          {selectedSetting === 'autoShift' && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Auto Shift</label>
                              <ReactSelect
                                options={autoShift.AutoSHift}
                                onChange={(option) => handleAutoShiftChange(option)}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select Auto Shift"
                                styles={{
                                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                  menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                              />
                            </div>
                          )}

                          {selectedSetting === 'schedule' && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                              <ReactSelect
                                // options={scheduleOptions}
                                onChange={(option) => handleScheduleChange(option)}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select Schedule"
                                styles={{
                                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                  menuPortal: base => ({ ...base, zIndex: 9999 })
                                }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                              />
                            </div>
                          )}
                        </div>
                      </div>


                    </>

                  )}





                  {activeMainTab === 'ePayroll' && selectedApps['E-payroll'] && (
                    <EPayrollTabs values={values} setFieldValue={setFieldValue} appDetails={appDetails}
                      setAppDetails={setAppDetails} />
                  )}

                  {activeMainTab === 'eLeave' && selectedApps['E-LEAVE'] && (
                    <ELeaveTabs values={values} setFieldValue={setFieldValue} appDetails={appDetails}
                      setAppDetails={setAppDetails} />
                  )}








                </div>


                {/* Submit Button */}
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out shadow-sm mr-4 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition duration-150 ease-in-out shadow-md font-medium"
                  >
                    Save Employee
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;