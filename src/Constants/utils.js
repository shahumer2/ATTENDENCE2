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


export const GET_ACTIVE_EMPLOYEE_DATA = `${BASE_URL}/employee/active`;
export const GET_RESIGNED_EMPLOYEE_DATA = `${BASE_URL}/employee/inactive`;


 //shift

 export const Shift_LIST = `${BASE_URL}/api/shifts/search`;
 export const ADD_SHIFT_DATA = `${BASE_URL}/api/shifts/create`;
 export const GET_ShiftSearch_URL = `${BASE_URL}/api/shifts/getShiftDropdown`;
 export const GET_SHIFTBYID_URL = `${BASE_URL}/api/shifts`;
 export const UPDATE_SHIFT_URL = `${BASE_URL}/api/shifts/updateShift`;




 //Groups
 export const Groups_LIST = `${BASE_URL}/api/groups/getAll`;
 export const ADD_Groups_DATA = `${BASE_URL}/api/groups/addGroup`;
 export const GET_GroupsSearch_URL = `${BASE_URL}/api/roaster/getShiftDropdown`;
 export const GET_GroupsBYID_URL = `${BASE_URL}/api/roaster`;
 export const UPDATE_Groups_URL = `${BASE_URL}/api/roaster/updateShift`;
 export const DELETE_Group = `${BASE_URL}/api/groups/deleteGroup`;


  //AutoShift
  export const AutoShift_LIST = `${BASE_URL}/api/roaster/search`;
  export const ADD_AutoShift_DATA = `${BASE_URL}/api/roaster/create`;
  export const GET_AutoShiftSearch_URL = `${BASE_URL}/api/roaster/getShiftDropdown`;
  export const GET_AutoShift_URL = `${BASE_URL}/api/roaster`;
  export const UPDATE_AutoShift_URL = `${BASE_URL}/api/roaster/updateShift`;

   //Roaster

 export const DutyRoaster_LIST = `${BASE_URL}/api/roaster/allRosters`;
 export const ADD_DutyROASTER_DATA = `${BASE_URL}/api/roaster/create`;
 export const GET_DutyRoasterSearch_URL = `${BASE_URL}/api/roaster/search`;
 export const GET_DutyROASTERBYID_URL = `${BASE_URL}/api/roaster`;
 export const UPDATE_DutyROASTER_URL = `${BASE_URL}/api/roaster/updateShift`;
 
 

 


