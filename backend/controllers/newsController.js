import News from "../models/News.js";

export const getNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: "Error fetching news" });
    }
};

export const getTrendingNews = async (req, res) => {
    try {
        const trending = await News.aggregate([
            { $sort: { views: -1, likes: -1 } },
            { $limit: 5 }
        ]);
        res.json(trending);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trending news" });
    }
};

export const postNews = (req, res) => { 
    res.json({ message: "Posting news..." });
};