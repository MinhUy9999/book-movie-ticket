import axios from "axios";

// URL cơ bản của backend (thay đổi theo cấu hình của bạn)
const BASE_URL = "http://localhost:5000/api/movies"; // Ví dụ: "http://localhost:5000/api/movies"

// Lấy token từ localStorage (nếu có)
const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// API cho các route công khai (không cần auth)
const apiMovies = {
    // Lấy danh sách phim đang hoạt động
    getActiveMovies: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching active movies");
        }
    },

    // Tìm kiếm phim
    searchMovies: async (query) => {
        try {
            const response = await axios.get(`${BASE_URL}/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error searching movies");
        }
    },

    // Lấy danh sách phim sắp chiếu
    getUpcomingMovies: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/upcoming`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching upcoming movies");
        }
    },

    // Lấy phim theo thể loại
    getMoviesByGenre: async (genre) => {
        try {
            const response = await axios.get(`${BASE_URL}/genre/${genre}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching movies by genre");
        }
    },

    // Lấy chi tiết phim theo ID
    getMovieById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching movie by ID");
        }
    },

    // Lấy lịch chiếu của phim theo ID
    getMovieShowtimes: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}/showtimes`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching movie showtimes");
        }
    },

    // API cho admin (yêu cầu token và role "admin")
    // Tạo phim mới
    createMovie: async (movieData) => {
        try {
            const response = await axios.post(`${BASE_URL}/`, movieData, {
                headers: {
                    ...getAuthHeader(),
                    "Content-Type": "multipart/form-data", // Nếu upload file (poster, trailer)
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error creating movie");
        }
    },

    // Cập nhật phim
    updateMovie: async (id, movieData) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, movieData, {
                headers: {
                    ...getAuthHeader(),
                    "Content-Type": "multipart/form-data", // Nếu upload file
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error updating movie");
        }
    },

    // Xóa phim
    deleteMovie: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error deleting movie");
        }
    },

    // Lấy tất cả phim (bao gồm phim không hoạt động) - chỉ dành cho admin
    getAllMovies: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/all/include-inactive`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error fetching all movies");
        }
    },
};

export { apiMovies };