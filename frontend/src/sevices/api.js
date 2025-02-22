import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchNews = async (category = "general") => {
    try {
        const response = await axios.get(`${API_URL}/news?category=${category}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};
