import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from "../../../services/api";

// material-ui
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { VpnLock } from '../../../../node_modules/@mui/icons-material/index';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = ({ setLoginError }) => {
  const [checked, setChecked] = React.useState(false);


  const navigate = useNavigate(); 

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const values = {
   username: ' ', 
   password: ' ', 
 };

  const prijava = (formValues) => {
   console.log(formValues)
   api.post(`/zaposleni/prijava`, formValues)
    .then((result) => {
      console.log(result.data);
      if (result.data && result.data.ime && result.data.priimek && result.data.id) {
        const user = {
          ime: result.data.ime,
          priimek: result.data.priimek,
          id: result.data.id,
          role: result.data.role,
          isAuthenticated: true
        }
        sessionStorage.setItem('user', JSON.stringify(user));
        prijavaEnabled()
        navigate('/delovniCas');
        window.location.reload();
      } else {
         setLoginError('Login failed. Please check your username and password.');
      }
    })
    .catch((error) => {
      console.error('There was an error logging in!', error);
      setLoginError('Napaka. Napačno uporabniško ime ali geslo.');
    });
   };

   const prijavaEnabled = () => {
      const userString = sessionStorage.getItem('user');

      if (userString) {
       const userObject = JSON.parse(userString);
       const zaposleni_id = userObject.id
       enabled(zaposleni_id)
      }
   }

   const enabled = (zaposleni_id) => {
      api.put(`/zaposleni/posodobiAuthTrue/${zaposleni_id}`)
      .then((result) => {

      })
      .catch((error) => {
          console.error('There was an error editing Artikel!', error);
      });
   };

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
         username: Yup.string()
           .required('Potrebno je vnesti uporabniško ime'),
         password: Yup.string()
           .required('Potrebno je vnesti geslo')
       })}       
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
         console.log(values)
          try {
            prijava(values);
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="username-login">Uporabniško ime</InputLabel>
                  <OutlinedInput
                    id="username-login"
                    type="username"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Vpiši uporabniško ime"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                  {touched.username && errors.username && (
                    <FormHelperText error id="standard-weight-helper-text-username-login">
                      {errors.username}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Geslo</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Vpiši geslo"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Zapomni si me</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to="" color="text.primary">
                    Pozabljeno Geslo?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    PRIJAVA
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
