import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/Camera";
import MainCard from "components/MainCard";
import api from "../../../services/api";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UrediArtikel from './UrediArtikelScanner';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

const Scanner = () => {
  const [scannerData, setScannerData] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let intervalId;
  const [artikel, setItemData] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
const [selectedArtikelId, setSelectedArtikelId] = useState(null);


  const showDeleteAlert = () => {
   setShowAlert(true);
   setTimeout(() => setShowAlert(false), 3000);
 };

  const izbrisiArtikel = (artikel_id) => {
    api.delete(`/artikli/izbrisi/${artikel_id}`)
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.error('There was an error deleting the artikel!', error);
      });
  };

  const fetchItemData = async (itemId) => {
    try {
      const response = await api.get(`/artikli/${itemId}`);
      setItemData(response.data);
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  const onArtikelUpdated = (artikelId) => {
   fetchItemData(artikelId); // Re-fetch the updated item data
};

  useEffect(() => {
    if (!isCameraActive) {
      stopCamera();
      return;
    }

    startCamera();

    return () => stopCamera();
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }

    intervalId = setInterval(() => {
      captureImage();
    }, 1000);
  };

  const stopCamera = () => {
    if (intervalId) clearInterval(intervalId);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (
      videoRef.current &&
      canvasRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
    ) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      if (width && height) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        const context = canvasRef.current.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, width, height);

        const imageData = context.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, width, height);

        if (code) {
          setScannerData(code.data);
          const match = code.data.match(/ID_artikel=(\d+)/);
          if (match && match[1]) {
            fetchItemData(match[1]);
          }
          setIsCameraActive(false); // Automatically close and stop the camera
        }
      }
    }
  };

  const handleCameraClick = () => {
    if (isCameraActive) {
      setIsCameraActive(false);
    } else {
      setScannerData(null); // Reset scanner data for a new scan
      setIsCameraActive(true);
    }
  };

  const handleDeleteClick = (artikel_id) => {
   return () => {
       setSelectedArtikelId(artikel_id);
       setOpenDialog(true); // Open the dialog
   };
};

const handleCloseDialog = () => {
   setOpenDialog(false);
};

const handleConfirmDelete = () => {
   izbrisiArtikel(selectedArtikelId);
   setItemData(null); // Clear the artikel data
   setOpenDialog(false); // Close the dialog
};


 const handleEditClick = (artikel) => {
   return () => setEditingArticle(artikel);
 };

 const handleCancelEdit = () => {
   setEditingArticle(null);
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
    <MainCard>
      {showAlert && <Alert style={alertStyle} severity="success">Artikel uspešno izbrisan</Alert>}
      {editingArticle && (
        <MainCard style={{ marginBottom: '20px' }}>
        <UrediArtikel
          articleToEdit={editingArticle}
          onCancel={handleCancelEdit}
          onArtikelUpdated={onArtikelUpdated}
        />
        </MainCard>
      )}
      <Button
        variant="contained"
        startIcon={<CameraIcon />}
        onClick={handleCameraClick}
      >
        {isCameraActive ? "CLOSE" : "SKENIRAJ"}
      </Button>
      {isCameraActive && (
        <div>
          <video
            ref={videoRef}
            width="640"
            height="480"
            autoPlay
            playsInline
          ></video>
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            style={{ display: "none" }}
          ></canvas>
        </div>
      )}
      <div>
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Naziv</TableCell>
                <TableCell align="right">Količina</TableCell>
                <TableCell align="right">Prodajna Cena</TableCell>
                <TableCell align="right">Dobavna Cena</TableCell>
                <TableCell align="right">Lokacija</TableCell>
                <TableCell align="right">Tip</TableCell>
                <TableCell align="right"> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {artikel && (
                <TableRow
                    key={artikel.id_artikel}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row" style={{ color: 'grey' }}>
                        {artikel.id_artikel}
                    </TableCell>
                    <TableCell align="right">{artikel.naziv}</TableCell>
                    <TableCell align="right">{artikel.kolicina}</TableCell>
                    <TableCell align="right">{artikel.prodajnaCena} €</TableCell>
                    <TableCell align="right">{artikel.dobavnaCena} €</TableCell>
                    <TableCell align="right">{artikel.lokacijaArtikla}</TableCell>
                    <TableCell align="right">{artikel.tip_artikla}</TableCell>
                    <TableCell align="right">
                    <IconButton aria-label="edit" size="large" onClick={handleEditClick(artikel)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" size="large" onClick={handleDeleteClick(artikel.id_artikel)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
            )}
        </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Potrditev brisanja artikla"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Ali ste prepričani, da želite izbrisati artikel?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Ne</Button>
                <Button onClick={handleConfirmDelete} autoFocus>
                    Da
                </Button>
            </DialogActions>
        </Dialog>
    </MainCard>
  );
};

export default Scanner;

//{scannerData && <p>QR Code Data: {scannerData}</p>}
