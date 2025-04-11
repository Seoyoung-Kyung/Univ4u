var express = require('express');
var router = express.Router();
var mysql = require('mysql');  // db 폴더를 만들어서 conn 과 info 를 만들어 코드의 길이를 최대한줄일수도있다고한다
var crypto = require('crypto');
var cookies = require('cookie-parser');

var connection = mysql.createConnection({ // createConnection 데이터베이스 설정 입력
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1105',
    database : 'univ'
});

router.get('/', function(req,res){
    if (req.cookies.user){
      var sql = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
                from (select * from my_page) m
                join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
                columns (schlId  varchar(50) path '$')) j, univ_list u
                where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
          connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
          if(err) console.error("err : " + err);
          console.log(rows);
          res.render('main.ejs', {cookie : req.cookies.user, cookieNm : req.cookies.userNm, rows:rows});
      });
    }
    else{
      var sql = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
                from (select * from my_page) m
                join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
                columns (schlId  varchar(50) path '$')) j, univ_list u
                where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
          connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
          if(err) console.error("err : " + err);
          console.log(rows);
          res.render('main.ejs', {cookie: "false", rows:rows});
          console.log("false");
      });
    }
});

router.get('/compare', function(req, res, next) {
  var cookie = req.cookies.user;
  var cookieNm = req.cookies.userNm;
  var secondrows;
  var thirdrows;
  if (cookie === undefined) {
    cookie = "false"
  }
  console.log(cookie);
  var sql = `select distinct u.schlId, u.schlKrnNm, u.znNm, u.clgcpDivNm, u.estbDivNm, u.schlKndNm, j.schlId as mschlid
            from (select schlId from my_page where email= '`+ cookie + `') m
            join json_table(
              replace(json_array(m.schlId ), ',', '","'),
              '$[*]' columns (schlId  varchar(50) path '$')
            ) j
            right outer join univ_list u
            on j.schlId = u.schlId
            order by field(znNm,'서울', '경기', '인천','세종','강원','충남','충북','대전','경북','전북','광주','전남','대구','경남','울산','부산','제주');`;
    var sql2 = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
              from (select * from my_page) m
              join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
              columns (schlId  varchar(50) path '$')) j, univ_list u
              where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
        connection.query(sql2, function(err, rows2){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
        if(err) console.error("err : " + err);
        secondrows = rows2;
    });
    var sql3 = `select j.schlId as myfav
              from (select * from my_page where email= '`+ cookie + `') m
              join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
              columns (schlId  varchar(50) path '$')) j, univ_list u
              where trim(j.schlId) = u.schlId;`;
        connection.query(sql3, function(err, rows3){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
        if(err) console.error("err : " + err);
        thirdrows = rows3;
    });
      connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
      if(err) console.error("err : " + err);
      res.render('compare.ejs', {isSearch:false, rows:rows, locType:null, schName:null, cookie : cookie, cookieNm : cookieNm, secondrows:secondrows, thirdrows:thirdrows});
  });

});

router.get('/compare/:schName', function(req, res, next) {
  var schName = req.params.schName;
  var cookie = req.cookies.user;
  var secondrows;
  var thirdrows;
  var sql = "SELECT schlKrnNm,schlId, znNm, clgcpDivNm, schlKndNm FROM univ_list WHERE schlKrnNm LIKE '%"+ schName + "%' order by field(znNm,'서울', '경기', '인천','세종','강원','충남','충북','대전','경북','전북','광주','전남','대구','경남','울산','부산','제주')";
  var sql2 = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
            from (select * from my_page) m
            join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
            columns (schlId  varchar(50) path '$')) j, univ_list u
            where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
      connection.query(sql2, function(err, rows2){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
      if(err) console.error("err : " + err);
      console.log(rows2);
      secondrows=rows2;
  });
  var sql3 = `select j.schlId as myfav
            from (select * from my_page where email= '`+ cookie + `') m
            join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
            columns (schlId  varchar(50) path '$')) j, univ_list u
            where trim(j.schlId) = u.schlId;`;
      connection.query(sql3, function(err, rows3){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
      if(err) console.error("err : " + err);
      thirdrows = rows3;
  });
      connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
      if(err) console.error("err : " + err);
      res.render('compare.ejs', {isSearch:true, rows:rows, locType:null, schName:schName, cookie : req.cookies.user, cookieNm : req.cookies.userNm, secondrows:secondrows, thirdrows:thirdrows});
  });
});

