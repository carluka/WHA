import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import api from "../../../services/api";
import { useState, useEffect } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useDropzone } from "react-dropzone";
import { Stack, Typography } from '@mui/material';// Replace 'your-component-library' with the actual library name
import PropTypes from 'prop-types';
import Dot from 'components/@extended/Dot';



export default function NarocilaTable({
  narocila,
  fetchNarocila,
  showDeleteAlert,
  handleEditClick,
}) {
  const [showHello, setShowHello] = useState({});
  const [orderProducts, setOrderProducts] = useState({});

  const izbrisiNarocilo = (narocilo_id) => {
    api
      .delete(`/narocila/izbrisi/${narocilo_id}`)
      .then((result) => {
        // Refresh the article list after deletion
        fetchNarocila();

      })
      .catch((error) => {
        console.error("There was an error deleting the artikel!", error);
      });
  };

  // Function to handle the delete button click
  const handleDeleteClick = (narocilo_id) => {
    // Call the delete function only when the button is clicked
    return () => izbrisiNarocilo(narocilo_id);
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

  const handleDownloadPDF = (narocilo) => {
    const numbers = narocilo.artikli;
    const fetchPromises = numbers.map((number) =>
      api.get(`/artikli/${number}`)
    );

    Promise.all(fetchPromises)
      .then(async (productsData) => {
        const fetchedProducts = productsData.map(
          (productData) => productData.data
        );
        const imenaArtiklov = fetchedProducts.map((product) => product.naziv);
        const prodajnaCene = fetchedProducts.map(
          (product) => product.prodajnaCena
        );

        const dataToSend = {
          stranka: narocilo.stranka,
          narociloID: narocilo.id_narocilo,
          datum: narocilo.datumVnosa,
          zaposleni: narocilo.zaposlen.ime + " " + narocilo.zaposlen.priimek,
          imenaArtiklov: imenaArtiklov,
          seznamProdajnihCen: prodajnaCene,
          seznamKolicin: narocilo.seznamKolicin,
        };
        console.log(dataToSend);

        const response = await api.post("/generate-pdf", dataToSend, {
          responseType: "arraybuffer",
        });
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a download link and trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "generated-pdf.pdf";
        link.click();
      })
      .catch((error) => {
        console.error("Error fetching products for the order!", error);
      });
  };

  // State for email modal visibility and form data
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    to: "",
    subject: "",
    body: "",
    attachment: "",
  });

  // Function to handle opening the email modal
  const handleOpenEmailModal = () => {
    setEmailModalOpen(true);
  };

  // Function to handle email form change
  const handleEmailFormChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to handle email form submission
  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("to", emailFormData.to);
    formData.append("subject", emailFormData.subject);
    formData.append("body", emailFormData.body);

    if (emailFormData.attachment) {
      formData.append("attachment", emailFormData.attachment);
    }

    try {
      await api.post("/email/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Handle success
    } catch (error) {
      // Handle error
    }
    setEmailModalOpen(false);
    setEmailFormData({
      to: "",
      subject: "",
      body: "",
      attachment: "",
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle the dropped files here
      const file = acceptedFiles[0]; // Assuming you only allow one file
      if (file) {
        // Update the attachmentPath field with the file path or name
        handleEmailFormChange({
          target: {
            name: "attachment",
            value: file,
          },
        });
      }
    },
  });



  const OrderStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
      case "DOING":
        color = 'warning';
        title = 'DOING';
        break;
      case "DONE":
        color = 'success';
        title = 'DONE';
        break;
      case "TODO":
        color = 'error';
        title = 'TODO';
        break;
      default:
        color = 'primary';
        title = 'None';
    }

    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Dot color={color} />
        <Typography>{title}</Typography>
      </Stack>
    );
  };

  OrderStatus.propTypes = {
    status: PropTypes.number
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
                <TableCell align="right">
                  <OrderStatus status={narocilo.stanjeNarocila} />
                </TableCell>

                <TableCell align="right">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(narocilo.cenaSkupaj)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="email"
                    size="large"
                    onClick={handleOpenEmailModal}
                  >
                    <SendIcon />
                  </IconButton>

                  {/* Email Modal */}
                  {emailModalOpen && (
                    <Dialog
                    open={emailModalOpen}
                    onClose={() => {
                      setEmailModalOpen(false);
                      setEmailFormData({
                        to: "",
                        subject: "",
                        body: "",
                        attachment: "",
                      });
                    }}
                    
                    aria-labelledby="email-dialog-title"
                    aria-describedby="email-dialog-description"
                    BackdropProps={{
                      style: {
                        backgroundColor: 'rgba(128, 128, 128, 0.17)', // Adjust the alpha value for transparency
                      },
                    }}
                    
                  >
                      <DialogTitle id="email-dialog-title" >
                        {"Send Email"}
                      </DialogTitle>
                      <DialogContent >
                        <form onSubmit={handleEmailFormSubmit}>
                          <TextField
                            label="To"
                            name="to"
                            value={emailFormData.to}
                            onChange={handleEmailFormChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Subject"
                            name="subject"
                            value={emailFormData.subject}
                            onChange={handleEmailFormChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Body"
                            name="body"
                            value={emailFormData.body}
                            onChange={handleEmailFormChange}
                            multiline
                            rows={4}
                            fullWidth
                            margin="normal"
                          />
                          <div
                            {...getRootProps()}
                            style={{
                              border: "2px dashed #cccccc",
                              borderRadius: "4px",
                              padding: "20px",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                              <p>Drop the files here ...</p>
                            ) : (
                              <p>
                                {emailFormData.attachment
                                  ? emailFormData.attachment.name
                                  : "Drag 'n' drop some files here or click to select files"}
                              </p>
                            )}
                          </div>
                        </form>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          variant="outlined"
                          onClick={() => setEmailModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleEmailFormSubmit}
                          autoFocus
                        >
                          Send Email
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}

                  <IconButton
                    aria-label="download"
                    size="large"
                    onClick={() => handleDownloadPDF(narocilo)}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    size="large"
                    onClick={() => handleEditClick(narocilo.id_narocilo)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={handleDeleteClick(narocilo.id_narocilo)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    aria-label="add"
                    size="large"
                    onClick={() => handlePlusClick(narocilo.id_narocilo)}
                  >
                    <AddIcon />
                  </IconButton>
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