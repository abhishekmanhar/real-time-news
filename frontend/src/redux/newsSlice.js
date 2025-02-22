import { createSlice } from "@reduxjs/toolkit";

const newsSlice = createSlice({
    name: "news",
    initialState: { articles: [] },
    reducers: {
        setNews: (state, action) => { state.articles = action.payload; },
        addNews: (state, action) => { state.articles.unshift(action.payload); },
    },
});

export const { setNews, addNews } = newsSlice.actions;
export default newsSlice.reducer;
