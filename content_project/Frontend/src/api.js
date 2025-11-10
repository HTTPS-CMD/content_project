import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// یک "instance" از axios می‌سازیم که تنظیمات پیش‌فرض ما را داشته باشد
const apiClient = axios.create({
  baseURL: API_URL,
});

// --- بخش جادویی: Interceptor ---

apiClient.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('access_token');
    if (token) {

      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const loginUser = (username, password) => {
  return apiClient.post('/api/v1/token/', { // نیازی به API_URL نیست
    username: username,
    password: password
  });
};

/**
 * تابع جدید: دریافت لیست پروژه‌ها
 */
export const getProjects = () => {
  return apiClient.get('/api/v1/projects/'); // توکن به صورت خودکار ضمیمه می‌شود
};

/** * تابع جدید: دریافت جزییات کامل یک پروژه (برای صفحه تب‌بندی)
 * @param {string} projectId - شناسه (ID) پروژه
 */
export const getProjectDetails = (projectId) => {
  return apiClient.get(`/api/v1/projects/${projectId}/`);
};


export default apiClient;