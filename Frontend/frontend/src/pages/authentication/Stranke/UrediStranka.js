import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import api from "../../../services/api";

export default function UrediStranka({ strankaToEdit, fetchStranka, onCancel }) {
    const [formData, setFormData] = useState({
      naziv: '',
      kraj: '',
      ulica: '',
      postnaSt: '',
      drzava: '',
      telefon: '',
      email: '',
    });

    useEffect(() => {
        if (strankaToEdit) {
            setFormData({
                naziv: strankaToEdit.naziv,
                kraj: strankaToEdit.kraj,
                ulica: strankaToEdit.ulica,
                postnaSt: strankaToEdit.postnaSt,
                drzava: strankaToEdit.drzava,
                telefon: strankaToEdit.telefon,
                email: strankaToEdit.email,
            });
        }
    }, [strankaToEdit]);


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchStranka();
        editStranka(strankaToEdit.id_stranka);
        onCancel();
    };

    const editStranka = (stranka_id) => {
        api.put(`/stranka/posodobi/${stranka_id}`, formData)
            .then((result) => {
                console.log(result.data);
                fetchStranka();
            })
            .catch((error) => {
                console.error('There was an error editing Stranka!', error);
            });
    };

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
                Posodobi
            </Button>
        </form>
    );
};
