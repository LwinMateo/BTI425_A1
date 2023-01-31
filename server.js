/*********************************************************************************
*  BTI425 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___Lwin Yonal Mateo Lopez_______________ Student ID: __134710201____________ Date: __01/16/2023____________

*  Cyclic Link: 

*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const cors = require("cors");

const MoviesDB = require("./modules/moviesDB.js");


const db = new MoviesDB();

var app = express();

app.use(express.json());
app.use(cors());
require('dotenv').config(); 
const HTTP_PORT = process.env.PORT || 8080;




app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

//Add new
app.post("/api/movies", (req, res) => {
    res.status(201).json(db.addNewMovie(req.body));
});

app.get("/api/movies", (req, res) => {
    
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((movies) => {res.status(200).json(movies)})
    .catch((err) => {res.status(500).json({ error: err })});
    
});

app.get("/api/movies/:_id", (req, res) => {
    
    db.getMovieById(req.params._id)
    .then((movie)=>{
        res.status(200).json(movie)
    })
    .catch((err)=>{
        res.status(500).json({ error: err })
    });
    
});

app.put("/api/movies/:_id", (req, res) => {


    db.updateMovieById(req.body, req.params._id)
    .then(() => {
        res.status(200).json({ message : 'Success update for _id'});
    })
    .catch((err) => {
        res.status(500).json({ error: err })
    });

});

app.delete("/api/movies/:_id", (req, res) => {
    db.deleteMovieById(req.params._id)
    .then(() => {
        res.status(204)
    }).catch(() => {
        res.status(500).json({"message" : "Server Error on Delete"});
    });
});

app.use((req, res) => {
    res.status(404).send("Resource not found");
});


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});