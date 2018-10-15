var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next){
        if (err.name === 'StatusError') {
                res.send(err.status, err.message);
        } else {
                next(err);
        }
});

app.use(require('./user-routes'));

var port = process.env.PORT || 88;

http.createServer(app).listen(port, function(err){
        console.log('listening in http://localhost:' + port);
});