router.get('/compare/loc/:locType', function(req, res, next) {
  var locType = req.params.locType;
  var cookie = req.cookies.user;
  var cookieNm = req.cookies.userNm;
  var secondrows;
  var thirdrows;
  if (cookie === undefined) {
    cookie = "false"
  }
  if(locType == "전체") {
    var sql = `select u.schlId, u.schlKrnNm, u.znNm, u.clgcpDivNm, u.estbDivNm, u.schlKndNm
              from univ_list u
              order by field(znNm,'서울', '경기', '인천','세종','강원','충남','충북','대전','경북','전북','광주','전남','대구','경남','울산','부산','제주');`;
  } else {
    var sql = `select u.schlId, u.schlKrnNm, u.znNm, u.clgcpDivNm, u.estbDivNm, u.schlKndNm, u.locType
              from univ_list u
              where u.locType = '`+ locType + `'
              order by field(u.znNm,'서울', '경기', '인천','세종','강원','충남','충북','대전','경북','전북','광주','전남','대구','경남','울산','부산','제주');`;
  }
  var sql2 = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
            from (select * from my_page) m
            join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
            columns (schlId  varchar(50) path '$')) j, univ_list u
            where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
      connection.query(sql2, function(err, rows2){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
      if(err) console.error("err : " + err);
      console.log(rows2);
      secondrows=rows2;
  });
  var sql3 = `select j.schlId as myfav
            from (select * from my_page where email= '`+ cookie + `') m
            join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
            columns (schlId  varchar(50) path '$')) j, univ_list u
            where trim(j.schlId) = u.schlId;`;
      connection.query(sql3, function(err, rows3){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
      if(err) console.error("err : " + err);
      thirdrows = rows3;
  });
      connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
      if(err) console.error("err : " + err);
      res.render('compare.ejs', {isSearch:false, rows:rows, locType:locType, schName:null, cookie : req.cookies.user, cookieNm : req.cookies.userNm, secondrows:secondrows, thirdrows:thirdrows});
  });
});

router.get('/popup/:svyYr', function(req, res, next) {
    var checkBoxArr = [];
    var svyYr = req.params.svyYr;
    var schlId = req.params.schlId;
    var cookie = req.cookies.user;
    console.log(svyYr);
    console.log(schlId);
    var sql = `select trim(j.schlId) schlId, u.schlKrnNm, u.znNm, u.clgcpDivNm, u.schlKndNm, avgt.avgTuit, round(avg(sr.studOrate),2) as studOrate, sr.svyYr, sgj.studFjobrat,`
              + ` sfr.studFrate, psr.fTimeAqRate_currentStud, round(avg(plr.fTimelecRatio),2) as fTimelecRatio, plr.semesterCode, bpp.acq_rate`
              + " from (select * from my_page) m"
              + " join json_table("
              + ` replace(json_array(m.schlId), ',', '","'),`
              + "'$[*]' columns (schlId varchar(50) path '$')"
              + ") j, univ_list u, avg_tuit avgt, stud_rep sr, stud_grad_job sgj, stud_fresh_rep sfr, prof_sc_rate psr, prof_lec_ratio plr, basic_prop_profit bpp"
              + " where trim(j.schlId) = u.schlId and m.email ='" + cookie + "'"
              + " and u.schlId = avgt.schlId and avgt.svyYr = " + svyYr
              + " and u.schlId = sr.schlId and sr.svyYr = " + svyYr
              + " and u.schlId = sgj.schlId and sgj.svyYr = " + svyYr
              + " and u.schlId = sfr.schlId and sfr.svyYr = " + svyYr
              + " and u.schlId = psr.schlId and psr.svyYr = " + svyYr
              + " and u.schlId = plr.schlId and plr.svyYr = " + svyYr
              + " and u.schlId = bpp.schlId and bpp.svyYr = " + svyYr
              + " group by j.schlId";
    console.log(sql);
    connection.query(sql, [schlId], function(err, rows){
        if(err) console.error("err : " + err);
        res.render('popup.ejs', {rows:rows, cookie : req.cookies.user, rows2:JSON.stringify(rows), svyYr:svyYr, schlId:schlId});
    });
});

