const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require("passport");



dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");


const app= express();

const {sequelize} =require('./models');//sequelize orm을 통해서 database를 연동시킨다. 
const passportConfig = require("./passport");

passportConfig();


app.set('port', process.env.PORT || 8001);
app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
    watch:true,
});

sequelize.sync({force:false}).then(()=>{
    console.log("데이터베이스 연결 성공");
}).catch((err)=>{
    console.log(err);
})

//MORGAN
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));//static 미들웨어를 통해 정적 파일 변환
app.use('/img',express.static(path.join(__dirname,'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //body-parser사용부분. req.body객체에 넣어줌. express객체에 어느정도 내장되어있다. 

app.use(cookieParser(process.env.COOKIE_SECRET)); //req.cookies에 저장함. 
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },//session부분 설정하는 부분. cookie-parser dependency
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/',pageRouter)//app.use 라우터를 만들어두었고 pageRouter폴더에 저장해둔것을 가져다 씀. 
app.use('/auth',authRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);


app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status =404;
    next(error);
});//첫번째 인수가 없기때문에 모든 주소에 대해서 이 미들웨어를 실행한다. error가 발생하면 error처리 라우터로 이동하게 됨. 
app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE.ENV !== 'production'? err:{};
    res.status(err.status||500);
    res.render('error');

})
app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중 . ');

})

