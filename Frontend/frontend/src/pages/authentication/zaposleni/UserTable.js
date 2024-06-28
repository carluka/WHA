import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import api from "../../../services/api";
import EditIcon from '@mui/icons-material/Edit';
import HoverDot from './HoverDot';
import UrediZaposleni from './UrediZaposleni';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";

export default function UserTable({ users, fetchUser, showDeleteAlert }) {
  const [editingZaposleni, setEditingZaposleni] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userStatus, setUserStatus] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);


  const fetchUserStatus = async () => {
   let shouldFetchUsers = false;
   const updatedStatuses = { ...userStatus };
 
   for (const user of users) {
     try {
       const result = await api.get(`/zaposleni/preveriAuth/${user.id_zaposleni}`);
       const isEnabled = result.data;
       if (updatedStatuses[user.id_zaposleni] !== isEnabled) {
         shouldFetchUsers = true;
         updatedStatuses[user.id_zaposleni] = isEnabled;
       }
     } catch (error) {
       console.error('There was an error checking the user status!', error);
     }
   }
 
   setUserStatus(updatedStatuses);
 
   if (shouldFetchUsers) {
     fetchUser();
   }
 };
 
   

   useEffect(() => {
      const intervalId = setInterval(() => {
         fetchUserStatus();
      }, 5000);
   
      return () => clearInterval(intervalId);
   }, []); // Prazna odvisnost, da se izvede samo ob montiranju in razmontiranju
   


  const izbrisiUser = (user_id) => {
    api.delete(`/zaposleni/izbrisi/${user_id}`)
      .then((result) => {
        console.log(result.data);
        fetchUser();
      })
      .catch((error) => {
        console.error('There was an error deleting the user!', error);
      });
  };

  const handleDeleteClick = (user_id) => {
   return () => {
       setSelectedUserId(user_id);
       setOpenDialog(true); // Open the dialog
   };
};

const handleCloseDialog = () => {
   setOpenDialog(false);
};

const handleConfirmDelete = () => {
   izbrisiUser(selectedUserId);
   setOpenDialog(false); // Close the dialog
};

  const handleEditClick = (user) => {
    setEditingZaposleni(user);
  };

  const handleCancelEdit = () => {
    setEditingZaposleni(null);
  };

  return (
    <div>
      {editingZaposleni && (
        <UrediZaposleni
          userToEdit={editingZaposleni} // Pass the user data to UrediZaposleni
          fetchUser={fetchUser}
          onCancel={handleCancelEdit}
        />
      )}
      <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Potrditev brisanja zaposlenega"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Ali ste prepričani, da želite izbrisati zaposlenega?
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
              <TableCell align="left"></TableCell>
              <TableCell>ID</TableCell>
              <TableCell align="right">Ime</TableCell>
              <TableCell align="right">Priimek</TableCell>
              <TableCell align="center">Uporabniško ime</TableCell>
              <TableCell align="left">Geslo</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Telefon</TableCell>
              <TableCell align="center">Bruto Plača</TableCell>
              <TableCell align="left">Delovno Mesto</TableCell>
              <TableCell align="right"> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id_zaposleni}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">
                  <HoverDot user={user} isEnabled={userStatus[user.id_zaposleni]} /> 
                </TableCell>
                <TableCell component="th" scope="row" style={{ color: 'grey' }}>
                  {user.id_zaposleni}
                </TableCell>
                <TableCell align="right">{user.ime}</TableCell>
                <TableCell align="right">{user.priimek}</TableCell>
                <TableCell align="center">{user.username}</TableCell>
                <TableCell align="left">{user.password}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{user.telefon}</TableCell>
                <TableCell align="center">{user.placa} €</TableCell>
                <TableCell align="left">{user.tip_zaposlenega}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit" size="large" onClick={() => handleEditClick(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" size="large" onClick={handleDeleteClick(user.id_zaposleni)}>
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
