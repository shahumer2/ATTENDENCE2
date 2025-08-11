export const BASE_URL = 'http://localhost:8081';


// auth
export const SIGNIN_URL = `${BASE_URL}/api/v1/auth/signin`;

//department
export const DEPARTMENT_ADD = `${BASE_URL}/api/department/save`;
export const DEPARTMENT_LIST = `${BASE_URL}/api/department/departmentList`;
export const GET_DEPARTMENT_LIST = `${BASE_URL}/api/department/department-list`;
export const GET_DEPARTMENT_id = `${BASE_URL}/api/department/id`;
export const DEPARTMENT_UPDATE = `${BASE_URL}/api/department/update`;





//designations
export const DESIGNATION_ADD = `${BASE_URL}/api/designations/addDesignation`;
export const DESIGNATION_LIST = `${BASE_URL}/api/designations/getAllDesignations`;
export const DESIGNATIONS_LIST = `${BASE_URL}/api/designations/viewAll`;
export const DESIGNATION_UPDATE = `${BASE_URL}/api/designations/updateDesignation`;


//compny
export const COMPANY_ADD = `${BASE_URL}/api/companies/add-company`;
export const GET_COMPANY_id = `${BASE_URL}/api/get-company/id`;
export const COMPANY_LIST = `${BASE_URL}/api/companies/fetchAll-companies`;
export const GET_COMPANY_LIST = `${BASE_URL}/api/companies/company-list`;
export const COMPANY_UPDATE = `${BASE_URL}/api/companies`;

//image
export const IMAGE = `${BASE_URL}/api/v1/images`;

//user
export const USER_ADD = `${BASE_URL}/api/user/save-user`;
export const USER_CREATE = `${BASE_URL}/api/companies`;
export const GET_ACTIVEUSERS = `${BASE_URL}/api/user/active`;
export const GET_INACTIVEUSERS = `${BASE_URL}/api/user/inactive`;






//Employee
export const ADD_EMPLOYEE_DATA = `${BASE_URL}/employee/addEmployee`;
export const GET_ALL_EMPLOYEE_DATA = `${BASE_URL}/employee/getAllEmployee`;
export const GET_EMPLOYEE_DATA = `${BASE_URL}/employee/getAll-Employees`;
export const GET_EMPLOYEEDROPDOWN_DATA = `${BASE_URL}/employee/getEmployeeDropdown`;
export const DELETE_EMPLOYEE_DATA = `${BASE_URL}/employee/deleteEmployee`;
export const GET_ACTIVE_EMPLOYEE_DATA = `${BASE_URL}/employee/active`;
export const GET_RESIGNED_EMPLOYEE_DATA = `${BASE_URL}/employee/inactive`;
export const GET_EMPLOYEEQR_DATA = `${BASE_URL}/employee/`;



