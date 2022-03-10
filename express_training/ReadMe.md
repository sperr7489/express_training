express training section

# dependency 특징 정리
---
## morgan 
---
로그들을 보는 방식을 설정하는 것. 

## body-parser
--- 
요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어. 보통 폼 데이터나 Ajax 요청의 데이터를 처리한다. 

## coookie-parser
---
요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만들어준다

## express=session
---
로그인 등의 이유로 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장. 
세션은 사용자별로 req.session 객체 안에 유지됨. 

## multer
---
이미지, 동영상 등을 비롯한 여러 가지 파일들을 멀티 파트 형식으로 업로드할 때 사용.