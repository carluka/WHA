import { Link } from 'react-router-dom';
import { Alert } from '@mui/material';
import React, { useState } from 'react';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //

const Login = () => {

   const [loginError, setLoginError] = useState('');

  return (
   <AuthWrapper>
     {loginError && (
       <Alert
         severity="error"
         sx={{
           position: 'absolute', 
           top: 16, 
           left: '50%',
           transform: 'translateX(-50%)',
           width: 'calc(100% - 32px)', 
           mb: 2,
           bgcolor: 'error.dark', 
           color: 'white', 
           '& .MuiAlert-icon': { 
             color: 'white'
           }
         }}
       >
         {loginError}
       </Alert>
     )}
     <Grid container spacing={3}>
       <Grid item xs={12}>
         <AuthLogin setLoginError={setLoginError} />
       </Grid>
     </Grid>
   </AuthWrapper>
 );
 
 
};


export default Login;


//{showAlert && <Alert style={alertStyle} severity="success">Zaposleni uspešno izbrisan!</Alert>}