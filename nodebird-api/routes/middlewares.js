const jwt = require("jsonwebtoken");
const RateLimit = require('express-rate-limit');

exports.apiLimiter = RateLimit({
    windowMs : 60 * 1000,//기준 시간
    max:5, //허용회수
    handler(req,res){
        //제한 초과시 콜백 함수.
        res.status(this.statusCode).json({
            code: this.statusCode,
            message:'1분에 한 번만 요청할 수 있습니다. '
        });
    }
})//1분에 한번만 요청이 가능하도록 설정한 api-limiter

exports.deprecated= (req,res)=>{
    res.status(410).json({
        code:410,
        message:`새로운 버전이 나왔습니다. 더이상 ${req.baseUrl}을 사용하지 마세요`,
    })
    console.log("req를 확인하기 위해서 : ",req.baseUrl);
}

exports.isLoggedIn =(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
};
exports.isNotLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        next();
    }else{
        const message = encodeURIComponent('로그인한 상태입니다. ')
        res.redirect(`/?error=${message}`);
    }
}

exports.verifyToken= (req,res,next)=>{
    try{
        //req객체에 decoded 파라미터를 설정하여 라우터에서 이 객체를 사용할 수 있도록 한다. 
        req.decoded = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
        return next();
    
    }catch(err){
        if(err.name === "TokenExpiredError"){
            //유효기간 초과.
            return res.status(419).json({
                code:419,
                message:"토큰이 만료되었습니다.",

            });
        }
        return res.status(401).json({
            code:401,
            message:"유효하지 않은 토큰입니다.",

        });
    }
}