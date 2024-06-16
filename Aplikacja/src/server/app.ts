import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";

const app = express();

// serving the react app on "/"
app.use(express.static("dist/frontend"));
app.use("/panel/*",express.static("dist/frontend"));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export const connection = await mysql.createConnection({
    host: process.env["DB_HOST"],
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_NAME"],
    timezone: "Z"
    // ssl: {
    //     ca: process.env["DB_SSL_CA"],
    //     cert: process.env["DB_SSL_CERT"],
    //     key: process.env["DB_SSL_KEY"],
    //     rejectUnauthorized:false
    // },
});
console.log("connected to DB");

export default app;

