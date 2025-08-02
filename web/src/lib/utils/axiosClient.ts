import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Optional: Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response errors here, like logging out on 401
    if (error.response && error.response.status === 401) {
      // Perform logout or redirect
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
