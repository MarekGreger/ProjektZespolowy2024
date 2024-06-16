import express from "express";

const app = express();
const port = 3000;

// serving the react app on "/"
app.use(express.static("dist/frontend"));

// delete after making a minimum working server, this just makes sure the basics work
app.get("/ping", (_, res) => {
    res.send("pong");
});

app.listen(port, () => {
    console.log(`express listening on port ${port}`);
});

export default app;