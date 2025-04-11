var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var url = require('url');
var fs = require('fs');
var http = require('http');

var connection = mysql.createConnection({ // createConnection 데이터베이스 설정 입력
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1105',
    database : 'univ'
});




module.exports = router;
