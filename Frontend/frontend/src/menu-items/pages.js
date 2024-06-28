// assets
import { LoginOutlined, ProfileOutlined, UserOutlined, UnorderedListOutlined, TeamOutlined, FieldTimeOutlined } from '@ant-design/icons';
 
// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  FieldTimeOutlined
};
 
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //
 
 
 const isUserRole = (role) => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   return user && user.role === role;
 };
 
 const filteredChildren = [
   isUserRole('VODJA_PODJETJA') && {
     id: 'register1',
     title: 'Zaposleni',
     type: 'item',
     url: '/zaposleni',
     icon: icons.UserOutlined,
     target: false
   },
   (isUserRole('VODJA_SKLADISCA') || isUserRole('DOKUMENTARIST') || isUserRole('VODJA_PODJETJA')) && {
     id: 'pregledArtiklov',
     title: 'Artikli',
     type: 'item',
     url: '/artikli',
     icon: icons.UnorderedListOutlined,
     target: false
   },
   (isUserRole('VODJA_PODJETJA') || isUserRole('DOKUMENTARIST')) && {
     id: 'pregledNarocil',
     title: 'Naročila',
     type: 'item',
     url: '/narocila',
     icon: icons.ProfileOutlined,
     target: false
   },
   (isUserRole('VODJA_PODJETJA') || isUserRole('DOKUMENTARIST')) && {
     id: 'pregledStrank',
     title: 'Stranke',
     type: 'item',
     url: '/stranka',
     icon: icons.TeamOutlined,
     target: false
   }
 ].filter(Boolean);
 
 const pages = {
   id: 'authentication',
   title: (isUserRole('VODJA_PODJETJA') || isUserRole('DOKUMENTARIST') || isUserRole('VODJA_SKLADISCA')) ? 'Pregled' : '',
   type: 'group',
   children: filteredChildren
 };
 
 export default pages;