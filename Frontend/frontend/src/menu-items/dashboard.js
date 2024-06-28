// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const isUserRole = (role) => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   return user && user.role === role;
 };
 
 const filteredDashboardChildren = [
   isUserRole('VODJA_PODJETJA') && {
     id: 'dashboard',
     title: 'Statistika',
     type: 'item',
     url: '/dashboard/default',
     icon: icons.DashboardOutlined,
     breadcrumbs: false
   }
 ].filter(Boolean);
 
 const dashboard = {
   id: 'group-dashboard',
   type: 'group',
   children: filteredDashboardChildren
 };
 
 export default dashboard;
