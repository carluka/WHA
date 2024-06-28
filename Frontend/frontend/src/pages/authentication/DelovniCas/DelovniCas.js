import React, { useEffect, useState } from "react";
import { Button, Typography } from '@mui/material';
import api from "../../../services/api";
import MainCard from 'components/MainCard';
import DelovniCasTable from './DelovniCasTable';

const DelovniCas = () => {
  const [delovniCasi, setDelovniCas] = useState([]);
  const [showZacniButton, setShowZacniButton] = useState(true);

  const fetchDelovniCas = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const zaposleniID = user.id;
    console.log('userid: ' + zaposleniID)
    api.get(`/delovni_casi/zaposleni/${zaposleniID}`).then((result) => {
      setDelovniCas(result.data);
      const lastItemIndex = result.data.length - 1;
      console.log(lastItemIndex);
      if (lastItemIndex >= 0) {
        const lastItem = result.data[lastItemIndex];
        console.log(lastItem)
        console.log(lastItem.ura_zakljucka)
        setShowZacniButton(lastItem.ura_zakljucka);
      }
    });
  };
  

  useEffect(() => {
    fetchDelovniCas();
  }, []);

  const handleZacniClick = async () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const zaposleniID = user.id;

    const zaposleniResponse = await api.get(`/zaposleni/${zaposleniID}`);
    const zaposleni = zaposleniResponse.data;

    const localDate = new Date();
    const timezoneOffset = localDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(localDate - timezoneOffset);

    const dataToSave = {
      ura_zacetka: adjustedDate.toISOString(),
      ura_zakljucka: null,
      zaposlen: zaposleni
    };

    console.log(dataToSave);

    const result = await api.post(`/delovni_casi`, dataToSave);
    console.log(result);

    fetchDelovniCas();
    setShowZacniButton(false);
  };
  const handleKoncajClick = async () => {
    const lastItemIndex = delovniCasi.length - 1;
    const id = delovniCasi[lastItemIndex].id_delovni_cas;

    const localDate = new Date();
    const timezoneOffset = localDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(localDate - timezoneOffset);
    const dataToSend={
      ura_zakljucka: adjustedDate
    }

    const result = await api.put(`/delovni_casi/posodobi/${id}`, dataToSend);
    console.log(result);
    fetchDelovniCas();
    setShowZacniButton(true);
  };
  return (
    <MainCard>
      {showZacniButton && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleZacniClick}
          style={{ marginBottom: "10px" }} // Add margin to the bottom
        >
          Začni
        </Button>
      )}
      {!showZacniButton && (
        <Button
          variant="contained"
          style={{ backgroundColor: "red", marginBottom: "10px" }} // Change color to red and add margin
          onClick={handleKoncajClick}
        >
          Končaj
        </Button>
      )}
      <DelovniCasTable
        delovniCasi={[...delovniCasi].reverse()}
        fetchDelovniCas={fetchDelovniCas}
      />
    </MainCard>
  );
};

export default DelovniCas;
