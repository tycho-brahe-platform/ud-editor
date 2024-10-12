import axios from 'axios';

const api = axios.create({
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  baseURL: import.meta.env.VITE_APP_URL_API,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = `${
        import.meta.env.VITE_APP_PUBLIC_URL
      }/unauthorized`;
    } else if (error.status === null) {
      console.log(JSON.stringify(error));
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  if (!config?.headers) {
    throw new Error('no header available');
  }

  return config;
});

export default api;
