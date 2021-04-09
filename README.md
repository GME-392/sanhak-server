# sanhak-server
백엔드 서버 저장소


## userDB REST API 사용법
**endpoint**
https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource

**get**

* 기본적으로 userid와 funcname 두가지의 값을 쿼리 문자열에 같이 줘야한다.

* 아래는 funcname에 들어갈 함수 이름들이다.

* getUser
  * userId에 해당하는 유저의 데이터를 비밀번호를 제외하고 가져온다.
  > ex) https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource?userid=testid&funcname=getUser

* getAllUsers
  * 모든 user의 데이터를 가져온다
  * userid에 쓰레기 값이라도 넣어야 한다.
 

**post**

* 요청 본문에 userid, userpw, useremail, bojname이 들어가야 한다.

* 값이 비어있거나 빈 문자열이면 오류 메시지를 반환한다.


**delete**

* 요청 본문에 userid, userpw가 들어가야한다.

* 해당id가 없거나 비밀번호가 틀리면 오류 메시지를 반환한다.


**put**


**patch**

* 기본적으로 funcname이 요청본문에 들어가야 한다.

* initializeProblems
  * problems 숫자 배열이 요청본문에 들어가야 한다.
  * 기존에 있던 inactive group set을 초기화, 입력으로 들어온 problems를 넣어준다.
  * 이후 수정은 updateProblems로 할 예정 > 아직 구현 안됨  * 이후 수정은 updateProblems로 할 예정 > 아직 구현 안됨

요구사항 있으면 바꿀 예정

> 차후 수정예정

