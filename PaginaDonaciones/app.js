"use strict"

import fs from "fs"
import express from "express"

const app = express();
const port = 3000;
app.use(express.static('.'))


app.get('/', (request, response)=>{
    console.log('Loading page...');
    fs.readFile('./donaciones.html', 'utf8', (err, html)=>{
        if(err) response.status(500).send('There was an error: ' + err)
        console.log('Loading page...');
        response.send(html);
    })
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});