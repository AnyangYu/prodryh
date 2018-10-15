var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken'),
    mysql   = require('mysql')

var app = module.exports = express.Router();

var pool = mysql.createPool(config.mysql)

app.post('/login', function(req, res){

  pool.getConnection(function(err, connection){
    if (err) throw err
    var sql = "select username, password, role from ryhuser2 where username='"+req.body.username+"' and password='"+req.body.password+"' and userstatus=1";
    console.log(sql)
    connection.query(sql, function(err, result){
      console.log(err)
      console.log(result)
      var users = JSON.parse(JSON.stringify(result))
      connection.release();

      //Then:
      if (users.length>0){
              res.status(200).send({
                code: 200,
                msg: "请求成功",
                user: {
                        username: users[0].username,
                        password: users[0].password,
                        role: users[0].role,
                        avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
                        name: users[0].username
                }
              });
      }else{
        res.status(200).send({
                code: 500,
                msg: '账号或密码错误'
        });
      }
    });
  });
});

app.get('/user/listpage', function(req, res){
  var page = req.query.page
  var start = (page-1)*20
  var end = page*20 -1

  pool.getConnection(function(err, connection){
    if (err) throw err
    var sql = "select username, userstatus, percentage, password from ryhuser2 where role='source' order by createtime desc";
    console.log(sql)
    connection.query(sql, function(err, result){
      console.log(err)
      console.log(result)
      var users = JSON.parse(JSON.stringify(result))
      connection.release();

      //Then:
      var pagedUsers = []
      for(i=0; i<users.length; i++){
        if(i>=start && i<=end){
                pagedUsers.push(users[i])
        }
      }
              res.status(200).send({
                code: 200,
                msg: "请求成功",
                total: users.length,
                users:  pagedUsers
              });
    });
  });
});

app.get('/user/edit', function(req, res){
  pool.getConnection(function(err, connection){
    if (err) throw err
    var username = req.query.username
        var userstatus = req.query.userstatus
        var percentage = req.query.percentage
        var password = req.query.password

    var sql = "update ryhuser2 set userstatus='"+userstatus+"', percentage='"+percentage+"', password='"+password+"' where username='"+username+"'";
    console.log(sql)
    connection.query(sql, function(err, result){
      console.log(err)
      console.log(result)
      connection.release();
              res.status(200).send({
                code: 200,
                msg: "编辑成功"
              });
    });
  });
});

app.get('/user/add', function(req, res){
  pool.getConnection(function(err, connection){
    if (err) throw err
    var username = req.query.username
        var userstatus = req.query.userstatus
        var percentage = req.query.percentage
        var password = req.query.password

    var sql = "insert into ryhuser2 values ('"+username+"', '"+password+"', "+percentage+" ,'source', 'system', "+ userstatus+", NOW())";
    console.log(sql)
    connection.query(sql, function(err, result){
      console.log(err)
      console.log(result)
      connection.release();
              res.status(200).send({
                code: 200,
                msg: "新增成功"
              });
    });
  });
});

//2.
app.get('/user/list', function(req, res){
  var page = req.query.page
  var start = (page-1)*20
  var end = page*20 -1

  var rtime = req.query.registertime
  var username = req.query.username
  console.log(rtime)
  pool.getConnection(function(err, connection){
    if (err) throw err
    //var sql = "select * from ryhuser2"

        var sql = "select username, DATE_FORMAT(registertime,'%m-%d-%Y') as registertime, phonenumber from ryhdata2 where username='"+username+"' order by registertime"
    if (rtime !== ''){
        var sql = "select username, DATE_FORMAT(registertime,'%m-%d-%Y') as registertime, phonenumber from ryhdata2 where username='"+username+"' and DATE_FORMAT(date_sub(registertime, interval 8 hour),'%m-%d-%Y')=DATE_FORMAT('"+rtime+"','%m-%d-%Y') order by registertime"
    }
    console.log(sql)
    connection.query(sql, function(err, result){
      console.log(err)
      console.log(result)
      var data = JSON.parse(JSON.stringify(result))
      connection.release();

      //Then:
      var pageddata = []
      for(i=0; i<data.length; i++){
        if(i>=start && i<=end){
                pageddata.push(data[i])
        }
      }
              res.status(200).send({
                code: 200,
                msg: "请求成功",
                total: data.length,
                users:  pageddata
              });
    });
  });
});
