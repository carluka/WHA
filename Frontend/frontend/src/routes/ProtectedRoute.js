import React from 'react';
import { Navigate, Routes } from 'react-router-dom';

const ProtectedRoute = ({ element, element2 }) => {

   const isLoggedIn = Object.keys(sessionStorage).length > 0;

   const userString = sessionStorage.getItem('user');

   if (userString) {
      const userObject = JSON.parse(userString);
      const isAuthenticated = userObject.isAuthenticated;
      const role = userObject.role;

      console.log(userObject.isAuthenticated); 

      if (  role == 'VODJA_PODJETJA' ) {
         return element2;
      } else {
         if (isLoggedIn && isAuthenticated) {
            return element;
         } else {
            return <Navigate to="/login" />;
         }
      }
   } else {
      return <Navigate to="/login" />;
   }
};

export default ProtectedRoute;
