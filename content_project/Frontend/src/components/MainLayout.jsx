// frontend/src/components/MainLayout.jsx
import React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home as HomeIcon,
  ExitToApp as ExitToAppIcon,
  Folder as FolderIcon, // <-- ۱. آیکون پروژه‌ها را ایمپورت کنید
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom'; // <-- ۲. ایمپورت برای هدایت

const drawerWidth = 240;

function MainLayout({ children }) {
  const navigate = useNavigate(); // <-- ۳. هوک هدایت

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  return (
    // این کامپوننت حالا تم RTL را از main.jsx به ارث می‌برد
    <Box sx={{ display: "flex" }}>
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
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        variant="permanent"
        anchor="right"
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              {/* ۴. لینک داشبورد */}
              <ListItemButton onClick={() => navigate('/dashboard')}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="داشبورد" sx={{ textAlign: "right" }} />
              </ListItemButton>
            </ListItem>

            {/* ۵. لینک پروژه‌ها (که همان داشبورد است) */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/dashboard')}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="پروژه‌ها" sx={{ textAlign: "right" }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="خروج" sx={{ textAlign: "right" }} />
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
          textAlign: "right",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;