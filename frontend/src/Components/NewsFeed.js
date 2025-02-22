import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNews } from "../redux/newsSlice";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const NewsFeed = () => {
    const dispatch = useDispatch();
    const news = useSelector((state) => state.news.articles);
    const [category, setCategory] = useState("general");

    useEffect(() => {
        const fetchNews = async () => {
            const response = await axios.get(`/api/news?category=${category}`);
            dispatch(setNews(response.data));
        };

        fetchNews();
        socket.emit("subscribeCategory", category);
        socket.on("newsUpdate", (newArticles) => dispatch(setNews(newArticles)));

        return () => socket.off("newsUpdate");
    }, [category, dispatch]);

    return (
        <div>
            <h2>News Feed</h2>
            <select onChange={(e) => setCategory(e.target.value)}>
                <option value="general">General</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="sports">Sports</option>
            </select>
            {news.map((article, index) => (
                <div key={index}>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                </div>
            ))}
        </div>
    );
};

export default NewsFeed;
