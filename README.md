# GTOne-dummy-api-proxy
Proxy를 이용해 Dummy API 사용을 도와줍니다.

## 환경

- NodeJs 16.0>=
- Npm 8.0>=

## 설치 및 실행

```bash
$ git glone https://github.com/gJhlee/GTOne-dummy-api-proxy
$ cd GTOne-dummy-api-proxy
$ npm i
$ npm start
```


## 환경 설정

### 서버 설정 

`config.json` 파일을 수정합니다.

- `ORIGIN_HOST` : 더미 API를 제외한 나머지 접근을 포워딩할 주소 (포트 포함)
- `DuMMY_PORT`  : 더미 API 서버 포트

```
{
    "ORIGIN_HOST": "http://localhost:8080",
    "DUMMY_PORT": 8888
}
```

### API 설정

`/base` 디렉토리에 `path.to.src.json` 형태로 더미 API `json` 파일을 생성합니다.

`path.to.src.json`는 `/path/to/src` 경로로 치환됩니다.

Method는 GET/POST 등 모든 방식을 허용합니다.


#### 예시)

아래와 같이 구성했을 경우 `/rest/auth/login` 과 `/rest/auth/user` 경로에 대해서만 더미 `json` 파일을 을 보냅니다.
```
/base
    - rest.auth.login.json
    - rest.auth.user.json
config.js
index.js
...
```

사용자의 **회원가입 -> 로그인 -> 유저정보 -> 로그아웃** 을 한다면, 회원가입과 로그아웃은 기존의 서버로 포워딩 되며, 로그인과 유저정보는 더미를 응답합니다.

아래와 같이 접속 로그로 확인할 수 있습니다.

```
> npm start
[nodemon] starting `node index.js`
+----------------------------------------+
| Loaded dummy API                       |
|----------------------------------------|
| /rest/auth/login                       |
| /rest/auth/user                        |
+----------------------------------------+

 * Dummy API Server started.
 * DummyUrl : http://localhost:8888
 * OriginUrl: http://localhost:8080

ORIGIN] /rest/auth/sign
DUMMY ] /rest/auth/login
DUMMY ] /rest/auth/user
ORIGIN] /rest/auth/logout
```
