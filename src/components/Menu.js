// src/components/Menu.js
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box, Drawer, CssBaseline, AppBar as MuiAppBar, Toolbar,
  List, Typography, Divider, IconButton, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Container
} from '@mui/material';
import { Menu as MenuIcon, ChevronLeft, ChevronRight, Add, Grading } from '@mui/icons-material';

import { Routes, Route, useNavigate } from 'react-router-dom';

import PatrimonioRegister from './PatrimonioRegister';
import { PatrimonioList } from './PatrimonioList';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Menu() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            PMDF/DPTS - COMISSÃO PCS
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding onClick={() => { navigate('/'); handleDrawerClose(); }}>
            <ListItemButton>
              <ListItemIcon><Add /></ListItemIcon>
              <ListItemText primary="Incluir Patrimônio" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => { navigate('/listar'); handleDrawerClose(); }}>
            <ListItemButton>
              <ListItemIcon><Grading /></ListItemIcon>
              <ListItemText primary="Listar Patrimônios" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Container>
          <Routes>
            <Route path="/" element={<PatrimonioRegister text="CADASTRO DE PATRIMÔNIO" />} />
            <Route path="/listar" element={<PatrimonioList text="PATRIMÔNIOS CADASTRADOS" />} />
          </Routes>
        </Container>
      </Main>
    </Box>
  );
}
