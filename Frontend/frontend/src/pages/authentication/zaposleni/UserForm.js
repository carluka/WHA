// import React, { useEffect, useState } from "react";
// import { Grid } from "@mui/material";
// import {
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import api from "../../../services/api";
// import Alert from "@mui/material/Alert";

// export default function UserForm({ fetchUser }) {
//   const [userData, setUserData] = useState({
//     ime: "",
//     priimek: "",
//     username: "",
//     password: "",
//     password2: "",
//     email: "",
//     placa: "",
//     telefon: "",
//     tip_zaposlenega: "",
//   });
//   const [showAlert, setShowAlert] = useState(false);

//   const handleChange = (event) => {
//     setUserData({ ...userData, [event.target.name]: event.target.value });
//   };

//   const createUser = () => {
//     console.log(userData);
//     api
//       .post(`/zaposleni`, userData)
//       .then((result) => {
//         console.log(result.data);
//         fetchUser();
//       })
//       .catch((error) => {
//         console.error("There was an error creating new user!", error);
//       });
//   };

//   const handleCreateUser = (event) => {
//     event.preventDefault();
//     createUser();
//     fetchUser();
//   };

//   const [user, setUsers] = useState([]);

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const showDeleteAlert = () => {
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 3000);
//   };

//   const alertStyle = {
//     position: "fixed", // Fixed position
//     top: 15, // 10px from the top
//     left: "50%", // Centered horizontally
//     transform: "translateX(-50%)", // Adjust for centering
//     zIndex: 1000, // Ensure it's above other elements
//     margin: "0 auto", // Centering for smaller screens
//     width: "80%", // Responsive width
//     opacity: 0.95, // 85% opacity
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//   };

//   return (
//     <>
//       {showAlert && (
//         <Alert style={alertStyle} severity="success">
//           Zaposleni uspešno izbrisan!
//         </Alert>
//       )}
//       <form onSubmit={handleCreateUser}>
//       <Grid container spacing={1}>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Ime"
//             name="ime"
//             variant="outlined"
//             onChange={handleChange}
//             value={userData.ime}
//             fullWidth
//             margin="normal"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Priimek"
//             name="priimek"
//             variant="outlined"
//             onChange={handleChange}
//             value={userData.priimek}
//             fullWidth
//             margin="normal"
//           />
//         </Grid>
//         <Grid item xs={12}>
//          <TextField
//             label="Uporabniško ime"
//             name="username"
//             variant="outlined"
//             onChange={handleChange}
//             value={userData.username}
//             fullWidth
//             margin="normal"
//          />
//         </Grid>
//         <Grid item xs={6}>
//          <TextField
//             label="Geslo"
//             name="password"
//             type="password"
//             variant="outlined"
//             onChange={handleChange}
//             value={userData.password}
//             fullWidth
//             margin="normal"
//          />
//         </Grid>
//         <Grid item xs={6}>
//          <TextField
//             label="Ponovi geslo"
//             name="password2"
//             type="password"
//             variant="outlined"
//             onChange={handleChange}
//             value={userData.password2}
//             fullWidth
//             margin="normal"
//          />
//         </Grid>
//         <Grid item xs={12}>
//         <TextField
//           label="E-pošta"
//           name="email"
//           variant="outlined"
//           onChange={handleChange}
//           value={userData.email}
//           fullWidth
//           margin="normal"
//         />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//         <TextField
//           label="Plača"
//           name="placa"
//           type="number"
//           variant="outlined"
//           onChange={handleChange}
//           value={userData.placa}
//           fullWidth
//           margin="normal"
//         />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//         <TextField
//           label="Telefon"
//           name="telefon"
//           type="tel"
//           variant="outlined"
//           onChange={handleChange}
//           value={userData.telefon}
//           fullWidth
//           margin="normal"
//         />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//         <FormControl fullWidth variant="outlined" margin="normal">
//           <InputLabel id="role-select-label">Delovno Mesto</InputLabel>
//           <Select
//             labelId="role-select-label"
//             name="tip_zaposlenega"
//             value={userData.tip_zaposlenega}
//             label="Delovno Mesto"
//             onChange={handleChange}
//           >
//             <MenuItem value="VODJA_PODJETJA">Vodja podjetja</MenuItem>
//             <MenuItem value="DOKUMENTARIST">Dokumentarist</MenuItem>
//             <MenuItem value="SKLADISCNIK">Skladiščnik</MenuItem>
//             <MenuItem value="VODJA_SKLADISCA">Vodja skladišča</MenuItem>
//           </Select>
//         </FormControl>
//         </Grid>
//       </Grid>
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//          <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             style={{
//                marginTop: "20px",
//                width: '30%', // Increased button width
//             }}
//          >
//             Ustvari
//          </Button>
//       </div>
//       </form>
//     </>
//   );
// }



