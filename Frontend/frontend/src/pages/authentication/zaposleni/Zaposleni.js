import { Link } from 'react-router-dom';
import api from "../../../services/api";
import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CreateUser from './UserForm';


// material-ui
//import { Grid, Stack, Typography } from '@mui/material';

// project import
//import FirebaseRegister from '../auth-forms/AuthRegister';
//import AuthWrapper from '../AuthWrapper';
import MainCard from '../../../components/MainCard';
//import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Button } from "@mui/material";

// ================================|| REGISTER ||================================ //

const Zaposleni = () => {
   const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState({
     ime: '',
     priimek: '',
     username: '',
     password: '',
     email: '',
     placa: '',
     telefon: '',
     role: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (event) => {
     setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const createUser = () => {
     api.post(`/zaposleni`, userData)
       .then((result) => {
         console.log(result.data);
         fetchUser();
       })
       .catch((error) => {
         console.error('There was an error creating new user!', error);
       });
  };

  const handleCreateUser = (event) => {
     event.preventDefault();
     createUser();
  };

  const [user, setUsers] = useState([]);

  const fetchUser = () => {
     api.get("/zaposleni").then((result) => {
         setUsers(result.data);
         console.log(result.data)
     });
  };

  useEffect(() => {
     fetchUser();
  }, []);


  const showDeleteAlert = () => {
     setShowAlert(true);
     setTimeout(() => setShowAlert(false), 3000);
 };

 const toggleForm = () => {
   setShowForm(!showForm);
};

 const alertStyle = {
    position: 'fixed', // Fixed position
    top: 15,          // 10px from the top
    left: '50%',      // Centered horizontally
    transform: 'translateX(-50%)', // Adjust for centering
    zIndex: 1000,     // Ensure it's above other elements
    margin: '0 auto', // Centering for smaller screens
    width: '80%',      // Responsive width
    opacity: 0.95,  // 85% opacity
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
};


return (
   <>
     {showAlert && <Alert style={alertStyle} severity="success">Zaposleni uspešno izbrisan!</Alert>}
     {showForm &&  <MainCard style={{marginBottom: '20px'}}>

                  <CreateUser
                  //formData={userData}
                  setFormData={userData}
                  fetchUser={fetchUser}
                  handleSubmit={(event) => {
                     event.preventDefault();
                  }}
              />
              
         </MainCard>
         }
     <MainCard>
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}> {/* Added marginBottom */}
       <Button variant="contained" onClick={toggleForm}>
                      {showForm ? <><CloseIcon /> Zapri</> : <><AddIcon /> Ustvari</>}
                  </Button>
       </div>
       <UserTable users={user} fetchUser={fetchUser} showDeleteAlert={showDeleteAlert} />
     </MainCard>
   </>
 );
 
};

export default Zaposleni;




 ///             REGISTER MAIN PAGE
  /*<MainCard>
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Sign sp</Typography>
          <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Already have an account?
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <FirebaseRegister />
      </Grid>
    </Grid>
  </AuthWrapper>
  </MainCard>*/


  /// DELUJOČ FORM ZA CREATE USER

  /*<form onSubmit={handleCreateUser}>
  <TextField name="ime" label="Ime" variant="standard" onChange={handleChange} value={userData.ime} />
  <TextField name="priimek" label="Priimek" variant="standard" onChange={handleChange} value={userData.priimek} />
  <TextField name="username" label="Uporabniško ime" variant="standard" onChange={handleChange} value={userData.username} />
  <TextField name="password" label="Geslo" type="password" variant="standard" onChange={handleChange} value={userData.password} />
  <TextField name="email" label="E-pošta" variant="standard" onChange={handleChange} value={userData.email} />
  <TextField name="placa" label="Plača" variant="standard" onChange={handleChange} value={userData.placa} />
  <TextField name="telefon" label="Telefon" variant="standard" onChange={handleChange} value={userData.telefon} />
  <FormControl fullWidth>
     <InputLabel id="role-select-label">Delovno Mesto</InputLabel>
     <Select
        labelId="role-select-label"
        name="role"
        value={userData.role}
        label="Delovno Mesto"
        onChange={handleChange}
     >
        <MenuItem value="Vodja podjetja">Vodja podjetja</MenuItem>
        <MenuItem value="Dokumentarist">Dokumentarist</MenuItem>
        <MenuItem value="Skladiščnik">Skladiščnik</MenuItem>
        <MenuItem value="Vodja skladišča">Vodja skladišča</MenuItem>
     </Select>
  </FormControl>
  <Button type="submit" variant="contained">Ustvari</Button>
</form>*/