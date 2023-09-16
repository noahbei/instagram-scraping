const express = require("express");
const ejs = require("ejs");
const fs = require("fs").promises;
const path = require("path");
const archiver = require("archiver");
const scrape = require(__dirname + "/scraper.js")
const app = express();
const port = 3000
const filePaths = [
    __dirname + "/output/followers.json",
    __dirname + "/output/following.json",
    __dirname + "/output/overlap.json",
    __dirname + "/output/onlyInFollowers.json",
    __dirname + "/output/onlyInFollowing.json",
]

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
    await scrape.scrapeData(username, password);

    res.redirect("/results")
})

app.get('/download/:filename', async (req, res) => {
    const file = __dirname + "/output/" + req.params.filename;
    if (req.params.filename === "output.zip") {
        await compressFiles(filePaths, "output.zip");
    }
    res.download(file);
});

app.get("/results", async (req, res) => {
    try {
        const fileContents = await Promise.all(filePaths.map(filepath => fs.readFile(filepath, "utf-8")));
        const results = fileContents.map(data => JSON.parse(data));
        res.render("results.ejs", {page : "results", data : results});
    } catch (error) {
        //send error to log
        //console.error(error);
        res.status(500).render("error.ejs", {page: "home"});
    }
})

app.get("/test", (req, res) => {
    const file = __dirname + "/output/" + "output.zip";
    res.download(file)
})

app.get("/about", (req, res) => {
    res.render("about.ejs", {page : "about"})
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

async function compressFiles(fileList, zipFileName) {
    const fs = require("fs");
    const outputFilePath = __dirname + "/output/" + zipFileName;

    return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFilePath);
    const archive = archiver("zip", {
        zlib: { level: 9 }
    });

    output.on("close", () => {
        if (errorSize === fileList.length)
            fs.unlink(outputFilePath, (err) => {if(err) console.log("could not delete output.zip")});
        else
            console.log(archive.pointer() + " total bytes");
        resolve();
    });

    archive.pipe(output);
    let errorStr = "";
    let errorSize = 0;
    for (const file of fileList) {
        try {
            fs.promises.access(file, fs.constants.F_OK);
            const fileName = path.basename(file);
            console.log(fileName);
            archive.append(fs.createReadStream(file), { name: fileName });
        } catch (error) {
            errorStr += fileName;
            errorSize++;
        }
    }
    if (errorStr !== "") {
        errorStr = errorStr.slice(0, -2);
        console.error(`The file(s) ${errorStr} do not exist or cannot be accessed.`)
    }

    archive.finalize();
    });
}