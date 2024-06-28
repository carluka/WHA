import React, { useState } from 'react';
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
import api from "../../../services/api";
import UrediStranka from './UrediStranka';
import MainCard from 'components/MainCard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";


export default function StrankaTable({ stranka, fetchStranka, showDeleteAlert }) {
  const [editingStranka, setEditingStranka] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
const [selectedStrankaId, setSelectedStrankaId] = useState(null);


  const izbrisiStranka = (stranka_id) => {
    api.delete(`/stranka/izbrisi/${stranka_id}`)
      .then((result) => {
        console.log(result.data);
        fetchStranka();
        showDeleteAlert();
      })
      .catch((error) => {
        console.error('There was an error deleting stranka!', error);
      });
  };

  const handleDeleteClick = (stranka_id) => {
   return () => {
       setSelectedStrankaId(stranka_id);
       setOpenDialog(true); // Open the dialog
   };
};

const handleCloseDialog = () => {
   setOpenDialog(false);
};

const handleConfirmDelete = () => {
   izbrisiStranka(selectedStrankaId);
   setOpenDialog(false); // Close the dialog
};


  const handleEditClick = (stranka) => {
    return () => setEditingStranka(stranka);
  };

  const handleCancelEdit = () => {
    setEditingStranka(null);
  };

  return (
    <div>
      {editingStranka && (
        <MainCard style={{ marginBottom: '20px' }}>
        <UrediStranka
          strankaToEdit={editingStranka}
          fetchStranka={fetchStranka}
          onCancel={handleCancelEdit}
        />
        </MainCard>
      )}
      <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Potrditev brisanja stranke"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Ali ste prepričani, da želite izbrisati stranko?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                  <Button variant="outlined" onClick={handleCloseDialog}>Prekliči</Button>
                  <Button variant="outlined" color="error"onClick={handleConfirmDelete} autoFocus>
                    Potrdi
                </Button>
            </DialogActions>
        </Dialog>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Naziv</TableCell>
                <TableCell align="right">Kraj</TableCell>
                <TableCell align="right">Ulica</TableCell>
                <TableCell align="right">Poštna številka</TableCell>
                <TableCell align="right">Država</TableCell>
                <TableCell align="right">Telefon</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right"> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stranka.map((stranka) => (
                <TableRow
                  key={stranka.id_stranka}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" style={{ color: 'grey' }}>
                    {stranka.id_stranka}
                  </TableCell>
                  <TableCell align="right">{stranka.naziv}</TableCell>
                  <TableCell align="right">{stranka.kraj}</TableCell>
                  <TableCell align="right">{stranka.ulica}</TableCell>
                  <TableCell align="right">{stranka.postnaSt}</TableCell>
                  <TableCell align="right">{stranka.drzava}</TableCell>
                  <TableCell align="right">{stranka.telefon}</TableCell>
                  <TableCell align="right">{stranka.email}</TableCell>

                  <TableCell align="right">
                    <IconButton aria-label="edit" size="large" onClick={handleEditClick(stranka)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" size="large" onClick={handleDeleteClick(stranka.id_stranka)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
}
