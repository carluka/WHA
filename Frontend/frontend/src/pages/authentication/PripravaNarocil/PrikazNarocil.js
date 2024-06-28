import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../services/api";

// ================================|| PrikazNarocil ||================================ //

export default function PrikazNarocil({
  narocila,
  fetchNarocila,
  handleShowPrikazNarocil,
}) {
  const [showHello, setShowHello] = useState({});
  const [orderProducts, setOrderProducts] = useState({});

  const handlePripraviClick = (narocilo_id) => {
    handleShowPrikazNarocil(narocilo_id); // Call the prop to switch components
  };

  const handlePlusClick = (narocilo_id) => {
    if (showHello[narocilo_id]) {
      // If the table is already visible, hide it
      setShowHello((prevShowHello) => ({
        ...prevShowHello,
        [narocilo_id]: false,
      }));
    } else {
      // Otherwise, fetch and show the table
      api
        .get(`/narocila/${narocilo_id}`)
        .then((result) => {
          const numbers = result.data.artikli;
          const fetchPromises = numbers.map((number) =>
            api.get(`/artikli/${number}`)
          );

          Promise.all(fetchPromises)
            .then((productsData) => {
              const fetchedProducts = productsData.map(
                (productData) => productData.data
              );

              setOrderProducts((prevOrderProducts) => ({
                ...prevOrderProducts,
                [narocilo_id]: fetchedProducts,
              }));

              setShowHello((prevShowHello) => ({
                ...prevShowHello,
                [narocilo_id]: true,
              }));
            })
            .catch((error) => {
              console.error("Error fetching products for the order!", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching order details!", error);
        });
    }
  };

  const handleStanjeUpdate = (narocilo_id) => {
   // Make an API call to update the stanjeNarocila to "DOING"
   api
     .put(`/narocila/posodobi/stanje/${narocilo_id}`, { stanjeNarocila: "DOING" })
     .then((response) => {
       // Update the state of stanjeNarocila in your component
       // Assuming that the response contains the updated order details
       const updatedOrder = response.data;
       // Update the state with the updated order
       // For example, you can update the 'narocila' state with the updated order
       // This will trigger a re-render and show the updated "DOING" state
     })
     .catch((error) => {
       console.error("Error updating stanjeNarocila!", error);
     });
 };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="right">Datum Vnosa</TableCell>
            <TableCell align="right">Stranka</TableCell>
            <TableCell align="right">Zaposleni</TableCell>
            <TableCell align="right">Rok Priprave</TableCell>
            <TableCell align="right">Stanje</TableCell>
            <TableCell align="right">Skupaj Cena</TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {narocila.map((narocilo) => (
            <React.Fragment key={narocilo.id_artikel}>
              <TableRow
                key={narocilo.id_artikel}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" style={{ color: "grey" }}>
                  {narocilo.id_narocilo}
                </TableCell>
                <TableCell align="right">
                  {new Date(narocilo.datumVnosa).toLocaleString()}
                </TableCell>
                <TableCell align="right">{narocilo.stranka.naziv}</TableCell>
                <TableCell align="right">
                  {narocilo.zaposlen.ime} {narocilo.zaposlen.priimek}
                </TableCell>
                <TableCell align="right">
                  {new Date(narocilo.rokPriprave).toLocaleString()}
                </TableCell>
                <TableCell align="right">{narocilo.stanjeNarocila}</TableCell>
                <TableCell align="right">
                  {narocilo.cenaSkupaj + " €"}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="add"
                    size="large"
                    onClick={() => handlePlusClick(narocilo.id_narocilo)}
                  >
                    <AddIcon />
                  </IconButton>
                  <Button
                     variant="contained"
                     onClick={() => {
                        handleShowPrikazNarocil(narocilo.id_narocilo);
                        handleStanjeUpdate(narocilo.id_narocilo);
                     }}
                  >
                  PRIPRAVI
                  </Button>
                </TableCell>
              </TableRow>
              {showHello[narocilo.id_narocilo] && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Table size="small" aria-label="product details">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Naziv</TableCell>
                          <TableCell>Dobavna Cena</TableCell>
                          <TableCell>Prodajna Cena</TableCell>
                          <TableCell>Količina</TableCell>
                          <TableCell>Skupaj</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderProducts[narocilo.id_narocilo] &&
                          orderProducts[narocilo.id_narocilo].map(
                            (product, index) => (
                              <TableRow key={product.id_artikel}>
                                <TableCell>{product.id_artikel}</TableCell>
                                <TableCell>{product.naziv}</TableCell>
                                <TableCell>
                                  {product.dobavnaCena + " €"}
                                </TableCell>
                                <TableCell>
                                  {product.prodajnaCena + " €"}
                                </TableCell>
                                <TableCell>
                                  {narocilo.seznamKolicin[index]}
                                </TableCell>
                                <TableCell>
                                  {(
                                    product.prodajnaCena *
                                    narocilo.seznamKolicin[index]
                                  ).toFixed(2) + " €"}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
