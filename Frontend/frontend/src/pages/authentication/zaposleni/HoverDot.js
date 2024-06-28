import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';


export default function HoverDot({user}) {
  const [isHovered, setIsHovered] = useState(false);
  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  const colors = {
   success: '#28a745', // example color for success
   warning: '#ffc107', // example color for warning
   };

  return (
    <TableCell align="center">
      <span
        style={{
          height: '10px',
          width: '10px',
          backgroundColor: colors[user.enabled ? 'success' : 'warning'],
          borderRadius: '50%',
          display: 'inline-block',
        }}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      />
     
    </TableCell>
  );
}
