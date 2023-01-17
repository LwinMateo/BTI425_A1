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
const dotenv = require('dotenv').config(); 
const MoviesDB = require("./modules/moviesDB.js");


const db = new MoviesDB();


const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message : "API Listening" });
});

//Add new
app.post("/api/movies", (req, res) => {
    res.status(201).json(db.addNewMovie(req.body));
});

app.get("/api/movies", (req, res) => {
    
    db.getAllMovies(req.query.page, req.query.perPage, req,query.title)
    .then((movies) => res.json(movies))
    .catch((err) => res.json(err));
    
});

app.get("/api/movies/:id", (req, res) => {
    
    db.getMovieById(req.params.id)
    .then((movies)=>{
        movies ? res.json(movies) : res.status(404).json({"message": "movie id not found"});
    })
    .catch((err)=>{
        res.status(500).json({ "message" : "Server Error for getting movie by id" });
    });
    
});

app.put("/api/movies/:id", (req, res) => {


    db.updateMovieById(req.body, req.params.id)
    .then((movies) => {
        movies ? res.json(movies) : res.status(404).json({"message" : "movies not updated"});
    })
    .catch((err) => {
        res.status(500).json({ "message" : "Server Error on Update" });
        console.log(err);
    });

});

app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id)
    .then((movies) => {
        movies ? res.status(204).end() : res.status(404).json({"message" : "NOT ABLE TO DELETE!!"});
    }).catch(() => {
        res.status(500).json({"message" : "Server Error on Delete"});
    });
});


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});