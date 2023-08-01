const express = require("express");
const scrape = require(__dirname + "/scraper.js")
const app = express();
const port = 3000

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    // -- autenticate user --
    await scrape.scrapeData(username, password);

    await compressFiles([
        "following.json",
        "followers.json",
        "overlap.json",
        "onlyInFollowing.json",
        "onlyInFollowers.json"
    ], "output.zip");

    res.write("<a style='display: block' href='/download/output.zip' download>Download all</a>");
    res.write("<a style='display: block' href='/download/following.json' download>Download following</a>");
    res.write("<a style='display: block' href='/download/followers.json' download>Download followers</a>");
    res.write("<a style='display: block' href='/download/overlap.json' download>Download overlap</a>");
    res.write("<a style='display: block' href='/download/onlyInFollowing.json' download>Download onlyInFollowing</a>");
    res.write("<a style='display: block' href='/download/onlyInFollowers.json' download>Download onlyInFollowers</a>");
    res.send();
})

app.get('/download/:filename', function(req, res){
    const file = __dirname + "/output/" + req.params.filename;
    res.download(file);
  });

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