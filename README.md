# sanhak-server
백엔드 서버 저장소


## userDB REST API 사용법
**endpoint**
https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resourceCancel changes


**GET**

* 기본적으로 userid와 funcname 두가지의 값을 쿼리 문자열에 같이 줘야한다.

* 아래는 funcname에 들어갈 함수 이름들이다.

* getUser
  * userId에 해당하는 유저의 데이터를 비밀번호를 제외하고 가져온다.
  * 그룹셋 정보들은 배열형태로 반환해준다.
  > ex) https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource?userid=testid&funcname=getUser

* getAllUsers
  * 모든 user의 데이터를 가져온다
  * userid에 쓰레기 값이라도 넣어야 한다.

* getSolved
  * userid의 solved_problems를 반환한다.
 
* getTodayProblems
  * userid의 today_problems를 반환한다.


**POST**

* 요청 본문에 userid, userpw, useremail, bojname이 들어가야 한다.

* 선택사항) organization 조직정보

* 값이 비어있거나 빈 문자열이면 오류 메시지를 반환한다.



**DELETE**

* 요청 본문에 userid, userpw가 들어가야한다.

* 해당id가 없거나 비밀번호가 틀리면 오류 메시지를 반환한다.



**PUT**



**PATCH**

* 기본적으로 funcname이 요청본문에 들어가야 한다. 아래는 함수명과 필요한 파라미터 이름들이다.

* 나중에 엔드포인트/함수명 이런방식으로 작동되게 바꿀 예정


> body에 들어갈 내용 예시

![image](https://user-images.githubusercontent.com/26537075/114869317-cb84db80-9e31-11eb-865e-57c178356213.png)


* updateProblems
  * 유저의 문제들을 업데이트 해주는 함수. active group에서 solved: true를 표시해준다.
  * userid가 필요

* updateMessage
  * 유저의 상태메시지를 업데이트 해주는 함수.
  * userid와 message가 반드시 필요

* updateOrganization
  * 유저의 조직정보를 업데이트 해주는 함수.
  * userid와 organization 반드시 필요

* updateHomepage
  * 유저의 홈페이지 정보 업데이트
  * userid와 homepage 반드시 필요

* updateTodayProblems
  * 유저의 오늘푼 문제 업데이트
  * userid와 todayproblems 반드시 필요

* addProblems
  * solved_problems에 문제들을 추가해주는 함수.
  * 입력받는 problems는 항상 내부의 데이터셋과 중복되지 않음이 보장되야한다.
  * userid, problems 반드시 필요

* addGroup
  * 유저의 active group set에 그룹 추가
  * inactive group set에 동일 그룹이 있으면 복원, 그렇지 않으면 새로 생성
  * userid, groupname, groupid 반드시 필요 ismaster 선택 (default: false)

* addGroupProblems
  * groupid에 해당하는 그룹에 문제 추가 (default: (solved: false))
  * userid, groupid, problems 반드시 필요

* deleteGroup
  * 그룹을 활성 그룹 목록에서 제거, 비활성 그룹 목록에 삽입
  * userid, groupid 반드시 필요

* deleteGroupProblems(userId, groupName, problems, callback)
  * 그룹에서 problems에 해당하는 문제 제거
  * userid, groupid, problems 반드시 

> 차후 수정예정



## groupDB 구조

**전체 구조**

![db](https://user-images.githubusercontent.com/64597426/115429463-63256800-a23e-11eb-9143-5d38f3e05977.jpg)


**rank_member**

![rank_member](https://user-images.githubusercontent.com/64597426/115429531-75070b00-a23e-11eb-8076-71ed2f05cead.jpg)


**group_attendance**

![group_attendance](https://user-images.githubusercontent.com/64597426/115429562-7b958280-a23e-11eb-93d2-ad0346ee3dfa.jpg)



**group_goal**

![group_goal](https://user-images.githubusercontent.com/64597426/115429607-85b78100-a23e-11eb-9e32-404531d6680a.jpg)





## groupDB REST API 사용법

**endpoint**

https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB

**get**

* 기본적으로 'id('id=')&getGroup' 두가지의 값 혹은 'getAllGroup'을 쿼리에 같이 줘야한다.

* getUser
  * id(groupID)를 입력하여 GroupDB(func)의 테이블에 속해 있는 데이터를 모두 불러온다.
  * 'id=(group_id 입력)&func=getGroup'을 쿼리문자열에 입력한다.

* getAllUsers
  * DB의 모든 데이터들을 한번에 불러온다
  * 'func=getAllGroup'을 쿼리문자열에 입력한다.


**post**

* 요청 본문에 id(그룹id), leader(그룹명), name(그룹이름), member(그룹멤버) 등의 데이터를 입력하면 DB에 테이블이 생성된다.

**delete**

* 요청 본문에 id(그룹id) 입력 시 DB에서 해당 테이블 삭제

**patch**

* func, id의 값이 무조건 들어가야하며, 업데이트를 원하는 요소에 따라 각 수정값을 입력한다.

* addMember
  * 그룹원 추가 함수
  * func와 id를 입력하고, 추가를 원하는 그룹원을 배열의 형식으로 추가한다.
  * ex) 
  
 
* updateCycle
  * 출석체크 주기를 업데이트하는 함수
  * func와 id를 입력하고, 변경을 원하는 cycle을 문자열의 형식으로 입력한다
  * ex) 


* updateProblemNumber
  * 출석 확인 문제 갯수를 변경하는 함수
  * func와 id를 입력하고, 변경을 원하는 출석 문제를 숫자 형식으로 입력한다
  * ex) 


* updateNumberMember
  * 그룹원의 인원을 변경하는 함수
  * func와 id를 입력하고, 변경을 원하는 그룹원 수를 숫자 형식으로 입력한다
  * ex) 


* updateAttendance
  * 출석여부를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 그룹원의 이름과 출석여부를 문자열 형식으로 입력한다
  * ex) 
  

