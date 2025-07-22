
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
import UpdateDutyRoaster from "views/Roaster/UpdateDutyRoaster";
import Branch from "views/Shift/Branch/Branch";
import AddBranch from "views/Shift/Branch/AddBranch";

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
  path: "/ETMS/DutyRoasterUpdate/:id",
  name: "Add DutyRoaster", 
  icon: "nc-icon nc-chart-pie-35",
  component :UpdateDutyRoaster,
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
