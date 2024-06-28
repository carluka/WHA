import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Paper, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'components/MainCard';
import Autocomplete from '@mui/material/Autocomplete';
import api from '../../../services/api';
import { format, addDays } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';



const DodajNarocilo = ({ setShowTable, setShowNarocilo, fetchNarocila, setShowForm, editMode, editFormData }) => {
  // ===================================================================================== STRANKA =========================================================================
  const [selectedStranka, setSelectedStranka] = useState(null); // Store the selected stranka object
  const [field2Value, setField2Value] = useState('');
  const [field3Value, setField3Value] = useState('');
  const [field4Value, setField4Value] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await api.get('/stranka');
        const data = response.data;

        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  useEffect(() => {
    // Update Field 2, Field 3, and Field 4 when selectedStranka changes
    if (selectedStranka) {
      setField2Value(selectedStranka.email);
      setField3Value(selectedStranka.telefon);
      setField4Value(selectedStranka.kraj);
    } else {
      // Clear other fields when selectedStranka is null (field1 is cleared)
      setField2Value('');
      setField3Value('');
      setField4Value('');
    }
  }, [selectedStranka]);

  // ===================================================================================== ARTIKLI =========================================================================
  const [tableData, setTableData] = useState([
    { col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', selectedArtikel: null },
  ]);
  const [suggestionsArtikli, setArtikliSuggestions] = useState([]);

  const addRow = () => {
    setTableData([...tableData, { col1: '', col2: '', col3: '', col4: '', col5: '', col6: '', selectedArtikel: null }]);
  };

  const handleArtikelChange = async (event, newValue, index) => {
    const updatedTableData = [...tableData];

    // Update selectedArtikel in the row
    updatedTableData[index].selectedArtikel = newValue;
    updatedTableData[index].col2 = newValue ? 1 : '';

    // Fetch additional data (dobavna cena and prodajna cena) for the selected artikel
    if (newValue) {
      try {
        const response = await api.get(`/artikli/${newValue.id_artikel}`);
        const { dobavnaCena, prodajnaCena, kolicina } = response.data;

        // Update dobavna cena and prodajna cena in the row
        updatedTableData[index].col3 = dobavnaCena.toString();
        updatedTableData[index].col4 = prodajnaCena.toString();
        updatedTableData[index].col6 = kolicina.toString();

        // Calculate and update skupaj based on prodajna cena and kolicina
        if (!isNaN(updatedTableData[index].col2)) {
          updatedTableData[index].col5 = (parseFloat(updatedTableData[index].col4) * parseFloat(updatedTableData[index].col2)).toFixed(2);
        }
      } catch (error) {
        console.error('Error fetching artikel details:', error);
      }
    } else {
      // Clear dobavna cena, prodajna cena, and skupaj if no artikel is selected
      updatedTableData[index].col3 = '';
      updatedTableData[index].col4 = '';
      updatedTableData[index].col5 = '';
      updatedTableData[index].col6 = '';
    }

    setTableData(updatedTableData);
  };

  const handleKolicinaChange = (event, index) => {
    const updatedTableData = [...tableData];

    // Update kolicina in the row
    updatedTableData[index].col2 = event.target.value;

    // If prodajna cena is available, calculate and update skupaj
    if (!isNaN(updatedTableData[index].col2) && !isNaN(updatedTableData[index].col4)) {
      updatedTableData[index].col5 = (parseFloat(updatedTableData[index].col4) * parseFloat(updatedTableData[index].col2)).toFixed(2);
    }

    setTableData(updatedTableData);
  };

  useEffect(() => {
    const fetchArtikli = async () => {
      try {
        const response = await api.get('/artikli');
        const data = response.data;

        setArtikliSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchArtikli();
  }, []);

  // ===================================================================================== SPODNJI DEL =========================================================================
  const [bottomLeft1, setBottomLeft1] = useState('');
  const [bottomLeft2, setBottomLeft2] = useState('');
  const [bottomLeft3, setBottomLeft3] = useState('');
  const [skupajSum, setSkupajSum] = useState(0);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // ISO format without time
    setBottomLeft1(formattedDate);

    // Set bottomLeft2 to today's date plus 1 day at 10 am
    const tomorrowDate = addDays(currentDate, 1);
    tomorrowDate.setHours(11, 0, 0, 0);
    const formattedTomorrowDate = tomorrowDate.toISOString().split('.')[0]; // Remove milliseconds
    setBottomLeft2(formattedTomorrowDate);
  }, []);

  useEffect(() => {
    const sum = tableData.reduce((acc, row) => acc + parseFloat(row.col5 || 0), 0);
    setSkupajSum(sum);
  }, [tableData]);

  useEffect(() => {
    setBottomLeft3(skupajSum.toFixed(2));
  }, [skupajSum]);



  // ===================================================================================== SHRANJEVANJE =========================================================================
  const handleSave = async () => {
    const invalidRow = tableData.find(row => parseFloat(row.col2) > parseFloat(row.col6));

    if (invalidRow) {
      // Show an alert if there is an invalid row
      alert('Količina v nekaterih vrsticah je večja od "na zalogi". Popravite to pred shranjevanjem.');
      return; // Prevent saving
    }
    if (!selectedStranka || !selectedStranka.naziv) {
      alert('Naziv stranke ne sme biti prazen.');
      return; // Prevent saving
    }

    // Check if "Artikel" is empty in any row
    const emptyArtikel = tableData.find(row => !row.selectedArtikel);

    if (emptyArtikel) {
      alert('Izberite Artikel za vsako vrstico.');
      return; // Prevent saving
    }

    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const zaposleniID = user.id;

    try {
      // Fetch the current zaposleni
      const zaposleniResponse = await api.get(`/zaposleni/${zaposleniID}`);
      const zaposleni = zaposleniResponse.data;

      // Prepare data to save
      const dataToSave = {
        casPriprave: "0000-01-01T00:00:00",
        cenaSkupaj: bottomLeft3,
        datumVnosa: new Date().toISOString(),
        rokPriprave: bottomLeft2,
        seznamKolicin: tableData.map(row => row.col2),
        stanjeNarocila: "TODO",
        stranka: selectedStranka,
        artikli: tableData.map(row => row.selectedArtikel.id_artikel),
        zaposlen: zaposleni
      };

      // Save the new narocilo
      const result = await api.post(`/narocila`, dataToSave);

      // Fetch all narocila again
      await fetchNarocila();

      // Toggle visibility of NarocilaTable
      setShowTable(true);
      setShowNarocilo(false);
      setShowForm(true);
      let celiArtikli = tableData.map(row => row.selectedArtikel);
      spremeniZalogo(celiArtikli, tableData.map(row => row.col2));
    } catch (error) {
      console.error('Napaka pri ustvarjanju novega naročila ali pridobivanju naročil:', error);
    }
  };

  const spremeniZalogo = async (artikli, kolicine) => {
    
      for (let i = 0; i < artikli.length; i++) {
        let data = { kolicina: kolicine[i] };
        console.log(data)
        let id_artikel = artikli[i].id_artikel;
        const result = await api.put(`/artikli/posodobiZalogo/${id_artikel}`, data);
        console.log(result)
      }
    

  };

  const deleteRow = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };

  const [editForm, setEditForm] = useState(editMode);

  const getNarocilo = async (orderId) => {
    try {
      const response = await api.get(`/narocila/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching narocilo:', error);
      throw error;
    }
  };


  const fetchEditData = async () => {
    if (editForm && editFormData) {
      try {
        const response = await getNarocilo(editFormData);
        const { stranka, artikli, datumVnosa, rokPriprave, seznamKolicin, cenaSkupaj } = response;

        setSelectedStranka(stranka);
        setBottomLeft1(datumVnosa);
        setBottomLeft2(rokPriprave);
        setBottomLeft3(cenaSkupaj);

        // Fetch details for each product in artikli
        const artikliDetails = await Promise.all(
          artikli.map(async (artikelId) => {
            const artiklResponse = await api.get(`/artikli/${artikelId}`);
            return artiklResponse.data;
          })
        );

        // Create an array of rows based on the fetched details
        const updatedTableData = artikliDetails.map((artiklDetail) => ({
          col1: '', // You may need to update this based on the structure of the fetched data
          col2: 1, // Assuming a default value for quantity
          col3: artiklDetail.dobavnaCena.toString(),
          col4: artiklDetail.prodajnaCena.toString(),
          col5: (artiklDetail.prodajnaCena * 1).toFixed(2),
          col6: artiklDetail.kolicina.toString(),
          selectedArtikel: artiklDetail,
        }));

        // Update the tableData state with the created rows
        setTableData(updatedTableData);
      } catch (error) {
        console.error('Error fetching edit data:', error);
      }
    }
  };

  useEffect(() => {
    fetchEditData();
  }, [editForm, editFormData]);

  const handleUpdateClick = async () => {
    const invalidRow = tableData.find(row => parseFloat(row.col2) > parseFloat(row.col6));

    if (invalidRow) {
      // Show an alert if there is an invalid row
      alert('Količina v nekaterih vrsticah je večja od "na zalogi". Popravite to pred shranjevanjem.');
      return; // Prevent saving
    }
    if (!selectedStranka || !selectedStranka.naziv) {
      alert('Naziv stranke ne sme biti prazen.');
      return; // Prevent saving
    }

    // Check if "Artikel" is empty in any row
    const emptyArtikel = tableData.find(row => !row.selectedArtikel);

    if (emptyArtikel) {
      alert('Izberite Artikel za vsako vrstico.');
      return; // Prevent saving
    }

    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const zaposleniID = user.id;

    try {
      // Fetch the current zaposleni
      const zaposleniResponse = await api.get(`/zaposleni/${zaposleniID}`);
      const zaposleni = zaposleniResponse.data;

      // Prepare data to save
      const dataToSave = {
        casPriprave: "0000-01-01T00:00:00",
        cenaSkupaj: bottomLeft3,
        datumVnosa: new Date().toISOString(),
        rokPriprave: bottomLeft2,
        seznamKolicin: tableData.map(row => row.col2),
        stanjeNarocila: "TODO",
        stranka: selectedStranka,
        artikli: tableData.map(row => row.selectedArtikel.id_artikel),
        zaposlen: zaposleni
      };

      // Save the new narocilo
      const result = await api.put(`/narocila/posodobi/${editFormData}`, dataToSave);

      // Fetch all narocila again
      await fetchNarocila();

      // Toggle visibility of NarocilaTable
      setShowTable(true);
      setShowNarocilo(false);
      setShowForm(true);
      //let celiArtikli = tableData.map(row => row.selectedArtikel);
      //spremeniZalogo(celiArtikli, tableData.map(row => row.col2));
    } catch (error) {
      console.error('Napaka pri ustvarjanju novega naročila ali pridobivanju naročil:', error);
    }
  }

  return (
    <MainCard>
      <div style={{ marginBottom: '20px' }}>
        {/* 4 Text Fields on Top */}
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Autocomplete
              value={selectedStranka}
              onChange={(event, newValue) => setSelectedStranka(newValue)}
              options={suggestions}
              getOptionLabel={(option) => option.naziv}
              renderInput={(params) => <TextField {...params} label="Naziv Stranke" fullWidth />}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Email" value={field2Value} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Telefon" value={field3Value} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Kraj" value={field4Value} fullWidth />
          </Grid>
        </Grid>

        {/* Main Table-Like Div */}
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
          {/* Table Header */}
          <Grid container spacing={2} style={{ marginBottom: '10px' }}>
            <Grid item xs={2}>
              <Typography>Artikel</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>Količina</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>Na zalogi</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>Dobavna Cena</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>Prodajna Cena</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>Skupaj</Typography>
            </Grid>
          </Grid>

          {/* Table Rows */}
          {tableData.map((row, index) => (
            <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
              <Grid item xs={2}>
                <Autocomplete
                  value={row.selectedArtikel}
                  onChange={(event, newValue) => handleArtikelChange(event, newValue, index)}
                  options={suggestionsArtikli}
                  getOptionLabel={(option) => option.naziv}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  value={row.col2}
                  onChange={(event) => handleKolicinaChange(event, index)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                <TextField value={row.col6} fullWidth />
              </Grid>
              <Grid item xs={2}>
                <TextField value={row.col3} fullWidth />
              </Grid>
              <Grid item xs={2}>
                <TextField value={row.col4} fullWidth />
              </Grid>
              <Grid item xs={2}>
                <TextField value={row.col5} fullWidth />
              </Grid>
              <Grid item xs={2}>
                {/* Add a delete button for each row */}
                {index > 0 && (
                  <IconButton onClick={() => deleteRow(index)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>

          ))}

          {/* Plus Sign to Add Another Row */}
          <IconButton onClick={addRow} color="primary">
            <AddIcon />
          </IconButton>
        </Paper>

        {/* Bottom Left Corner Fields */}
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={4}>
            <TextField label="Datum vnosa" value={bottomLeft1} fullWidth disabled />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Rok priprave"
              type="datetime-local"
              value={bottomLeft2}
              onChange={(e) => setBottomLeft2(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Cena skupaj:" value={bottomLeft3} fullWidth disabled />
          </Grid>
        </Grid>

        {/* Bottom Right Corner Buttons */}
        <Grid container spacing={2} style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {editMode ? (
              <Button variant="contained" color="primary" onClick={handleUpdateClick} style={{ marginLeft: '10px' }}>
                Posodobi
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleSave} style={{ marginLeft: '10px' }}>
                Shrani
              </Button>
            )}
          </Grid>
        </Grid>
      </div>
    </MainCard>
  );
};

export default DodajNarocilo;
