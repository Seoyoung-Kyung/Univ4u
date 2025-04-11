var express = require('express');
var ejs = require('ejs');
var mysqlRouter = require('./routes/mysql');
var univRouter = require('./routes/univ');
var fs = require('fs');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs'); // 뷰엔진으로 npm 설치한 ejs 사용
app.set('views', './views/') // view 파일들은 .view 에 잇다
app.use(bodyParser.urlencoded({extended: true})); // post 할때 자꾸 cannot property  에러나서 찾아보니 router 경로 지정 전에 bodyparser 미들웨어 설정해야함
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
app.use(cookieParser());

app.use('/mysql', mysqlRouter);
app.use('/univ', univRouter);  //항상 추가해주자 라우터를 만들면 app.js 메인파일에 추가 항상!

app.post("/compare/postTest", function(req, res){   // postTest라는 주소로 POST요청이 들어오면 실행
    console.log(req.body);      // body에 있는 정보를 콘솔창에 출력.
    res.json({ok:true});        // 클라이언트에 성공했다고 신호를 보냄.
});

app.listen(3000);