* updateProblems
  * 출석확인 문제를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 출석문제를 배열 형식으로 입력한다
  * ex) 


* updateGroupGoal
  * 그룹 생성의 목적을 변경하는 함수
  * func와 id를 입력하고, 변경을 원하는 목표를 문자열 형식으로 입력한다
  * ex)  


* updateGroupNotice
  * 그룹 공지를 변경하는 함수
  * func와 id를 입력하고, 변경을 원하는 공지를 문자열 형식으로 입력한다
  * ex) 


* updateProblemLevel
  * 출석확인 문제의 난이도를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 문제의 난이도를 배열 형식으로 입력한다
  * ex) 


* updateGroupRank
  * 그룹의 랭크를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 그룹의 랭크를 숫자 형식으로 입력한다
  * ex) 


* updatePersonalRank
  * 멤버의 그룹 내 랭크를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 멤버의 이름과 그룹 내의 랭크를 각각 문자열과 숫자 형식으로 입력한다
  * ex) 


* updatePersonalScore
  * 랭크 판별을 위한 멤버 개인의 점수를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 멤버의 이름과 점수를 각각 문자열과 숫자 형식으로 입력한다
  * ex) 


* updateGroupRank
  * 
  * func와 id를 입력하고, 변경을 원하는  형식으로 입력한다
  * ex) 


* updateGroupRank
  * 
  * func와 id를 입력하고, 변경을 원하는  형식으로 입력한다
  * ex) 


## 그룹 기능 관련 REST API 사용법

**endpoint**

1. https://vo2gl8s0za.execute-api.us-east-2.amazonaws.com/backend_api/user

2. https://4f5hmhskte.execute-api.us-east-2.amazonaws.com/return_diff/

**1. 백준에서 지금까지 해결한 모든 문제 반환**

* 메소드 : POST
* 요청 본문 : { "id" : "kimtaehyun98" }
* 응답 : "body": [
        "1000",
        "1001",
        "1002",
        "1003",
        "1005",
        "1008",
        "1009",
        "1010", ... ]


**2. Solved-ac에서 지금까지 해결한 모든 문제의 난이도를 반환**

* 메소드 : POST
* 요청 본문 : { "id" : "kimtaehyun98 }
* 응답 : 
  "body": {
        "Bronze": "165",
        "Silver": "256",
        "Gold": "117",
        "Platinum": "18",
        "Diamond": "0",
        "Ruby": "0"
    }


