const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.resolve(__dirname, './dist')));

app.use('/', (req, res)=>{
    var html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');
    res.send(html);   
})


app.listen(80,() => {
    console.log('app listening on port 80.');
})

