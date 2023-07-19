const express = require("express");
const scrape = require(__dirname + "/scraper.js")
const app = express();
const port = 3000

app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    // -- autenticate user --
    await scrape.scrapeData(username, password);
    let output = username + " " + password;
    res.send(output);
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})