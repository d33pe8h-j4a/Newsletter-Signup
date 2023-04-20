const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    console.log("Name: " + req.body.fname + " " + req.body.lname);
    console.log("email: " + req.body.email);
    const data = {
        members: [
            {
                email_address: req.body.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.fname,
                    LNAME: req.body.lname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = 'https://us21.api.mailchimp.com/3.0/lists/040943989f';
    const options = {
        method: "POST",
        auth: "deepesh3:5b73306b4a16ef6ae10b4abaedad35d5-us21"
    };

    const request = https.request(url, options, response => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else 
            res.sendFile(__dirname + "/failure.html");
        response.on("data", data => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})


app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});


// API Key: 5b73306b4a16ef6ae10b4abaedad35d5-us21
// List Id: 040943989f