import { useEffect, useState } from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Stack, IconButton, InputAdornment, OutlinedInput, FormHelperText, Typography } from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import api from '../../../services/api';
import Alert from '@mui/material/Alert';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

export default function UserForm({ fetchUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [level, setLevel] = useState();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formSchema = Yup.object().shape({
   ime: Yup.string().max(255).required('Ime je obvezno'),
   priimek: Yup.string().max(255).required('Priimek je obvezen'),
   email: Yup.string().email('Vpisi veljaven email').max(255).required('Email je obvezen'),
   password: Yup.string().max(255).required('Geslo je obvezno'),
   password2: Yup.string()
     .required('Prosim potrdi svoje geslo')
     .oneOf([Yup.ref('password'), null], 'Gesli se ne ujemata'),
   placa: Yup.number().required('Določi plačo'),
   telefon: Yup.string()
      .min(11, 'Vpiši veljavno telefonsko številko oblike: 000 000 000')
      .max(11, 'Vpiši veljavno telefonsko številko:  000 000 000')
      .required('Telefonska številka je obvezna'),
   tip_zaposlenega: Yup.string().required('Izberi delovno mesto'),
   // Add other validation rules as needed
 });

 const changePassword = (value) => {
   const temp = strengthIndicator(value);
   setLevel(strengthColor(temp));
 };

 useEffect(() => {
   changePassword('');
 }, []);


  const handleSubmit = (values, actions) => {
   console.log(values)
    api.post("/zaposleni", values)
      .then((result) => {
        console.log(result.data);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        fetchUser();
      })
      .catch((error) => {
        console.error("There was an error creating new user!", error);
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  };

  const alertStyle = {
    position: "fixed",
    top: 15,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
    margin: "0 auto",
    width: "80%",
    opacity: 0.95,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <>
      {showAlert && (
        <Alert style={alertStyle} severity="success">
          Zaposleni uspešno izbrisan!
        </Alert>
      )}
     <Formik
        initialValues={{
          ime: '',
          priimek: '',
          username: '',
          password: '',
          password2: '',
          email: '',
          placa: '',
          telefon: '',
          tip_zaposlenega: '',
          // Add other initial values
        }}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
    >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              {/* Add other input fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ime"
                  name="ime"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.ime}
                  fullWidth
                  margin="normal"
                  error={Boolean(touched.ime && errors.ime)}
                  helperText={touched.ime && errors.ime}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Priimek"
                  name="priimek"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.priimek}
                  fullWidth
                  margin="normal"
                  error={Boolean(touched.priimek && errors.priimek)}
                  helperText={touched.priimek && errors.priimek}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Uporabniško ime"
                  name="username"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  fullWidth
                  margin="normal"
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password">Geslo</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                     handleChange(e);
                     changePassword(e.target.value);
                   }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password">
                      {errors.password}
                    </FormHelperText>
                  )}
                  
                </Stack>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password2">Ponovi geslo</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password2 && errors.password2)}
                    id="password2"
                    type={showPassword ? 'text' : 'password'}
                    //value={values.password2}
                    name="password2"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                  />
                  {touched.password2 && errors.password2 && (
                    <FormHelperText error id="helper-text-password2">
                      {errors.password2}
                    </FormHelperText>
                  )}
                  
                </Stack>
              </Grid>
            {/* Existing fields... */}
            <Grid item xs={12}>
              <TextField
                label="E-pošta"
                name="email"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                fullWidth
                margin="normal"
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Plača"
                name="placa"
                type="number"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.placa}
                fullWidth
                margin="normal"
                error={Boolean(touched.placa && errors.placa)}
                helperText={touched.placa && errors.placa}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Telefon"
                name="telefon"
                type="tel"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.telefon}
                fullWidth
                margin="normal"
                error={Boolean(touched.telefon && errors.telefon)}
                helperText={touched.telefon && errors.telefon}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="role-select-label">Delovno Mesto</InputLabel>
                <Select
                  labelId="role-select-label"
                  name="tip_zaposlenega"
                  value={values.tip_zaposlenega}
                  label="Delovno Mesto"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.tip_zaposlenega && errors.tip_zaposlenega)}
                >
                  <MenuItem value="VODJA_PODJETJA">Vodja podjetja</MenuItem>
                  <MenuItem value="DOKUMENTARIST">Dokumentarist</MenuItem>
                  <MenuItem value="SKLADISCNIK">Skladiščnik</MenuItem>
                  <MenuItem value="VODJA_SKLADISCA">Vodja skladišča</MenuItem>
                </Select>
                {touched.tip_zaposlenega && errors.tip_zaposlenega && (
                  <FormHelperText error>{errors.tip_zaposlenega}</FormHelperText>
                )}
              </FormControl>
            </Grid>
               <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                     type="submit"
                     variant="contained"
                     color="primary"
                     style={{
                        marginTop: "20px",
                        width: '30%', // Increased button width
                     }}
                     >
                     Ustvari
               </Button>
            </div>
         </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}