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
*later 엔드포인트/함수명 이런방식으로 작동되게 바꿀 예정

* initializeProblems(userId, problems, callback)
  * problems 숫자 배열이 요청본문에 들어가야 한다.
  * 기존에 있던 inactive group set을 초기화, 입력으로 들어온 problems를 initialization그룹에 넣어준다.
  * userid와 problems 필요

* updateProblems(userId, problems, callback)
  * 유저의 문제들을 업데이트 해주는 함수. problems에 들어간 문제는 solved: true를 표시해준다.
  * userid와 problems가 필요

* updateMessage(userId, message, callback)
  * 유저의 상태메시지를 업데이트 해주는 함수.
  * userid와 message가 반드시 필요

* updateOrganization(userId, organization, callback)
  * 유저의 조직정보를 업데이트 해주는 함수.
  * userid와 organization 반드시 필요

요구사항 있으면 바꿀 예정

> 차후 수정예정

## groupDB REST API 사용법

**endpoint**

https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB

**get**

* 기본적으로 'id&getGroup' 두가지의 값 혹은 'getAllGroup'을 쿼리에 같이 줘야한다.

* getUser
  * id(groupID)를 입력하여 GroupDB의 테이블에 속해 있는 데이터를 모두 불러온다.

* getAllUsers
  * DB의 모든 데이터들을 한번에 불러온다

**post**

* 요청 본문에 groupid, leader(그룹명), name(그룹이름), member(그룹멤버) 등의 데이터를 입력하면 DB에 테이블이 생성된다.


