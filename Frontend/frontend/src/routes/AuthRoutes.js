// import React from 'react';
// import { Navigate, Routes } from 'react-router-dom';

// const ProtectedRoute = ({ element }) => {

//    const isLoggedIn = Object.keys(sessionStorage).length > 0;

//    const userString = sessionStorage.getItem('user');

//    if (userString) {
//       const userObject = JSON.parse(userString);
//       const isAuthenticated = userObject.isAuthenticated;

//       console.log(userObject.isAuthenticated);  

//       if (isLoggedIn && isAuthenticated) {
//          return element;
//       } else {
//          return <Navigate to="/login" />;
//       }

//    } else {
//       return <Navigate to="/login" />;
//    }
// };

// export default ProtectedRoute;



/// IMPLEMENTACIJA ZAKRIVANJA LINKOV ZA NEPOOBLAŠČENE