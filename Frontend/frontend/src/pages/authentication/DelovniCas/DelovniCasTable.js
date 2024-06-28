import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment'; 

const daysTranslation = {
  Monday: 'Ponedeljek',
  Tuesday: 'Torek',
  Wednesday: 'Sreda',
  Thursday: 'Četrtek',
  Friday: 'Petek',
  Saturday: 'Sobota',
  Sunday: 'Nedelja',
};


export default function DelovniCasTable({ delovniCasi }) {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dan</TableCell>
              <TableCell align="right">Ura začetka</TableCell>
              <TableCell align="right">Ura konca</TableCell>
              <TableCell align="right">Skupaj</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {delovniCasi.map((delovniCas) => (
              <TableRow
                key={delovniCas.id_delovni_cas}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                {daysTranslation[moment(delovniCas.ura_zacetka).format('dddd')]}
                  {', '}
                  {moment(delovniCas.ura_zacetka).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell align="right">
                  {moment(delovniCas.ura_zacetka).format('HH:mm')}
                </TableCell>
                <TableCell align="right">
                  {delovniCas.ura_zakljucka
                    ? moment(delovniCas.ura_zakljucka).format('HH:mm')
                    : 'V poteku'}
                </TableCell>
                <TableCell align="right">
                  {delovniCas.ura_zakljucka
                    ? calculateTotalHours(
                        moment(delovniCas.ura_zacetka).format('HH:mm'),
                        moment(delovniCas.ura_zakljucka).format('HH:mm')
                      )
                    : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function calculateTotalHours(startTime, endTime) {
  
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);

  const timeDifferenceMs = end - start;
  const timeDifferenceMinutes = timeDifferenceMs / (1000 * 60);

  const hours = Math.floor(timeDifferenceMinutes / 60);
  const minutes = Math.floor(timeDifferenceMinutes % 60);

  return `${hours} ur, ${minutes} min`;
}
