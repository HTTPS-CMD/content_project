// frontend/src/components/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getProjects } from '../api'; // API ارتقا یافته را ایمپورت می‌کنیم
import {
  Typography, Box, CircularProgress, List, ListItem,
  ListItemText, Paper, ListItemAvatar, Avatar
} from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';

function DashboardPage() {
  const [projects, setProjects] = useState([]); // لیست پروه‌ها
  const [loading, setLoading] = useState(true); // وضعیت لودینگ
  const [error, setError] = useState(null); // وضعیت خطا

  // useEffect در اولین رندر کامپوننت اجرا می‌شود
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects(); // فراخوانی API
        setProjects(response.data); // ذخیره داده‌ها در state
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("خطا در دریافت پروژه‌ها");
        // اگر توکن منقضی شده باشد (خطای 401)
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
  }, []); // [] یعنی فقط یک بار اجرا شود

  // نمایش وضعیت لودینگ
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  // نمایش خطا
  if (error) {
    return <Typography color="error" variant="h6">{error}</Typography>;
  }

  // نمایش لیست پروه‌ها
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        داشبورد پروژه‌ها
      </Typography>

      <Paper elevation={3}> {/* یک کادر "شیک" */}
        <List>
          {projects.length === 0 ? (
            <ListItem>
              <ListItemText primary="هیچ پروژه‌ای یافت نشد." />
            </ListItem>
          ) : (
            projects.map((project) => (
              <ListItem key={project.project_id} divider>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={project.project_name} // نام پروژه
                  secondary={`پیج: ${project.page_username} | تاریخ: ${project.start_date} تا ${project.end_date}`}
                />
                {/* TODO: اضافه کردن دکمه "مشاهده جزییات" */}
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default DashboardPage;