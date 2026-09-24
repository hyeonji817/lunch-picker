# Lunch Picker

React + TypeScript + Vite 점심 메뉴 추천 앱. 네이버 지역 검색으로 음식점 목록을 표시합니다.

## 실행

Node.js 22.12 이상을 사용하세요. 의존성이 없다면 npm install을 실행합니다.

1. 네이버 클라우드 콘솔의 NAVER API HUB에서 Application을 등록하고 NAVER 검색 > 지역을 선택합니다. 인증 정보에서 Client ID와 Client Secret을 확인합니다.
2. 루트 .env의 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET에 발급받은 값을 입력합니다.
3. 터미널 하나에서 npm run dev:api, 다른 터미널에서 npm run dev를 실행합니다.
4. Vite가 안내하는 주소에서 지역(강남역)과 메뉴(돈까스)를 입력하고 검색합니다.

.env 변경 후 API 서버를 재시작하세요. 인증 정보는 서버에서만 사용합니다.
VITE_ 접두사로 인증 정보를 정의하거나 소스/Git에 넣지 마세요.
.env는 Git에서 제외되며 .env.example만 공유합니다.

## 구성

- src/components/RestaurantSearch.tsx: 검색 폼, 로딩/오류/빈 결과, 목록과 지도 검색 링크
- src/components/RestaurantSearch.css: 반응형 검색 영역 스타일
- server/index.mjs: GET /api/restaurants?area=강남역&menu=돈까스
- server/search.mjs: 입력 검사, 네이버 호출, 8초 타임아웃, 응답 변환
- vite.config.ts: 개발 중 /api를 127.0.0.1:3001로 프록시

네이버 지도 링크는 업체 상세 페이지가 아닌 주소와 업체명으로 검색하는 링크입니다.

## API 제약

공식 문서: https://api.ncloud-docs.com/docs/naver-api-hub-search-local

- 검색당 최대 5개, start=1만 지원하여 다음 페이지/무한 스크롤은 지원하지 않습니다.
- sort=random은 정확도순입니다.
- 좌표/반경 검색 대신 지역명을 검색어에 포함합니다.
- 전화번호, 별점, 사진, 가격은 표시하지 않습니다.
- 지도 웹 화면 전체 검색 결과와 동일한 목록을 보장하지 않습니다.
- API HUB 검색의 월 최대 호출량은 775,000건입니다. 콘솔에 설정된 일별/월별 한도도 확인하세요. 현재 한시적 무료이며 한도 도달 시 호출이 차단됩니다.
- 입력할 때마다 호출하지 않고 제출 시에만 호출합니다.
- 401/403이면 인증 정보와 검색 API 선택 여부, 429이면 호출량을 확인하세요.

## 검증

npm run test:api
npm run build

API 테스트는 모의 응답을 사용하며 실제 네이버 인증/검색 성공을 대신하지 않습니다.

## 배포

dist만 올려서는 검색할 수 없습니다. Node 서버와 프런트엔드 모두 배포해야 합니다.
운영 리버스 프록시에서 /api를 Node 서버로 전달하세요. Vite server.proxy는 개발 전용입니다.
플랫폼에서 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, PORT를 서버 환경변수로 설정하세요.
운영 실행 명령은 node server/index.mjs입니다.
HOST 기본값은 127.0.0.1이며 컨테이너에서 필요한 경우 HOST=0.0.0.0으로 설정합니다.
PORT를 3001에서 바꾸면 개발용 Vite 프록시 대상 포트도 맞춰야 합니다.
공개 배포 전 호스팅/게이트웨이에서 요청 빈도와 동시 호출 제한을 설정하세요.
현재 구현은 로컬 개발용이며 공개 서비스의 호출량 제한은 포함하지 않습니다.

API HUB 요청 주소: https://naverapihub.apigw.ntruss.com/search/v1/local
인증 헤더: X-NCP-APIGW-API-KEY-ID, X-NCP-APIGW-API-KEY. 환경변수 이름은 기존 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 유지합니다.

