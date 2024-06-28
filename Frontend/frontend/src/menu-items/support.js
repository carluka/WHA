// assets
import { ChromeOutlined, QuestionOutlined, CameraOutlined, FormOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
  CameraOutlined,
  FormOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //


const isUserRole = (role) => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   return user && user.role === role;
 };
 
 const supportChildren = [
   (isUserRole('SKLADISCNIK') || isUserRole('VODJA_SKLADISCA') || isUserRole('VODJA_PODJETJA')) && {
     id: 'scanner',
     title: 'Scanner',
     type: 'item',
     url: '/artikli/scanner',
     icon: icons.CameraOutlined,
     target: false
   },
   (isUserRole('SKLADISCNIK') || isUserRole('VODJA_SKLADISCA') || isUserRole('VODJA_PODJETJA')) && {
      id: 'priprava',
      title: 'Priprava',
      type: 'item',
      url: '/priprava',
      icon: icons.FormOutlined,
      target: false
    }
 ].filter(Boolean);
 
 const support = {
   id: 'support',
   title: (isUserRole('VODJA_PODJETJA') || isUserRole('SKLADISCNIK') || isUserRole('VODJA_SKLADISCA')) ? 'Priprava Naročil' : '',
   type: 'group',
   children: supportChildren
 };
 
 export default support;