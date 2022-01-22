const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));  // server can serve up static files using this static().

app.get("/",function(req,res)
{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res)
{
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;
    console.log(firstName,lastName,email);

    var data =   // this was in mailchimp documenttion 
    {
        members: [    // arrray of objects
            {
                email_address: email,
                status : "subscribed",
                merge_fields: 
                {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);  // it will convert data object to json format

    const url = "https://us20.api.mailchimp.com/3.0/lists/5f0dce50e6"  // from mail chimp website
    
    const options = // required as per documentation of mailchimp
    {
        method: "POST",
        auth: "Ausaf1:932dfcca9dbf067dcb3bed4557937a3d-us20"
    }
    
    const request = https.request(url, options, function(response)  //required as per documentation of mailchimp
    {
        if(response.statusCode == 200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data)
        {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res)  // incase person clicks try again he will be directed to home page
{
    res.redirect("/");
})





app.listen(process.env.PORT || 3000,function()  // this port is dynamic and will be used by Heroku
{
    console.log("Server is running on port 3000.");
});

// f69e7e4b587a5eca1a33048582c8ad25-us20

// 