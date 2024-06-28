import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import api from "../../../services/api";
import { create } from 'lodash';

export default function ProductForm({fetchArtikli}) {
    const [formData, setFormData] = useState({
        naziv: '',
        kolicina: '',
        prodajnaCena: '',
        dobavnaCena: '',
        lokacijaArtikla: '',
        tip_artikla: ''
    });

    const tipArtiklaOptions = [
        { label: 'VRT', value: 'VRT' },
        { label: 'POHIŠTVO', value: 'POHISTVO' },
        { label: 'GRADNJA', value: 'GRADNJA' },
        { label: 'TEHNIKA', value: 'TEHNIKA' },

    ];

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchArtikli();
        createArtikel();
    };

    const createArtikel = () => {
      api.post(`/artikli`, formData)
        .then((result) => {
          console.log(result.data);
          fetchArtikli();
        })
        .catch((error) => {
          console.error('There was an error creating new product!', error);
        });
   };

   const [artikli, setArtikli] = useState([]);
   
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
                label="Količina"
                name="kolicina"
                type="number"
                value={formData.kolicina}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Prodajna Cena"
                name="prodajnaCena"
                type="number"
                value={formData.prodajnaCena}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Dobavna Cena"
                name="dobavnaCena"
                type="number"
                value={formData.dobavnaCena}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Lokacija Artikla"
                name="lokacijaArtikla"
                value={formData.lokacijaArtikla}
                onChange={handleChange}
                margin="normal"
                fullWidth
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="tip-artikla-label">Tip Artikla</InputLabel>
                <Select
                    labelId="tip-artikla-label"
                    label="Tip Artikla"
                    name="tip_artikla"
                    value={formData.tip_artikla}
                    onChange={handleChange}
                >
                    {tipArtiklaOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                Ustvari
            </Button>
        </form>
    );
};

