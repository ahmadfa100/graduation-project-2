import MainChat from "./MainChat";
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

export default function Chat() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div> 
      <List>
        {['Settings', 'Profile', 'Help'].map((text) => (
         <> <ListItem button key={text}>
         <ListItemText primary={text} />
         
       </ListItem> 
       <Divider/>
       </>
         
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box sx={ { height: '100px',}}>
      <Drawer
  variant={isMobile ? 'temporary' : 'permanent'}
  open={isMobile ? mobileOpen : true}
  onClose={handleDrawerToggle}
  ModalProps={{ keepMounted: true }}
  PaperProps={{
    sx: {
        margin: '20px',
        borderRadius:'15px',
      height: '700px', // ✅ Fixed height
      width: 400,
      boxSizing: 'border-box',
      position: 'relative', // Optional: relative instead of fixed
    },
  }}
  sx={{
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      // You can keep this empty or remove to avoid double styling
    },
  }}
>
<Box
      sx={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        backgroundColor: 'rgb(76, 175, 80)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
      }}
    >
     My Chats
    </Box>
  {drawer}
</Drawer>

      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${400}px)` },
          height: '800px ',
        }}
      >
        <Toolbar />
        <MainChat />
      </Box>
    </Box>
  );
}

