var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.get('/', function(req,res,next){

    var connection = mysql.createConnection({ // createConnection 데이터베이스 설정 입력
        host : 'localhost',
        port : 3306,
        user : 'root',
        password : '1105',
        database : 'univ'
    });

    connection.connect(function(err) { // connect 함수로 접속과 동시에 연결설정에 대한 확인
        if(err) {
            res.render('mysql', {connect : '연결실패', err:err});
            console.error(err);
            throw err;
        } else {
            res.render('mysql', {connect : '연결성공', err : '없음'})
        }
    });
    connection.end();
});

module.exports = router;