//employeetype
export const GET_ALL_EMPLOYEETYPE_DATA = `${BASE_URL}/api/employeetype/getAll`;


 //shift

 export const Shift_LIST = `${BASE_URL}/api/shifts/search`;
 export const ADD_SHIFT_DATA = `${BASE_URL}/api/shifts/create`;
 export const GET_ShiftSearch_URL = `${BASE_URL}/api/shifts/getShiftDropdown`;
 export const GET_SHIFTBYID_URL = `${BASE_URL}/api/shifts`;
 export const UPDATE_SHIFT_URL = `${BASE_URL}/api/shifts/updateShift`;

  //Leave Category

  export const LeaveCategory_LIST = `${BASE_URL}/api/LeaveCategory/search`;
  export const LeaveCategory = `${BASE_URL}/api/leave-categories/fetch-all`;
  export const ADD_LeaveCategory_DATA = `${BASE_URL}/api/leave-categories/create`;
  export const GET_LeaveCategorySearch_URL = `${BASE_URL}/api/LeaveCategory/getLeaveCategoryDropdown`;
  export const GET_LeaveCategoryBYID_URL = `${BASE_URL}/api/LeaveCategory`;
  export const UPDATE_LeaveCategory_URL = `${BASE_URL}/api/LeaveCategory/updateLeaveCategory`;




 //Groups
 export const Groups_LIST = `${BASE_URL}/api/groups/getAll`;
 export const ADD_Groups_DATA = `${BASE_URL}/api/groups/addGroup`;
 export const GET_GroupsSearch_URL = `${BASE_URL}/api/roaster/getShiftDropdown`;
 export const GET_GroupsBYID_URL = `${BASE_URL}/api/roaster`;
 export const UPDATE_Groups_URL = `${BASE_URL}/api/roaster/updateShift`;
 export const DELETE_Group = `${BASE_URL}/api/groups/deleteGroup`;


  //AutoShift
  export const AutoShift_LIST = `${BASE_URL}/api/roaster/search`;
  export const AutoShift_VIEW = `${BASE_URL}/api/autoshift/viewAll`;

  export const ADD_AutoShift_DATA = `${BASE_URL}/api/roaster/create`;
  export const GET_AutoShiftSearch_URL = `${BASE_URL}/api/roaster/getShiftDropdown`;
  export const GET_AutoShift_URL = `${BASE_URL}/api/roaster`;
  export const UPDATE_AutoShift_URL = `${BASE_URL}/api/roaster/updateShift`;

   //Roaster

 export const DutyRoaster_LIST = `${BASE_URL}/api/roaster/allRosters`;
 export const ADD_DutyROASTER_DATA = `${BASE_URL}/api/roaster/create`;
 export const GET_DutyRoasterSearch_URL = `${BASE_URL}/api/roaster/search`;
 export const GET_DutyRoasterBYID_URL = `${BASE_URL}/api/roaster/getRoster`;
 export const UPDATE_DutyRoaster_URL = `${BASE_URL}/api/roaster/updateShift`;

 //Branch

 export const Branch_LIST = `${BASE_URL}/api/branches/getAll`;
 export const ADD_Branch_DATA = `${BASE_URL}/api/branches/addBranch`;
 export const GET_BranchSearch_URL = `${BASE_URL}/api/branches/search`;
 export const GET_BranchBYID_URL = `${BASE_URL}/api/branches/getBy`;
 export const UPDATE_Branch_URL = `${BASE_URL}/api/branches/updateBranch`;
 //aws

 export const Aws_LIST = `${BASE_URL}/api/aws/getAll`;
 export const ADD_Aws_DATA = `${BASE_URL}/api/aws/add`;
 export const GET_AwsSearch_URL = `${BASE_URL}/api/aws/search`;
 export const GET_AwsBYID_URL = `${BASE_URL}/api/aws/getBy`;
 export const UPDATE_Aws_URL = `${BASE_URL}/api/aws/updateBranch`;


 //FWL

 export const Fwl_LIST = `${BASE_URL}/api/fwl/getAll`;
 export const ADD_Fwl_DATA = `${BASE_URL}/api/fwl/addFwl`;
 export const GET_FwlSearch_URL = `${BASE_URL}/api/fwl/search`;
 export const GET_FwlhBYID_URL = `${BASE_URL}/api/branches/getBy`;
 export const UPDATE_Fwl_URL = `${BASE_URL}/api/branches/updateBranch`;

  //Religion

  export const Religion_LIST = `${BASE_URL}/api/religion/getAll`;
  export const ADD_Religion_DATA = `${BASE_URL}/api/religion/addReligion`;
  export const GET_ReligionSearch_URL = `${BASE_URL}/api/religion/search`;
  export const GET_ReligionhBYID_URL = `${BASE_URL}/api/religion/getBy`;
  export const UPDATE_Religion_URL = `${BASE_URL}/api/religion/update`;

  //leave Group
  export const LeaveGroup_LIST = `${BASE_URL}/api/leavegroup/getAll`;
  export const LeaveGroup = `${BASE_URL}/api/leavegroup/fetchAll`;
  export const ADD_LeaveGroup_DATA = `${BASE_URL}/api/leavegroup/add`;
  export const GET_LeaveGroupSearch_URL = `${BASE_URL}/api/leavegroup/search`;
  export const GET_LeaveGroupBYID_URL = `${BASE_URL}/api/leavegroup/getBy`;
  export const UPDATE_LeaveGroup_URL = `${BASE_URL}/api/leavegroup/update`;


  //leave Type
  export const Leavetype_LIST = `${BASE_URL}/api/leaveType/getAll`;
  export const ADD_Leavetype_DATA = `${BASE_URL}/api/leaveType/add`;
  export const GET_LeavetypeSearch_URL = `${BASE_URL}/api/leaveType/search`;
  export const GET_LeavetypeBYID_URL = `${BASE_URL}/api/leaveType/getBy`;
  export const UPDATE_Leavetype_URL = `${BASE_URL}/api/leaveType/update`;
  //hliday group
  
    export const HolidayGroup_LIST = `${BASE_URL}/api/holidayGroup/getAll`;
    export const ADD_HolidayGroup_DATA = `${BASE_URL}/api/holidayGroup/add`;
    export const GET_HolidayGroupSearch_URL = `${BASE_URL}/api/holidayGroup/search`;
    export const GET_HolidayGroupBYID_URL = `${BASE_URL}/api/holidayGroup/getBy`;
    export const UPDATE_HolidayGroup_URL = `${BASE_URL}/api/holidayGroup/update`;


  //holiday
  
    export const holiday_LIST = `${BASE_URL}/api/holiday/getAll`;
    export const ADD_holiday_DATA = `${BASE_URL}/api/holiday/add`;
    export const GET_holidaySearch_URL = `${BASE_URL}/api/holiday/search`;
    export const GET_holidayBYID_URL = `${BASE_URL}/api/holiday/getBy`;
    export const UPDATE_holiday_URL = `${BASE_URL}/api/holiday/update`;

  //assignholiday
   
    export const AssignHoliday_LIST = `${BASE_URL}/api/AssignHoliday/getAll`;
    export const ADD_AssignHoliday_DATA = `${BASE_URL}/api/AssignHoliday/add`;
    export const GET_AssignHolidaySearch_URL = `${BASE_URL}/api/AssignHoliday/search`;
    export const GET_AssignHolidayBYID_URL = `${BASE_URL}/api/AssignHoliday/getBy`;
    export const UPDATE_AssignHoliday_URL = `${BASE_URL}/api/AssignHoliday/update`;


    //Race

    export const Race_LIST = `${BASE_URL}/api/race/getAll`;
    export const ADD_Race_DATA = `${BASE_URL}/api/race/create`;
    export const GET_RaceSearch_URL = `${BASE_URL}/api/race/search`;
    export const GET_RaceBYID_URL = `${BASE_URL}/api/race/getBy`;
    export const UPDATE_Race_URL = `${BASE_URL}/api/race/update`;
        //NATIONALITY

        export const Nationality_LIST = `${BASE_URL}/api/nationality/getAll`;
        export const ADD_Nationality_DATA = `${BASE_URL}/api/nationality/addNationality`;
        export const GET_NationalitySearch_URL = `${BASE_URL}/api/nationality/search`;
        export const GET_NationalityBYID_URL = `${BASE_URL}/api/nationality/getBy`;
        export const UPDATE_Nationality_URL = `${BASE_URL}/api/nationality/update`;

         //Education

         export const Education_LIST = `${BASE_URL}/api/education/getAll`
         export const ADD_Education_DATA = `${BASE_URL}/api/education/addEducation`;
         export const GET_EducationSearch_URL = `${BASE_URL}/api/education/search`;
         export const GET_EducationBYID_URL = `${BASE_URL}/api/education/getBy`;
         export const UPDATE_Education_URL = `${BASE_URL}/api/education/update`;

           //Category

           export const Category_LIST = `${BASE_URL}/api/category/getAll`
           export const ADD_Category_DATA = `${BASE_URL}/api/category/add`;
           export const GET_CategorySearch_URL = `${BASE_URL}/api/category/search`;
           export const GET_CategoryBYID_URL = `${BASE_URL}/api/category/getBy`;
           export const UPDATE_Category_URL = `${BASE_URL}/api/category/update`;
         
         //Bank

         export const Bank_LIST = `${BASE_URL}/api/bank/getAll`
         export const ADD_Bank_DATA = `${BASE_URL}/api/bank/addBank`;
         export const GET_BankSearch_URL = `${BASE_URL}/api/bank/search`;
         export const GET_BankBYID_URL = `${BASE_URL}/api/bank/getBy`;
         export const UPDATE_Bank_URL = `${BASE_URL}/api/bank/update`;
         
         //Career

         export const Career_LIST = `${BASE_URL}/api/career/getAll`
         export const ADD_Career_DATA = `${BASE_URL}/api/career/add`;
         export const GET_CareerSearch_URL = `${BASE_URL}/api/career/search`;
         export const GET_CareerBYID_URL = `${BASE_URL}/api/career/getBy`;
         export const UPDATE_Career_URL = `${BASE_URL}/api/career/update`;


 //custom filds

 export const CustomField_LIST = `${BASE_URL}/api/customfield/getAll`;
 export const ADD_CustomField_DATA = `${BASE_URL}/api/customfield/add`;
 
 export const GET_CustomFieldSearch_URL = `${BASE_URL}/api/fwl/search`;
 export const GET_CustomFieldhBYID_URL = `${BASE_URL}/api/branches/getBy`;
 export const UPDATE_CustomField_URL = `${BASE_URL}/api/branches/updateBranch`;
 
 

 


