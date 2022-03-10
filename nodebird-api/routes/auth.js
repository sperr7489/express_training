const express=require('express');
const passport = require("passport");
const bcrypt = require('bcrypt');
const {isLoggedIn,isNotLoggedIn}= require('./middlewares');
const User = require('../models/user');

const router =express.Router();


//post 형식으로 form 데이터를 받는것은 req.body객체에 저장된다. 그래서 다음과 같이 email,nick,password를 가지고 올 수 있는 것이다. 
//join으로 post하는데 만약 로그인 되어있지 않으면 다음 미들웨어를 실행한다. 
//그 미들웨어는 로그인 정보의 email, nick,password를 가져오고 이를 있는지 확인한다. 
//만약 기존 디비에 해당 email이 있다면 이미 존재하는 계정이므로 join할 수 없음을 보여주어야만 한다. !

router.post('/join',isNotLoggedIn,async(req,res,next)=>{
    const {email,nick,password} =req.body;
    try{
        const exUser= await User.findOne({where:{email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password,12);
        await User.create({
            email,
            nick,
            password:hash,
        });
        return res.redirect('/');
        /**
         * 만약 exUser가 null로 반환되었따면 해당 계정은 없다는 뜻이기 때문에 지금과 같이
         * User를 생성해주는 로직이다. 
         */

} catch(error){
    console.log(error);
    return next(error);
}
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?loginError=${info.message}`);
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect('/');
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  });
router.get('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao',{
    failureRedirect:'/',
}),(req,res)=>{
    res.redirect('/');
})

module.exports=router;