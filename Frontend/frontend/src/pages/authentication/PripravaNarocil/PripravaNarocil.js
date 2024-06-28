import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import MainCard from '../../../components/MainCard';
import PrikazNarocil from './PrikazNarocil';
import PripravaPrikaz from './PripravaPrikaz';

// ================================|| PripravaNarocil ||================================ //

const PripravaNarocil = () => {
   const [narocila, setNarocila] = useState([]);
   const [showPrikazNarocil, setShowPrikazNarocil] = useState(true);
   const [selectedNarociloId, setSelectedNarociloId] = useState(null);

   const fetchNarocila = () => {
      api.get("/narocila/TODO").then((result) => {
         setNarocila(result.data);
      });
   };

   const handleShowPrikazNarocil = (id) => {
      setShowPrikazNarocil(false);
      setSelectedNarociloId(id);
    };

   useEffect(() => {
      fetchNarocila();
   }, []);

   return (
      <MainCard>
         <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            {/* If you have any buttons or elements to be placed here, add them */}
         </div>
         {showPrikazNarocil ? (
            <PrikazNarocil 
               narocila={narocila}
               fetchNarocila={fetchNarocila}
               handleShowPrikazNarocil={handleShowPrikazNarocil} // Add this prop
            />
         ) : (
            <PripravaPrikaz 
               narocilo_id={selectedNarociloId}
               setShowPrikazNarocil={setShowPrikazNarocil} // Add this prop
            />
         )}
      </MainCard>
   );
};

export default PripravaNarocil;
