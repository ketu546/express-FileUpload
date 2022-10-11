const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mongoose = require('mongoose');
const fs = require("fs")

const expressFileUpload = require("express-fileupload");


const app = express();

const File = require("./models/uploadFile");
const { response } = require("express");

// Database Conection
const url = 'mongodb://localhost:27017/expressFileUpload';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Database connected.....");
}).on("err", () => {
    console.log("Connection failed....");
})





app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressFileUpload());

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")


app.get('/', async (req, res) => {
    const file = await File.find()
    // console.log(file);
    res.render("home", { file })
});

app.get('/upload', (req, res) => {
    res.render("upload")
});

app.post('/upload', (req, res) => {
    if (!req.files) {
        console.log("error");
    } else {
        const file = req.files.file;

        if (Array.isArray(file)) {

            file.forEach((fileUpload) => {

                const fileName = `${Date.now()}-${fileUpload.name}`
                const originalName = fileUpload.name
                const fileSize = fileUpload.size

                fileUpload.mv(path.join(__dirname, `./public/img/upload/${fileName}`), (err) => {
                    if (err) { console.log(`Error= ${err}`); }
                    if (!err) {
                        const uplodes = new File({
                            fileName: fileName,
                            orignalName: originalName,
                            size: fileSize,
                        })
                        uplodes.save().then(done => {
                            if (done) {
                                uploadDone++;
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                })
            })
            res.redirect("/")
        } else {

            const fileName = `${Date.now()}-${file.name}`
            const originalName = file.name
            const fileSize = file.size

            file.mv(path.join(__dirname, `./public/img/upload/${fileName}`), (err) => {
                if (err) { console.log(`Error= ${err}`); }
                if (!err) {
                    const uplodes = new File({
                        fileName: fileName,
                        orignalName: originalName,
                        size: fileSize,
                    })
                    uplodes.save().then(data => {
                        res.redirect("/")
                    })
                }
            })
        }


    }
});

app.get("/delete/:id", async (req, res) => {
    const id = req.params.id
    File.findOneAndDelete({ _id: id }).then(data => {
        fs.unlinkSync(path.join(__dirname, `./public/img/upload/${data.fileName}`))
        res.redirect("/")
    }).catch(err => {
        console.log(err);
        res.redirect("/")
    })
})











const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servre is Raning op PORT ${PORT}`);
});