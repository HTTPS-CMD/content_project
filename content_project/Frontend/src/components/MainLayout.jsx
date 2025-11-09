// frontend/src/components/MainLayout.jsx
import React from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import { Home as HomeIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';

// دیگر هیچ کدی برای RTL (CacheProvider, createTheme, rtlPlugin) در اینجا نیست

const drawerWidth = 240;

function MainLayout({ children }) {

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    // این کامپوننت حالا تم RTL را از main.jsx به ارث می‌برد
    <Box sx={{ display: 'flex' }}>

      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, mr: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            پنل مدیریت محتوا
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        variant="permanent"
        anchor="right"
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon> <HomeIcon /> </ListItemIcon>
                <ListItemText primary="داشبورد" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon> <ExitToAppIcon /> </ListItemIcon>
                <ListItemText primary="خروج" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          // <-- راه‌حل اجباری: ما همچنین به صورت دستی تراز می‌کنیم
          textAlign: 'right'
        }}
      >
        {children}
      </Box>

    </Box>
  );
}

export default MainLayout;