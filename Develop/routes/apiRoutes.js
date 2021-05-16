const fs = require("fs");
const { get } = require("http");

module.exports = (app) => {
    app.get("/api/notes", (req, res) => {
        //called by get notes function. 
        //expecting a json array of objects. each object has 3 properties. title, text, id.
        //read data from file, return as json
        res.json(getData())
    });
    app.post("/api/notes", (req, res) => {
        //called by saved note. no response data needed
        //getting object w/ title and text. need to add id before saving it.
        const data = getData()
        //new note coming in from post request
        const note = req.body
        //will give a number that matches this exact milisecond. no two notes will have the same id
        note.id = Date.now()
        //added new note to array of notes
        data.push (note)
        //saves result
        saveData(data)
        //sends response with no content because front end is ignoring all content.
        res.send()
    });
    // : = placeholder
    app.delete("/api/notes/:id", (req, res) => {
        //called by delete note. no response data needed
        // extracts the placeholder to use as id
        //read as string and converted to number
        const id = Number(req.params.id)
        const data = getData()
        const noteIndex = data.findIndex(n => n.id === id)
        if (noteIndex >= 0) {
            //remove the item at note index and remove 1 item
            data.splice (noteIndex, 1)
            saveData(data)
        }
        res.send()
    });
}


//read a text file and parsed into json
const getData = () => {
    const text = fs.readFileSync("./db/db.json")
    return JSON.parse(text)
};
const saveData = (json) => {
    const text = JSON.stringify(json)
    fs.writeFileSync("./db/db.json", text)
};