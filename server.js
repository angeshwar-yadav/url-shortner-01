const UrlModel = require("./models/URL");
const express = require('express');
require('dotenv').config();
const mongoose =require('mongoose');


const app = express()
app.use(express.json());
const PORT =3000;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
    
    
})
.catch((error)=>{
    console.error("MongoDB Failed", error );
    console.log(error.message)
})


function generateCode(){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let code ="";

    for(let i=0;i<6;i++){
        const randomIndex = Math.floor(Math.random()*characters.length);
        code+=characters[randomIndex]; 
    }
    return code;
    
}

app.post("/api/shorten", async (req, res) => {
    const { url } = req.body;
    

    if (!url) {
        return res.status(400).json({
            message: "URL is required"
        });
    }

    try {
        new URL(url);
        
    } catch {
        return res.status(400).json({
            message: "Invalid URL: Please provide a valid URL"
            
        });
    }

    let shortCode = generateCode();

    while (await UrlModel.findOne({ shortCode })) {
        shortCode = generateCode();
    }

    const newUrl = await UrlModel.create({
        originalUrl: url,
        shortCode: shortCode
    });
    
    res.json({
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl: `http://localhost:${PORT}/${newUrl.shortCode}`
    });
});
app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    const urlRecord = await UrlModel.findOne({ shortCode });
    if (!urlRecord) {
        return res.status(404).json({
            message: "Invalid URL"
        });
    }
    urlRecord.clicks+=1;
    await urlRecord.save();

    res.redirect(urlRecord.originalUrl);
});

app.listen(PORT , () =>{
    console.log(`Server is live at ${PORT}`);
});