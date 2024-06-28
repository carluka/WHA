import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import api from "../../../services/api";
import { create } from 'lodash';

export default function StrankaForm({fetchStranka}) {
    const [formData, setFormData] = useState({
      naziv: '',
      kraj: '',
      ulica: '',
      postnaSt: '',
      drzava: '',
      telefon: '',
      email: '',
    });


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchStranka();
        createStranka();
    };

    const createStranka = () => {
      api.post(`/stranka`, formData)
        .then((result) => {
          console.log(result.data);
          fetchStranka();
        })
        .catch((error) => {
          console.error('There was an error creating new stranka!', error);
        });
   };

   const [stranka, setStranka] = useState([]);
   
    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Naziv"
                name="naziv"
                value={formData.naziv}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Kraj"
                name="kraj"
                value={formData.kraj}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Ulica"
                name="ulica"
                value={formData.ulica}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Poštna Številka"
                name="postnaSt"
                type="number"
                value={formData.postnaSt}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Država"
                name="drzava"
                value={formData.drzava}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Telefon"
                name="telefon"
                value={formData.telefon}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                Ustvari
            </Button>
        </form>
    );
};

