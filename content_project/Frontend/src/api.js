import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// یک "instance" از axios می‌سازیم که تنظیمات پیش‌فرض ما را داشته باشد
const apiClient = axios.create({
  baseURL: API_URL,
});

// --- بخش جادویی: Interceptor ---
// این کد قبل از *هر* درخواست اجرا می‌شود
apiClient.interceptors.request.use(
  (config) => {
    // توکن را از Local Storage بخوان
    const token = localStorage.getItem('access_token');
    if (token) {
      // اگر توکن بود، آن را به هدر درخواست اضافه کن
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * تابع برای ورود کاربر (حالا از apiClient استفاده می‌کند)
 */
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

// (در آینده APIهای دیگر را اینجا اضافه می‌کنیم)

export default apiClient; // ما instance را export می‌کنیم