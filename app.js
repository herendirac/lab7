const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

const request = require('request');
const shufflefy = require('shufflefy');


//routes
app.get("/", async function(req,res){ //root route ========================
    
    let keyword = getWord()
    let parsedData = await getImages(keyword, "all");
    let shuffled = shufflefy(parsedData.hits);
    // console.log("shuffled parsed data: " + parsedData);
    
    res.render("index", {
        "keyword":keyword,
        "image1":shuffled[0],
        "image2":shuffled[1],
        "image3":shuffled[2],
        "image4":shuffled[3]
    });
    
})//root route


app.get("/results", async function(req,res){ //results route ================
    
    let keyword = req.query.keyword; //gets the value that the user typed in the form
    let orientation = req.query.orientation.toLowerCase();
    let parsedData = await getImages(keyword, orientation);
    let shuffled = shufflefy(parsedData.hits);
    // console.log("shuffled parsed data: " + shuffled);
    
    res.render("results", {
        "keyword":keyword,
        "orientation": orientation,
        "image1":shuffled[0],
        "image2":shuffled[1],
        "image3":shuffled[2],
        "image4":shuffled[3]
    });
    
})//results route


//starting server
app.listen(process.env.PORT, process.env.IP, function(){ //app listener ========
    console.log("Express server is running...");
});




//returns all data from the Pixabay API as JSON format
function getImages(keyword, orientation){
    return new Promise(function(resolve, reject){
        
        request('https://pixabay.com/api/?key=13797841-a8d5bfb0e5b0179c59dd07a69&q='+keyword+'&orientation='+orientation, 
        function (error, response, body) {
            if(!error && response.statusCode == 200){ //no issues in the request
                let parsedData = JSON.parse(body);
                
                resolve(parsedData);
                
                // let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
                // res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
                // res.render("results", {"images": parsedData});
            }
            else{
                reject(error);
                console.warn(response.statusCode);
                console.error(error);
            }
        });//results
    });//end Promise
}

function getWord(){
    let arr = ["summer", "spring", "autumn", "winter"]
    
    let shuffledArr =shufflefy(arr);
    
    return shuffledArr[0];
}