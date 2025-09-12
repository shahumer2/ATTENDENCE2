
import Company from "views/Company/Company";
import Dashboard from "views/Dashboard.js";
import Department from "views/Department/Department";
import User from "views/Users/User";
// import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";
import AddEmployee from "views/Employee/AddEmployee";
import ViewUser from "views/Users/ViewUser";
import ViewEmployee from "views/Employee/ViewEmployee";
import Shift from "views/Shift/Shift";
import AddShift from "views/Shift/AddShift";
import UpdateShift from "views/Shift/UpdateShift";
import AddDutyRoaster from "views/Roaster/AddDutyRoaster";
import DutyRoaster from "views/Roaster/DutyRoaster";
import AutoShift from "views/Shift/AutoShift/AutoShift";
import AddAutoShift from "views/Shift/AutoShift/AddAutoShift";
import Group from "views/Shift/Group/Group";
import AddGroup from "views/Shift/Group/AddGroup";
import UpdateAutoShift from "views/Shift/AutoShift/UpdateAutoShift";
import UpdateDutyRoaster from "views/Roaster/UpdateDutyRoaster";
import Branch from "views/Shift/Branch/Branch";
import AddBranch from "views/Shift/Branch/AddBranch";
import UpdateBranch from "views/Shift/Branch/UpdateBranch";
import Race from "views/Master/Race";
import Allowance from "views/Allowance/Allowance";
import ViewAllowance from "views/Allowance/ViewAllowance";
import UpdateAllowance from "views/Allowance/UpdateAllowance";
import ViewEmployeeQr from "views/Employee/ViewEmployeeQr";
import LeaveGroup from "views/Master/LeaveGroup/LeaveGroup";
import HolidayManagement from "views/Master/HolidayGroup/HolidayGroup";
import LeaveCategory from "views/LeaveManagement/LeaveCategory";
import AddLeaveCategory from "views/LeaveManagement/AddLeaveCategory";
import BatchLeave from "views/LeaveManagement/BatchLeave/BatchLeave";
import AddJob from "views/Job/AddJob";
import ViewJob from "views/Job/ViewJob";
import BranchAllocation from "views/Shift/Branch/BranchAllocation";
import MaternityLeave from "views/LeaveManagement/MaternityLeave/MaternityLeave";
import PaternityLeave from "views/LeaveManagement/PaternityLeave/PaternityLeave";
import  JobMap  from "views/Job/JobMap";

// import Typography from "views/Typography.js";
// import Icons from "views/Icons.js";
// import Maps from "views/Maps.js";
// import Notifications from "views/Notifications.js";
// import Upgrade from "views/Upgrade.js";

