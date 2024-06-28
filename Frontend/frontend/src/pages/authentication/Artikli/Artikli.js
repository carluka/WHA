import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import ArtikliTable from "./ArtikliTable";
import { Button, TextField } from "@mui/material";
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import ProductForm from "./ProductForm";
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'components/MainCard';
import { Select, MenuItem } from "@mui/material";

const Artikli = () => {
  const [artikli, setArtikel] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    naziv: '',
    kolicina: '',
    prodajnaCena: '',
    dobavnaCena: '',
    lokacijaArtikla: '',
    tipArtikla: ''
  });
  const [editingArticleId, setEditingArticleId] = useState(null);

  const tipArtiklaOptions = [
    { label: 'VRT', value: 'VRT' },
    { label: 'POHIŠTVO', value: 'POHISTVO' },
    { label: 'GRADNJA', value: 'GRADNJA' },
    { label: 'TEHNIKA', value: 'TEHNIKA' },
  ];

  const fetchArtikli = () => {
    api.get("/artikli").then((result) => {
      setArtikel(result.data);
    });
  };

  useEffect(fetchArtikli, []);

  const showDeleteAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleEditArticle = (articleId) => {
    const articleToEdit = artikli.find((artikel) => artikel.id_artikel === articleId);
    if (articleToEdit) {
      setFormData(articleToEdit);
      setEditingArticleId(articleId);
      setShowForm(true);
    }
  };

  const handleCloseForm = () => {
    setFormData({
      naziv: '',
      kolicina: '',
      prodajnaCena: '',
      dobavnaCena: '',
      lokacijaArtikla: '',
      tipArtikla: '',
    });
    setEditingArticleId(null);
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

  
  const [searchInput, setSearchInput] = useState('');
  const [combinedSearch, setCombinedSearch] = useState({
    searchInput: '',
    tipArtikla: '*'
  });

  const handleChangeSearchInput = (event) => {
    setCombinedSearch({
      ...combinedSearch,
      searchInput: event.target.value
    });
    setSearchInput(event.target.value);
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setCombinedSearch({
      ...combinedSearch,
      tipArtikla: selectedValue
    });
    setFormData({ ...formData, tipArtikla: selectedValue });
  };

  useEffect(() => {
    const baseUrl = '/artikli/search?'
    if (combinedSearch.searchInput.length > 2 && combinedSearch.tipArtikla !== '*') {
      const newUrl = baseUrl+`naziv=${combinedSearch.searchInput}&tipArtikla=${combinedSearch.tipArtikla}`
      api.get(newUrl).then((result) => {
        setArtikel(result.data)
      });
    } else if(combinedSearch.searchInput.length > 2){
      const newUrl = baseUrl+`naziv=${combinedSearch.searchInput}`
      api.get(newUrl).then((result) => {
        setArtikel(result.data)
      });
    } else if(combinedSearch.tipArtikla !== '*'){
      const newUrl = baseUrl+`tipArtikla=${combinedSearch.tipArtikla}`
      api.get(newUrl).then((result) => {
        setArtikel(result.data)
      });
    }
    
    
    else {
      console.log('nic nimas')
      fetchArtikli();
    }
  }, [combinedSearch]);


  const customTipArtiklaOptions = [
    { label: '*', value: '*' },
    { label: 'VRT', value: 'VRT' },
    { label: 'POHIŠTVO', value: 'POHISTVO' },
    { label: 'GRADNJA', value: 'GRADNJA' },
    { label: 'TEHNIKA', value: 'TEHNIKA' },
  ];


  return (
    <>
      {showForm && (
        <MainCard style={{ marginBottom: '20px' }}>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            tipArtiklaOptions={tipArtiklaOptions}
            fetchArtikli={fetchArtikli}
            handleSubmit={(event) => {
              event.preventDefault();
              console.log(formData);
              handleCloseForm();
            }}
            onCancel={handleCloseForm}
            editingArticleId={editingArticleId}
          />
        </MainCard>
      )}
      <MainCard>
        {showAlert && <Alert style={alertStyle} severity="success">Artikel uspešno izbrisan</Alert>}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField label="Search" variant="outlined" value={searchInput} onChange={handleChangeSearchInput} />
            <Select
              label="Tip Artikla"
              variant="outlined"
              value={formData.tipArtikla}
              onChange={handleSelectChange}
              style={{ minWidth: '150px', marginLeft: '10px' }}
            >
              {customTipArtiklaOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Button variant="contained" onClick={toggleForm}>
            {showForm ? <><CloseIcon /> Zapri</> : <><AddIcon /> Ustvari</>}
          </Button>
        </div>
        <ArtikliTable
          artikli={artikli}
          fetchArtikli={fetchArtikli}
          showDeleteAlert={showDeleteAlert}
          onEditArticle={handleEditArticle}
        />
      </MainCard>
    </>
  );
};

export default Artikli;