router.get('/mypage', function(req, res, next) {
  var cookie = req.cookies.user;
  var secondrows;
  if (cookie === undefined) {
    cookie = "false"
  }
  var sql=`select distinct u.schlId, u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType from (select * from my_page) m join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]' columns (schlId  varchar(50) path '$')) j, univ_list u where trim(j.schlId) = u.schlId and email= '`+ cookie + `'` ;
  var sql2 = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
            from (select * from my_page) m
            join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
            columns (schlId  varchar(50) path '$')) j, univ_list u
            where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
      connection.query(sql2, function(err, rows2){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
      if(err) console.error("err : " + err);
      console.log(rows2);
      secondrows=rows2;
  });
  connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
    if(err) console.error("err : " + err);
    res.render('mypage.ejs', {rows:rows, cookie: cookie, cookieNm : req.cookies.userNm, secondrows:secondrows});
  });
});

//관심대학
router.post('/addUniv_process', function(req, res, next){
  var schlArr = req.body.schlId;
  var arr= req.body.arr;
  var cookie = req.cookies.user;
  console.log("선택대학 = " + schlArr);
  console.log("선택대학 = " + arr);

  var mp = `select  * from my_page where email ='` + cookie + `' `;

    if (schlArr != undefined) {
    connection.query(mp, async function(err, rows) {
        if(rows.length == 0) {
          var query = `insert into my_page (email, schlId) values ? `;
          var values = [
            [cookie, "," + schlArr.toString()]
          ];
        } else if(rows.length > 0 || schlArr != undefined){
            var query = `update my_page m set schlId = CONCAT (m.schlId,',', '` + schlArr.toString() + `') where email = '`+cookie+`' `;
        }
        connection.query(query, [values], async function(err, rows){
          if (err) throw err;
          else {
            console.log("성공" + query);
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.write("<script>alert('관심대학이 추가되었습니다.');location.href = document.referrer;</script>");
          }
        });
      });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
    res.write("<script>alert('대학을 선택해주세요.');location.href = document.referrer;</script>");
  }
});

router.post('/delUniv_process', function(req, res, next){
  var deletequery = {};
  var schlArr = req.body.schlId;
  var cookie = req.cookies.user;
  console.log(schlArr.length);
  if (schlArr.length != 7){
    for(var i=0; i<schlArr.length; i++) {
      console.log(i + schlArr[i]);
      deletequery[i] = `update my_page set schlId=replace(schlId, ',`+ schlArr[i] +`', '') where email= '`+cookie+`'`;
      connection.query(deletequery[i], function(err, rows) {
          if(err) throw err;
          else {
          console.log("성공");
        }
      });
    }
  } else if (schlArr.length == 7){
    deletequery[0] = `update my_page set schlId=replace(schlId, ',`+ schlArr +`','') where email= '`+cookie+`'`;
    connection.query(deletequery[0], function(err, rows) {
        if(err) throw err;
        else {
        console.log("성공 "+deletequery[0]);
      }
    });
  }
  res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
  res.write("<script>alert('선택한 관심 대학이 삭제되었습니다.');location.href = document.referrer;</script>");
});

