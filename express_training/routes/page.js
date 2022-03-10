const express = require("express");

const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User, Hashtag } = require("../models");

/*라우터는 같은 주소에 대해서 여러가지 라우터를 만들 수 있다. 
동일한 주소의 라우터의 경우에는 다음의 라우터를 처리하기 위해서 
next()함수를 사용해야만 다음 라우터를 실행시킬 수 있다. 
이를 사용하지 않으면 다음 라우터로 넘어가지 않게 된다. 
*/
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user
    ? req.user.Followings.map((f) => f.id)
    : [];
    console.log(res.locals);
  next();
});

router.get("/hashtag", async(req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    //hashtag가 없다면?
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({
        include: [{ model: User }],
      });
    }
    return res.render("main", {
      title: `${query}| nodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: `내 정보 - Nodebird` });
});
router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", { title: `회원 가입 - Nodebird` });
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "NodeBird",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
