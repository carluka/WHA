import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import api from "../../../services/api";

export default function UrediArtikelScanner({ articleToEdit, onCancel, onArtikelUpdated }) {
    const [formData, setFormData] = useState({
        naziv: '',
        kolicina: '',
        prodajnaCena: '',
        dobavnaCena: '',
        lokacijaArtikla: '',
        tipArtikla: ''
    });

    useEffect(() => {
        if (articleToEdit) {
            setFormData({
                naziv: articleToEdit.naziv,
                kolicina: articleToEdit.kolicina,
                prodajnaCena: articleToEdit.prodajnaCena,
                dobavnaCena: articleToEdit.dobavnaCena,
                lokacijaArtikla: articleToEdit.lokacijaArtikla,
                tipArtikla: articleToEdit.tip_artikla
            });
        }
    }, [articleToEdit]);

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
        editArtikel(articleToEdit.id_artikel); // Pass the artikel_id here
        onCancel(); // Call the onCancel function to close the component
    };

    const editArtikel = (artikel_id) => {
      api.put(`/artikli/posodobi/${artikel_id}`, formData)
          .then((result) => {
              console.log(result.data);
              if(onArtikelUpdated) {
                  onArtikelUpdated(artikel_id); // Call the callback with the artikel_id
              }
          })
          .catch((error) => {
              console.error('There was an error editing Artikel!', error);
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
                    name="tipArtikla"
                    value={formData.tipArtikla}
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
                Posodobi
            </Button>
        </form>
    );
};
