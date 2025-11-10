// src/components/ProjectDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // برای خواندن :projectId از URL
import { getProjectDetails } from "../api";
import { Box, Typography, CircularProgress, Tabs, Tab } from "@mui/material";
import { motion } from "framer-motion";

// آیکون‌ها برای تب‌ها
import InfoIcon from "@mui/icons-material/Info";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssessmentIcon from "@mui/icons-material/Assessment";

// کامپوننت پنل تب (محتوای هر تب)
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        // انیمیشن Fade in برای محتوای هر تب
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ p: 3 }}>{children}</Box>
        </motion.div>
      )}
    </div>
  );
}

function ProjectDetailPage() {
  const { projectId } = useParams(); // خواندن ID از URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0); // مدیریت تب فعال

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await getProjectDetails(projectId);
        setProject(response.data);
        setError(null);
      } catch (err) {
        setError("خطا در دریافت جزییات پروژه");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]); // هر وقت ID عوض شد، دوباره فچ کن

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom>
        {project.project_name} {/* نام پروژه */}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="اطلاعات پروژه" icon={<InfoIcon />} />
          <Tab label="تقویم محتوایی" icon={<CalendarMonthIcon />} />
          <Tab label="سناریوها" icon={<DescriptionIcon />} />
          <Tab label="تحلیل هفتگی" icon={<AnalyticsIcon />} />
          <Tab label="گزارش ماهانه" icon={<AssessmentIcon />} />
        </Tabs>
      </Box>

      {/* محتوای تب‌ها */}
      <TabPanel value={currentTab} index={0}>
        <Typography>جزییات اطلاعات پروژه اینجا قرار می‌گیرد...</Typography>
        {/* TODO: نمایش اطلاعات تب ۱ */}
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Typography>تقویم محتوایی اینجا قرار می‌گیرد...</Typography>
        {/* TODO: نمایش تقویم (تب ۲) */}
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <Typography>لیست سناریوها اینجا قرار می‌گیرد...</Typography>
        {/* TODO: نمایش لیست سناریوها (تب ۳) */}
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <Typography>تحلیل هفتگی اینجا قرار می‌گیرد...</Typography>
        {/* TODO: نمایش تحلیل هفتگی (تب ۴) */}
      </TabPanel>
      <TabPanel value={currentTab} index={4}>
        <Typography>گزارش ماهانه اینجا قرار می‌گیرد...</Typography>
        {/* TODO: نمایش گزارش ماهانه (تب ۵) */}
      </TabPanel>
    </motion.div>
  );
}

export default ProjectDetailPage;