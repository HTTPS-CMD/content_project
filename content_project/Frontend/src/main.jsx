// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // فایل CSS ریست شده شما

// --- ایمپورت‌های مورد نیاز برای MUI و RTL ---
import { ThemeProvider, createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { CssBaseline } from '@mui/material';

// --- ساخت تم و کش RTL (به صورت سراسری) ---
const rtlTheme = createTheme({
  direction: 'rtl', // <-- جهت‌دهی سراسری
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* اینها اکنون کل برنامه را RTL می‌کنند */}
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={rtlTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </CacheProvider>
    </BrowserRouter>
  </React.StrictMode>
);