const jwt = require("jsonwebtoken");


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