const setupNewsSockets = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected");

        socket.on("newArticle", (article) => {
            io.emit("updateFeed", article);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};

export default setupNewsSockets;