router.get('/signup', function(req, res, next) {
  if (req.cookies.user){
    var sql = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
              from (select * from my_page) m
              join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
              columns (schlId  varchar(50) path '$')) j, univ_list u
              where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
        connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
        if(err) console.error("err : " + err);
        console.log(rows);
        res.render('signup.ejs', {cookie : req.cookies.user, cookieNm : req.cookies.userNm, rows:rows});
    });

  }
  else{
    var sql = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
              from (select * from my_page) m
              join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
              columns (schlId  varchar(50) path '$')) j, univ_list u
              where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
        connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
        if(err) console.error("err : " + err);
        console.log(rows);
          res.render('signup.ejs', {cookie: "false", rows:rows});
    });
  }
});

router.get('/login', function (req, res) {
  if (req.cookies.user){
    var sql = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
              from (select * from my_page) m
              join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
              columns (schlId  varchar(50) path '$')) j, univ_list u
              where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
        connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
        if(err) console.error("err : " + err);
        console.log(rows);
        res.render('login.ejs', {cookie : req.cookies.user, cookieNm : req.cookies.userNm, rows:rows});
    });

  }
  else{
    var sql = `select u.schlId, count(u.schlKrnNm) as count,u.schlKrnNm, u.clgcpDivNm, u.estbDivNm, u.schlDivNm, u.schlKndNm, u.znNm, u.locType, m.email
              from (select * from my_page) m
              join json_table(replace(json_array(m.schlId ), ',', '","'),'$[*]'
              columns (schlId  varchar(50) path '$')) j, univ_list u
              where trim(j.schlId) = u.schlId group by u.schlKrnNm order by count desc limit 5 ;`;
        connection.query(sql, function(err, rows){  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
        if(err) console.error("err : " + err);
        console.log(rows);
          res.render('login.ejs', {cookie: "false", rows:rows});
    });
  }
});

router.post('/signup', function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.pw;

  console.log(name);
  console.log(password);

  const salt = crypto.randomBytes(128).toString('base64');
  const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');
  var query = "select email from user where email ='" + email + "'"; // 중복 처리하기 위한 쿼리
  connection.query(query, async function(err, rows) {

    if(rows.length == 0) { // sql 제대로 연결되고 중복이 없는 경우
      var sql = {
        email: email,
        name: name,
        password: hashPassword,
        salt: salt
      };
      // create query
      var query = connection.query('insert into user set ?', sql, function (err, rows) {
        if (err) throw err;
        else {
          console.log("성공");
          res.send({msg:"성공"});
        }
      });
    } else {
      console.log("중복Email");
      // 이미 있음
      res.send({msg:"중복Email"});
    }
  })
});

router.post('/login', function (req, res, next) {
  var email = req.body.email;
  var pw = req.body.pw;

  var query = "select salt, password, name from user where email='" + email + "'";
  console.log(query);

  connection.query(query, async function (err, rows) {
    if(err) throw err;
    else {
      if (rows.length == 0) {
        console.log("이메일 틀림");
        res.send({msg:"없는 이메일"});
      }
      else {
        var salt = rows[0].salt;
        var password = rows[0].password;
        var name = rows[0].name;
        var urlencode = require('urlencode');

        const hashPassword = crypto.createHash('sha512').update(pw + salt).digest('hex');
        if (password === hashPassword) {
          // 로그인 성공
          console.log("로그인 성공");
          console.log(email);
          res.cookie("user", email, {
            expires: new Date(Date.now() + 90000000),
            httpOnly: true
          });
          res.cookie("userNm", name, {
            expires: new Date(Date.now() + 90000000),
            httpOnly: true
          });
          res.send({msg:"로그인 성공", userName: name});
        }
        else { // 로그인 실패(아이디는 존재하지만 비밀번호가 다름)
          console.log("로그인 실패 비밀번호 틀림");
          res.send({msg:"로그인 실패"});
        }
      }
    }
  })
});

router.get('/logout', function(req, res) {
  res.clearCookie("user");
  res.clearCookie("userNm");
  res.redirect("/univ");
});

module.exports = router;
