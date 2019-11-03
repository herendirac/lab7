const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

const request = require('request');
const shufflefy = require('shufflefy');

//routes
app.get("/", async function(req, res){
    
 let keyword = getWord();
    let parsedData = await getImages(keyword, "all");
    let shuffled = shufflefy(parsedData.hits);
 
 //console.dir("parsedData: " + parsedData); //displays content of the object
 
    // shuffle array
 res.render("index", {
        "keyword":keyword,"image1":shuffled[0],"image2":shuffled[1],"image3":shuffled[2],"image4":shuffled[3]});
            
}); //root route


app.get("/results", async function(req, res){
    
    //console.dir(req);
    let keyword = req.query.keyword; //gets the value that the user typed in the form using the GET method
    let shuffled = shufflefy(parsedData.hits);
    let parsedData = await getImages(keyword);
    let orientation = req.query.orientation.toLowerCase();
    //array shuffle
    res.render("results", {"keyword":keyword,"orientation": orientation,"image1":shuffled[0],"image2":shuffled[1],"image3":shuffled[2],"image4":shuffled[3]});
    
});//results route


//Returns all data from the Pixabay API as JSON format
function getImages(keyword, orientation){
    
    
    return new Promise( function(resolve, reject){
        request('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='+keyword+'&orientation='+orientation,
                 function (error, response, body) {
    
            if (!error && response.statusCode == 200  ) { //no issues in the request
                
                 let parsedData = JSON.parse(body); //converts string to JSON
                 
                 resolve(parsedData);
                
                //let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
                //res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
                //res.render("index", {"image":parsedData.hits[randomIndex].largeImageURL});
                
            } else {
                reject(error);
                console.warn(response.statusCode);
                console.error(error);
            }
    
          });//request
   
    });
    
}

function getWord(){
    let arr = ["Painterly", "abstract", "Botanical", "Realism"];
    
    let shuffledArr =shufflefy(arr);
    
    return shuffledArr[0];
}

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});