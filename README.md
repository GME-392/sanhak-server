# sanhak-server
백엔드 서버 저장소


## userDB REST API 사용법
**endpoint**
https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource

header에 "myauth": "allow" 값을 넣어야 endpoint사용가능
> 4월27일 이후 get부터 적용예정


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


**POST**

* 요청 본문에 userid, userpw, useremail, bojname이 들어가야 한다.

* 선택사항) organization 조직정보

* 값이 비어있거나 빈 문자열이면 오류 메시지를 반환한다.



**DELETE**

* 요청 본문에 userid, userpw가 들어가야한다.

* 해당id가 없거나 비밀번호가 틀리면 오류 메시지를 반환한다.

* INACTIVE_USER 데이터베이스로 해당 유저데이터가 옮겨진다.



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

* updateGroupRank(userId, groupId, rank, callback)
  * 유저의 그룹안 랭크 업데이트
  * userid와 groupId반드시 

* updateSolved
  * solved_problems의 문제를 대체하는 함수
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
  ![image](https://user-images.githubusercontent.com/64597426/115735897-cbeb1c80-a3c5-11eb-81dd-b278db43c497.png)

 
* updateCycle
  * 출석체크 주기를 업데이트하는 함수
  * func와 id를 입력하고, 변경을 원하는 cycle을 문자열의 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115736122-005ed880-a3c6-11eb-9957-5f2db131f56a.png)


* updateProblemNumber
  * 출석 확인 문제 갯수를 변경하는 함수
  * func와 id를 입력하고, 변경을 원하는 출석 문제를 숫자 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115738224-d3abc080-a3c7-11eb-8153-745d781733dd.png)


* updateNumberMember
  * 그룹원의 인원을 변경하는 함수
  * func와 id를 입력하고, 변경을 원하는 그룹원 수를 숫자 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115739107-98f65800-a3c8-11eb-92ec-c8160af05849.png)


* updateAttendance
  * 출석여부를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 그룹원의 이름과 출석여부를 문자열 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115739626-0b673800-a3c9-11eb-92f1-95d159cfeef8.png)


* updateAttendanceProblems
  * 출석확인 문제를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 출석문제를 배열 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/116369603-8656a580-a844-11eb-8b7e-7ba6f27f7a35.png)


* updateGroupGoal
  * 그룹 생성의 목적을 변경하는 함수
  * func와 id를 입력하고, 변경을 원하는 목표를 문자열 형식으로 입력한다
  * ex)  
 ![image](https://user-images.githubusercontent.com/64597426/115740044-69941b00-a3c9-11eb-938d-b981f6c47beb.png)


* updateGroupNotice
  * 그룹 공지를 변경하는 함수
  * func와 id를 입력하고, 변경을 원하는 공지를 문자열 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115740205-8f212480-a3c9-11eb-9592-e9bbc198756c.png)


* updateProblemLevel
  * 출석확인 문제의 난이도를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 문제의 난이도를 배열 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115742937-1ec7d280-a3cc-11eb-9bc6-2e5312f4d57d.png)


* updateGroupRank
  * 그룹의 랭크를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 그룹의 랭크를 숫자 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115746419-4b311e00-a3cf-11eb-8a6a-babc6d28ec02.png)


* updatePersonalRank
  * 멤버의 그룹 내 랭크를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 멤버의 이름과 그룹 내의 랭크를 각각 문자열과 숫자 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115746878-ae22b500-a3cf-11eb-9d24-3fa160ebbbff.png)


* updatePersonalScore
  * 랭크 판별을 위한 멤버 개인의 점수를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 멤버의 이름과 점수를 각각 문자열과 숫자 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115747230-ff32a900-a3cf-11eb-86e1-5c50e9eb7535.png)


* updateProblems
  * 출석 문제를 업데이트 하는 함수
  * func와 id를 입력하고, 변경을 원하는 출석문제를 배열 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115739883-45383e80-a3c9-11eb-8c43-de545e5eed7e.png)


* addRankMember
  * 새 그룹원의 랭크 판별을 위한 정보를 업데이트 하는 함수
  * func와 id를 입력하고, 추가를 원하는 멤버의 이름과 정보들을 맵 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115969549-64290300-a578-11eb-9de0-ce6ad67800d1.png)


* deleteRankMember
  * 탈퇴 그룹원의 정보를 삭제하는 함수
  * func와 id를 입력하고, 삭제를 원하는 멤버의 이름을 문자열 형식으로 입력한다
  * ex) 
 ![image](https://user-images.githubusercontent.com/64597426/115969586-920e4780-a578-11eb-951b-2d6e2b925f66.png)




## 그룹 기능 관련 REST API 사용법



**1. 백준에서 지금까지 해결한 모든 문제를 반환하는 API**

* endpoint : https://vo2gl8s0za.execute-api.us-east-2.amazonaws.com/backend_api/user
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






**2. Solved-ac에서 지금까지 해결한 모든 문제의 난이도를 반환하는 API**

* endpoint : https://4f5hmhskte.execute-api.us-east-2.amazonaws.com/return_diff/
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






**3. 그룹 내 모든 인원들에 대한 출석 체크를 진행 후 DB 갱신하는 API(출석 기능 API)**

* endpoint : https://9zl6kjhghe.execute-api.us-east-2.amazonaws.com/backend_api/return-attendance
* 메소드 : POST
* 요청 본문 : { "id" : "1" }    (group_id를 문자열 형태로)
* 응답 : null


*API 진행 흐름*
* 1. Front에서 그룹 ID를 받아옴
* 2. Group DB로부터 출석 문제(attend_probs), 그룹에 속한 멤버들의 정보를 받아옴(members_id)
* 3. loop를 돌며 그룹 내 각 인원들이 지금까지 해결한 문제(solved_probs)를 받아와 출석 문제와 비교, 출석 체크 진행, DB 갱신


**기존 DB 예시**
![image](https://user-images.githubusercontent.com/65909160/115951003-6c9e2100-a519-11eb-9fff-995f3769793d.png)

**API 실행 후 DB 예시**
![image](https://user-images.githubusercontent.com/65909160/115951007-76278900-a519-11eb-84b3-7d87bff1ca5e.png)



**4. 그룹 내 모든 인원들에 대하여 해당 인원들이 출석 문제 중 어떤 문제를 풀었는지 반환하는 API**

* endpoint : https://hhya7n2t06.execute-api.us-east-2.amazonaws.com/backend_api/return-solved-attend-probs
* 메소드 : POST
* 요청 본문 : { "id" : "1" }    (group_id를 문자열 형태로)
* 응답 : 
{
    "statusCode": 200,
    "body": {
        "c17an": [ "1000", "1001", "1003"],
        "suhwanc": ["1000", "1001", "1002", "1003"],
        "kimtaehyun98": ["1000", "1001", "1002", "1003"]
    }
}


**5. 그룹 내 모든 인원들에 대하여 랭킹 점수를 정렬된 형태로 반환하는 API**

* endpoint : https://ycwvl0727g.execute-api.us-east-2.amazonaws.com/backend_api/return-rank
* 메소드 : POST
* 요청 본문 : { "id" : "1" }  (group_id를 문자열 형태로)
* 응답 : ![image](https://user-images.githubusercontent.com/65909160/116351368-8350ba80-a82e-11eb-9514-29a4245ecca6.png)
* 설명 : 그룹 내 모든 인원 정보 받아오기 -> 각 인원별 랭킹 점수 계산 -> 정렬 -> 랭킹 점수를 group_DB에 갱신 -> 랭킹 점수 반환

