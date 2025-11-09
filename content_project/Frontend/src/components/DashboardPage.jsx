// frontend/src/components/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getProjects } from '../api';
import {
  Typography, Box, CircularProgress, List, ListItem,
  ListItemText, Paper, ListItemAvatar, Avatar
} from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';

function DashboardPage() {
  // ... (کدهای state و useEffect شما دست نخورده باقی می‌مانند) ...
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... (کد fetchProjects شما دست نخورده باقی می‌ماند) ...
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        setProjects(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("خطا در دریافت پروژه‌ها");
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Typography color="error" variant="h6">{error}</Typography>;
  }

  // ... (کدهای بالای DashboardPage.jsx شما دست نخورده باقی می‌ماند)

  // نمایش لیست پروه‌ها
  return (
    <Box> {/* این باکس والد حالا از MainLayout.jsx دستور 'textAlign: right' را می‌گیرد */}
      <Typography variant="h4" gutterBottom>
        داشبورد پروه‌ها
      </Typography>

      <Paper elevation={3}>
        <List>
          {projects.length === 0 ? (
            <ListItem>
              {/* --- راه‌حل اجباری --- */}
              <ListItemText
                primary="هیچ پروژه‌ای یافت نشد."
                sx={{ textAlign: 'right' }} // <-- این را اضافه کنید
              />
            </ListItem>
          ) : (
            projects.map((project) => (
              <ListItem key={project.project_id} divider>
                <ListItemAvatar>
                  <Avatar> <FolderIcon /> </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={project.project_name}
                  secondary={`پیج: ${project.page_username} | تاریخ: ${project.start_date} تا ${project.end_date}`}
                  // --- راه‌حل اجباری ---
                  sx={{ textAlign: 'right' }} // <-- این را اضافه کنید
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default DashboardPage;