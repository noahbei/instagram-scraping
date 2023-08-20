const express = require("express");
const ejs = require("ejs");
const scrape = require(__dirname + "/scraper.js")
const app = express();
const port = 3000

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index.ejs", {page : "home"})
})

app.post("/", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    // -- autenticate user --
    //await scrape.scrapeData(username, password);

    await compressFiles([
        "following.json",
        "followers.json",
        "overlap.json",
        "onlyInFollowing.json",
        "onlyInFollowers.json"
    ], "output.zip");

    res.redirect("/results")
})

app.get('/download/:filename', (req, res) => {
    const file = __dirname + "/output/" + req.params.filename;
    res.download(file);
  });

app.get("/results", (req, res) => {
    res.render("results.ejs", {page : "results"})
})

app.get("/about", (req, res) => {
    res.render("about.ejs", {page : "about"})
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

async function compressFiles(fileList, zipFileName) {
    const archiver = require("archiver");
    const fs = require("fs");
    const outputFilePath = __dirname + "/output/" + zipFileName;

    const output = fs.createWriteStream(outputFilePath);
    const archive = archiver("zip", {
        zlib: { level: 9 }
    });

    output.on("close", () => {
        console.log(archive.pointer() + " total bytes");
    });

    archive.pipe(output);

    for (const file of fileList) {
        const filePath = __dirname + "/output/" + file;
        archive.append(fs.createReadStream(filePath), { name: file });
    }

    archive.finalize();
}