const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    readFile('db/db.json', "utf-8").then(notes => {
        let notesArray;
        try {
            notesArray = [].concat(JSON.parse(notes))
        } catch (error) {
            notesArray = []
        }
        return notesArray;
    }).then(notesArray => res.json(notesArray))

})

app.post("/api/notes", (req, res) => {
    readFile('db/db.json', "utf-8").then(notes => {
        let notesArray;
        try {
            notesArray = [].concat(JSON.parse(notes))
        } catch (error) {
            notesArray = []
        }
        return notesArray;
    }).then(oldArray => {
        var notesObject = {
            title: req.body.title,
            text: req.body.text,
            id: 1
        }
        var newArray = [...oldArray, notesObject]
        return writeFile("db/db.json", JSON.stringify(newArray))
    }).then(() => res.json({
        msg:"ok"
    }))

})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });