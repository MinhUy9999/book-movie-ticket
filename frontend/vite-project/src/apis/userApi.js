import axios from "axios";

// Định nghĩa base URL từ biến môi trường Vite
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/users/";

// Hàm xử lý lỗi chung
const handleError = (error) => {
    if (error.response) {
        return {
            statusCode: error.response.status,
            content: null,
            message: error.response.data.message || "An error occurred",
            date: new Date().toISOString(),
        };
    }
    return {
        statusCode: 500,
        content: null,
        message: error.message || "Network error",
        date: new Date().toISOString(),
    };
};

// Cấu hình axios instance với base URL
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Để gửi cookie (refreshToken)
});

// Thêm interceptor để gắn accessToken vào header (nếu cần)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Các hàm gọi API
export const userApi = {
    // Đăng ký người dùng
    async register(userData) {
        try {
            const response = await api.post("/register", userData);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Đăng nhập
    async login(credentials) {
        try {
            const response = await api.post("/login", credentials);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Làm mới token
    async refreshToken() {
        try {
            const response = await api.post("/refresh-token");
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Đăng xuất
    async logout() {
        try {
            const response = await api.post("/logout");
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Gửi email quên mật khẩu
    async forgotPassword(email) {
        try {
            const response = await api.post("/forgot-password", email);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Đặt lại mật khẩu
    async resetPassword(data) {
        try {
            const response = await api.post("/reset-password", data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },
};