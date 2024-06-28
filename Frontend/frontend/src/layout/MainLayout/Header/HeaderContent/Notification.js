import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import api from "../../../../services/api";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Popper,
  Typography,
  useMediaQuery
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import { BellOutlined, CloseOutlined, GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [lowInventoryItems, setLowInventoryItems] = useState([]);

  useEffect(() => {
    const fetchLowInventoryArtikli = () => {
      api.get("artikli/nizkaZaloga")
         .then((result) => {
           setLowInventoryItems(result.data);
         })
         .catch(error => {
           console.error("Error fetching low inventory data:", error);
         });
    };

    //fetchLowInventoryArtikli();

    const interval = setInterval(() => {
      fetchLowInventoryArtikli();
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []); // P

  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge  badgeContent={lowInventoryItems.length} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Obvestila"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <IconButton size="small" onClick={handleToggle}>
                      <CloseOutlined />
                    </IconButton>
                  }
                >
                  <List component="nav">
                  {lowInventoryItems.map(item => (
                     <ListItemButton key={item.id_artikel}>
                        <ListItemText 
                        primary={<>
                           <span style={{ fontWeight: 'bold' }}>PRIMANKUJE:</span> <span style={{color: "grey", fontWeight: "bold"}}>ID: {item.id_artikel}, Naziv: {item.naziv}</span>
                           
                        </>}
                        secondary={
                           <>
                              <PriorityHighIcon sx={{ color: '#DC3023', verticalAlign: 'middle', mr: 0.5 }} />
                              <span style={{ fontWeight: 'bold', fontSize: 13 }}>Artiklov na zalogi: {item.kolicina}</span>
                           </>
                        } 
                        />
                     </ListItemButton>
                  ))}
                  </List>

                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
