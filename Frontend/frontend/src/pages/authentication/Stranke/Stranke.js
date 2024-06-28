import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import StrankaTable from "./StrankaTable";
import { Button } from "@mui/material";
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import StrankaForm from "./StrankaForm";
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'components/MainCard';

const Stranke = () => {
  const [stranka, setStranka] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    naziv: '',
    kraj: '',
    ulica: '',
    postnaSt: '',
    drzava: '',
    telefon: '',
    email: '',
  });
  const [editingStrankaId, setEditingStrankaId] = useState(null);


  const fetchStranka = () => {
    api.get("/stranka").then((result) => {
      setStranka(result.data);
    });
  };

  useEffect(fetchStranka, []);

  const showDeleteAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleEditStranka = (strankaId) => {
    const strankaToEdit = stranka.find((stranka) => stranka.id_artikel === strankaId);
    if (strankaToEdit) {
      setFormData(strankaToEdit);
      setEditingStrankaId(strankaId);
      setShowForm(true);
    }
  };

  const handleCloseForm = () => {
    setFormData({
      naziv: '',
      kraj: '',
      ulica: '',
      postnaSt: '',
      drzava: '',
      telefon: '',
      email: '',
    });
    setEditingStrankaId(null);
    setShowForm(false);
  };

  const alertStyle = {
    position: 'fixed',
    top: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    margin: '0 auto',
    width: '80%',
    opacity: 0.95,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  return (
    <>
      {showForm && (
        <MainCard style={{ marginBottom: '20px' }}>
          <StrankaForm
            formData={formData}
            setFormData={setFormData}
            fetchStranka={fetchStranka}
            handleSubmit={(event) => {
              event.preventDefault();
              console.log(formData);
              handleCloseForm();
            }}
            onCancel={handleCloseForm}
            editingStrankaId={editingStrankaId}
          />
        </MainCard>
      )}
      <MainCard>
        {showAlert && <Alert style={alertStyle} severity="success">Stranka uspešno izbrisana</Alert>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Button variant="contained" onClick={toggleForm}>
            {showForm ? <><CloseIcon /> Zapri</> : <><AddIcon /> Ustvari</>}
          </Button>
        </div>
        <StrankaTable
          stranka={stranka}
          fetchStranka={fetchStranka}
          showDeleteAlert={showDeleteAlert}
          onEditStranka={handleEditStranka}
        />
      </MainCard>
    </>
  );
};

export default Stranke;