const dashboardRoutes = [
  // {
  //   upgrade: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "nc-icon nc-alien-33",
  //   component: Upgrade,
  //   layout: "/admin",
  // },
  {
    path: "/user/add",
    name: "User", 
    icon: "nc-icon nc-chart-pie-35",
    component: User,
    layout: "/admin",
  },
  {
    path: "/user/view",
    name: "View User", 
    icon: "nc-icon nc-chart-pie-35",
    component: ViewUser,
    layout: "/admin",
  },
  {
    path: "/employee/add",
    name: "Add Employee", 
    icon: "nc-icon nc-chart-pie-35",
    component :AddEmployee,
    layout: "/admin",
  },
  {
    path: "/employee/view",
    name: "View Employee", 
    icon: "nc-icon nc-chart-pie-35",
    component :ViewEmployee,
    layout: "/admin",
  },


  //leave group and type

  {
    path: "/leaveGroupType",
    name: "View Leave Group", 
    icon: "nc-icon nc-chart-pie-35",
    component :LeaveGroup,
    layout: "/admin",
  },

    //leave Category

    {
      path: "/ELeave/LeaveCategory",
      name: "View Leave Category", 
      icon: "nc-icon nc-chart-pie-35",
      component :LeaveCategory,
      layout: "/admin",
    },
//batch leave
    {
      path: "/ELeave/batchLeave",
      name: "View Leave Category", 
      icon: "nc-icon nc-chart-pie-35",
      component :BatchLeave,
      layout: "/admin",
    },
    //maternity leave
    {
      path: "/ELeave/MatnLvSettings",
      name: "View Leave Category", 
      icon: "nc-icon nc-chart-pie-35",
      component :MaternityLeave,
      layout: "/admin",
    },
    //paternity leave
    {
      path: "/ELeave/PaternityLvSettings",
      name: "View Leave Category", 
      icon: "nc-icon nc-chart-pie-35",
      component :PaternityLeave,
      layout: "/admin",
    },
    
    {
      path: "/LeaveCategory/add",
      name: "View Leave Category", 
      icon: "nc-icon nc-chart-pie-35",
      component :AddLeaveCategory,
      layout: "/admin",
    },





  //Holiday Group


  
  {
    path: "/CommonMasters/HolidayMaster",
    name: "View Leave Group", 
    icon: "nc-icon nc-chart-pie-35",
    component :HolidayManagement,
    layout: "/admin",
  },

  //app mobile tms
  {
    path: "/MobileTMS/StaffQRCode",
    name: "View Employee", 
    icon: "nc-icon nc-chart-pie-35",
    component :ViewEmployeeQr,
    layout: "/admin",
  },
  {
    path: "/shift/view",
    name: "View Shift", 
    icon: "nc-icon nc-chart-pie-35",
    component :Shift,
    layout: "/admin",
  },
  {
    path: "/shift/add",
    name: "View Shift", 
    icon: "nc-icon nc-chart-pie-35",
    component :AddShift,
    layout: "/admin",
  },

  {
    path: "/shiftUpdate/:id",
    name: "View Shift", 
    icon: "nc-icon nc-chart-pie-35",
    component :UpdateShift,
    layout: "/admin",
  },

  //Roasters

  {
    path: "/ETMS/DutyRoaster",
    name: "View DutyRoaster", 
    icon: "nc-icon nc-chart-pie-35",
    component :DutyRoaster,
    layout: "/admin",
  },
  {
    path: "/ETMS/DutyRoaster/add",
    name: "Add DutyRoaster", 
    icon: "nc-icon nc-chart-pie-35",
    component :AddDutyRoaster,
    layout: "/admin",
  },
  {
    path: "/ETMS/DutyRoasterUpdate/:id",
    name: "Add DutyRoaster", 
    icon: "nc-icon nc-chart-pie-35",
    component :UpdateDutyRoaster,
    layout: "/admin",
  },

//Branch 

{
  path: "/ETMS/Branch",
  name: "View Branch", 
  icon: "nc-icon nc-chart-pie-35",
  component :Branch,
  layout: "/admin",
},
{
  path: "/ETMS/Branch/add",
  name: "Add Branch", 
  icon: "nc-icon nc-chart-pie-35",
  component :AddBranch,
  layout: "/admin",
},
{
  path: "/ETMS/BranchUpdate/:id",
  name: "Add DutyRoaster", 
  icon: "nc-icon nc-chart-pie-35",
  component :UpdateBranch,
  layout: "/admin",
},

//branch allocation 
{
  path: "/ETMS/BranchAllocation",
  name: "Branch Allocation", 
  icon: "nc-icon nc-chart-pie-35",
  component :BranchAllocation,
  layout: "/admin",
},


//race  master>> race

{
  path: "/Epayroll/Race",
  name: "Add Race", 
  icon: "nc-icon nc-chart-pie-35",
  component :Race,
  layout: "/admin",
},







  // Auto SHift
  {
    path: "/ETMS/AutoShift",
    name: "View AutoShift", 
    icon: "nc-icon nc-chart-pie-35",
    component :AutoShift,
    layout: "/admin",
  },
  {
    path: "/ETMS/AutoShift/add",
    name: "Add AutoShift", 
    icon: "nc-icon nc-chart-pie-35",
    component :AddAutoShift,
    layout: "/admin",
  },
   {
    path: "/ETMS/AutoShift/edit/:id",
    name: "Update AutoShift", 
    icon: "nc-icon nc-chart-pie-35",
    component :UpdateAutoShift,
    layout: "/admin",
  },


  //Allowance
{
    path: "allowance/view",
    name: "View Allowance", 
    icon: "nc-icon nc-chart-pie-35",
    component :Allowance,
    layout: "/admin",
  },
  {
    path: "allowance/viewAllowance",
    name: "View Allowance", 
    icon: "nc-icon nc-chart-pie-35",
    component :ViewAllowance,
    layout: "/admin",
  },

  {
    path: "allowance/UpdateAllowance/:id",
    name: "Update Allowance", 
    icon: "nc-icon nc-chart-pie-35",
    component :UpdateAllowance,
    layout: "/admin",
  },

//Job
{
    path: "job/addJob",
    name: "View Allowance", 
    icon: "nc-icon nc-chart-pie-35",
    component :AddJob,
    layout: "/admin",
  },

  {
    path: "job/viewJob",
    name: "View Allowance", 
    icon: "nc-icon nc-chart-pie-35",
    component :ViewJob,
    layout: "/admin",
  },
    {
    path: "job/map/:id",
    name: "Job Map", 
    icon: "nc-icon nc-chart-pie-35",
    component :JobMap,
    layout: "/admin",
  },



  //Group

  {
    path: "/ETMS/Groups",
    name: "View Groups", 
    icon: "nc-icon nc-chart-pie-35",
    component :Group,
    layout: "/admin",
  },
  {
    path: "/ETMS/Groups/add",
    name: "Add Groups", 
    icon: "nc-icon nc-chart-pie-35",
    component :AddGroup,
    layout: "/admin",
  },






  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/department",
    name: "Department",
    icon: "nc-icon nc-chart-pie-35",
    component: Department,
    layout: "/admin",
  },
  {
    path: "/company",
    name: "Company",
    icon: "nc-icon nc-chart-pie-35",
    component: Company,
    layout: "/admin",
  },


  // {
  //   path: "/user",
  //   name: "Attendance Register",
  //   icon: "nc-icon nc-circle-09",
  //   component: UserProfile,
  //   layout: "/admin",
  // },
  {
    path: "/table",
    name: "Attendance Register",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin",
  },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-paper-2",
  //   component: Typography,
  //   layout: "/admin",
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-atom",
  //   component: Icons,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: Maps,
  //   layout: "/admin",
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications,
  //   layout: "/admin",
  // },
];

export default dashboardRoutes;
