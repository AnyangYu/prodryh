var express     = require('express'),
    mysql       = require('mysql'),
    config      = require('./config'),
    datetime    = require('node-datetime');

var app = module.exports = express.Router()
var pool = mysql.createPool(config.mysql)

app.post('/crawlerdata', function(req, res){
        console.log(req.body);
        var percentage = ""
        pool.getConnection(function(err, connection){
                if (err) throw err
                var sql = "select percentage from ryhuser2 where username='"+req.body.username+"'";
                console.log(sql);
                connection.query(sql, function(err, result){
                        console.log(result)
                        console.log(JSON.stringify(result));
                        var percentages = JSON.parse(JSON.stringify(result))
                        console.log(percentages)
                        if (percentages.length > 0) percentage = percentages[0].percentage
			else percentage = 100
                        connection.release();

                        //Use percentange to filter
                        percentage = parseFloat(percentage)
                        console.log(percentage)
                if (percentage >= 0 && percentage <=100) {
                                var random = Math.floor(Math.random()*101) + 0
                                var isPresent = false
                                console.log(random)
                                console.log(isPresent)
                                if (random <= percentage){
                                        isPresent = true
                                }
                                pool.getConnection(function(err, connection){
                                        if (err) throw err
                                        var sql = "insert into ryhdata2 (username, personname, phonenumber, registertime, ispresent, createdatetime) values ('"+req.body.username+"' ,'"+req.body.personname+"', '"+req.body.phonenumber+"', '"+req.body.registertime+"',"+ isPresent+", NOW()) on duplicate key update phonenumber='"+req.body.phonenumber+"'";
                                        console.log(sql);
                                        connection.query(sql, function(err, result){
                                               console.log('err: ')
                                               console.log(err)
                                               console.log(result);
                                               connection.release()
                                         });
                               });
                        }
                        });
        });

        res.status(200).send({'state': 'received your data'})
})
