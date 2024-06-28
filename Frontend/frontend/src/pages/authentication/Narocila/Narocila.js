
import api from "../../../services/api";
import React, { useEffect, useState } from "react";
import NarocilaTable from "./NarocilaTable";
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from '../../../components/MainCard';
import { Button } from "@mui/material";
import DodajNarocilo from './dodajNarocilo';
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// ================================|| NAROCILA ||================================ //

const Narocila = () => {
   const [narocila, setNarocila] = useState([]);
   const [showAlert, setShowAlert] = useState(false);
   const [showTable, setShowTable] = useState(true);
   const [showDodajNarocilo, setShowNarocilo] = useState(false);
   const [showForm, setShowForm] = useState(true);
   
   

   
   const fetchNarocila = () => {
    api.get("/narocila").then((result) => {
       // Assuming 'datumVnosa' is the property by which you want to sort
       const sortedNarocila = result.data.sort((a, b) => {
          // Change 'datumVnosa' to the property you want to use for sorting
          return new Date(b.datumVnosa) - new Date(a.datumVnosa);
       });
 
       setNarocila(sortedNarocila);
    });
 };
  

  useEffect(() => {
    fetchNarocila();
  }, []);

  const handleUstvariClick = () => {
   setShowTable(!showTable);
   setShowNarocilo(!showDodajNarocilo);
   setShowForm(!showForm);
   setEditMode(false);
};

  const showDeleteAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
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

const [editMode, setEditMode] = useState(false);
const [editFormData, setEditFormData] = useState(null);

const handleEditClick = (narocilo) => {
   setEditFormData(narocilo);
   setEditMode(true);
   setShowForm(!showForm);
   setShowTable(!showTable);
   setShowNarocilo(!showDodajNarocilo);
   setShowForm(!showForm);
 };


 const [sortOption, setSortOption] = useState(''); // New state for sorting

 // Function to handle sort option change
 const handleSortChange = (event) => {
   setSortOption(event.target.value);
 };

 // Function to sort the articles
 const sortedNarocila = () => {
   switch(sortOption) {
     case 'TODO':
       return narocila.filter(a => a.stanjeNarocila === 'TODO');
     case 'DOING':
       return narocila.filter(a => a.stanjeNarocila === 'DOING');
     case 'DONE':
       return narocila.filter(a => a.stanjeNarocila === 'DONE');
     default:
       return narocila;
   }
 };


return (
   <MainCard>
      
      {showForm && <FormControl style={{ minWidth: 120 }}>
            <InputLabel id="sort-label">Sortiraj</InputLabel>
            <Select
              labelId="sort-label"
              value={sortOption}
              label="Sortiraj"
              onChange={handleSortChange}
            >
              <MenuItem value=""><em>*</em></MenuItem>
              <MenuItem value="TODO">TODO</MenuItem>
              <MenuItem value="DOING">DOING</MenuItem>
              <MenuItem value="DONE">DONE</MenuItem>
            </Select>
          </FormControl>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" onClick={handleUstvariClick}>
          {showDodajNarocilo ? <><CloseIcon /> Zapri</> : <><AddIcon /> Ustvari</>}
        </Button>
      </div>

      {showAlert && <Alert style={alertStyle} severity="success">Narocilo uspešno izbrisano</Alert>}
      {showTable && <NarocilaTable narocila={sortedNarocila()} fetchNarocila={fetchNarocila} showDeleteAlert={showDeleteAlert} handleEditClick={handleEditClick} />}
      {showDodajNarocilo && <DodajNarocilo
          editMode={editMode}
          editFormData={editFormData}
          fetchNarocila={fetchNarocila}  
          setShowTable={setShowTable}    
          setShowNarocilo={setShowNarocilo}
          setShowForm={setShowForm}
        />}
    </MainCard>
 );
 
};

export default Narocila;