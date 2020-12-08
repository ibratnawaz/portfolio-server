require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;

const app = express();
app.use(express.json());
app.use(cors());

const dbURL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 3000;
const dbName = process.env.DB_NAME || "test";

app.get("/portfolio", async (req, res) => {
    try {
        const clientInfo = await mongoClient.connect(dbURL);
        let db = clientInfo.db(dbName);
        let _id = process.env._id;
        let data = await db.collection("users").find(objectId(_id)).toArray();
        res.status(200).json({
            status: "success",
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (err) {
        console.log(err);
        res.send(500);
    }
});

app.post("/portfolio/create", async (req, res) => {
    try {
        const clientInfo = await mongoClient.connect(dbURL);
        let db = clientInfo.db(dbName);
        let data = await db.collection("users").insertOne(req.body);
        res.status(200).json({
            status: "success",
            message: "user created"
        });
        clientInfo.close();
    } catch (err) {
        console.log(err);
        res.send(500);
    }
});

app.put("/portfolio/edit/:id", async (req, res) => {
    try {
        const clientInfo = await mongoClient.connect(dbURL);
        let db = clientInfo.db(dbName);
        let data = await db.collection("users").findOneAndUpdate({
            _id: objectId(req.params.id)
        }, {
            $set: req.body
        });
        res.status(200).json({
            status: "success",
            message: "details updated"
        });
        clientInfo.close();
    } catch (err) {
        console.log(err);
        res.send(500);
    }
});

app.listen(port, () => {
    console.log(`App listening at port ${port}`);
})