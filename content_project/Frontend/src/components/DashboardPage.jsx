// frontend/src/components/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { getProjects } from "../api";
import {
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import { Folder as FolderIcon, ChevronLeft as ChevronLeftIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        setProjects(response.data);
        setError(null);
      } catch (err) { // <-- این خطا هم در فایل قبلی شما بود، اصلاح شد
        console.error("Error fetching projects:", err);
        setError("خطا در دریافت پروژه‌ها");
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []); // [] یعنی فقط یک بار اجرا شود

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`); // هدایت به صفحه جزییات
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );
  }

  // نمایش لیست پروه‌ها
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // انیمیشن ورود کل صفحه
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'right' }}>
        داشبورد پروه‌ها
      </Typography>

      <Paper elevation={3}>
        <List>
          {projects.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="هیچ پروژه‌ای یافت نشد."
                sx={{ textAlign: "right" }}
              />
            </ListItem>
          ) : (
            // --- بخش انیمیشن "سکسی" اصلاح شد ---
            projects.map((project, index) => (
              <ListItem
                key={project.project_id}
                component={motion.div}
                divider
                onClick={() => handleProjectClick(project.project_id)}

                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}

                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  boxShadow: "0 4px 20px -5px rgba(0,0,0,0.3)",
                }}

                sx={{
                  mb: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={project.project_name}
                  secondary={`پیج: ${project.page_username}`}
                  sx={{ textAlign: "right" }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <ChevronLeftIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </motion.div>
  );
}

export default DashboardPage;