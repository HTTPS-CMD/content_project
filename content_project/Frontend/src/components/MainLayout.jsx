// frontend/src/components/MainLayout.jsx
import React from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import { Home as HomeIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';

// --- ایمپورت‌های مورد نیاز برای RTL (حیاتی) ---
import { ThemeProvider, createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const drawerWidth = 240;

// --- ساخت تم و کش RTL (حیاتی) ---
// اینها باعث می‌شوند همه‌چیز در این کامپوننت راست‌چین شود
const rtlTheme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'Tahoma, Arial, sans-serif',
  },
});

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});
// --- پایان بخش RTL ---

function MainLayout({ children }) {

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    // --- اعمال‌کننده‌های RTL ---
    // این دو خط، تم RTL را به کل چیدمان اعمال می‌کنند
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={rtlTheme}>
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
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="right" // <-- منو در سمت راست
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {/* ... (آیتم‌های منو) ... */}
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="داشبورد" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="خروج" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>

          {/* محتوای اصلی صفحه (که حالا باید RTL باشد) */}
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, mt: 8 }}
          >
            {children}
          </Box>

        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MainLayout;