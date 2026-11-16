# My Refrigerator

냉장고에 보관 중인 식재료와 유통기한을 한눈에 관리하는 웹 앱입니다.

## 주요 기능

- 식재료 등록, 수정, 삭제
- 식재료 이름 검색 및 보관 위치·카테고리별 필터링
- 유통기한 임박순, 최근 등록순, 이름순 정렬
- 유통기한이 3일 이내인 식재료와 유통기한이 지난 식재료 집계
- 같은 이름과 보관 위치의 중복 등록 방지
- 브라우저 `localStorage`에 데이터 저장
- 저장 결과와 입력 오류를 토스트 메시지로 안내

## 실행 방법

이 프로젝트는 JavaScript 모듈을 사용하므로 HTML 파일을 직접 여는 대신 로컬 웹 서버에서 실행해 주세요.

### VS Code Live Server

1. VS Code에서 프로젝트 폴더를 엽니다.
2. Live Server로 `index.html`을 실행합니다.

### Python

프로젝트 폴더에서 다음 명령을 실행한 뒤 `http://localhost:8000`에 접속합니다.

```bash
python3 -m http.server 8000
```

별도 패키지 설치는 필요하지 않습니다.

## 기술 스택

- HTML
- CSS
- JavaScript (ES Modules)
- Pretendard
- Lucide Icons

## 프로젝트 구조

```text
.
├── assets/
│   ├── fonts/       # Pretendard 글꼴
│   └── vendor/      # Lucide 아이콘 라이브러리
├── css/             # 리셋, 공통, 화면 스타일
├── js/
│   ├── components/  # 식재료 카드, 모달, 토스트
│   ├── data/        # localStorage 데이터 처리
│   ├── events/      # 식재료, 필터, 메뉴 이벤트
│   ├── utils/       # 날짜, 검색·필터, 입력값 검증
│   ├── pages/       # 화면 데이터와 렌더링
│   └── main.js      # 앱 초기화와 모듈 연결
└── index.html
```

## 데이터 저장

식재료 정보는 현재 브라우저의 `localStorage`에 저장됩니다. 브라우저 저장 데이터를 지우면 등록한 식재료도 삭제됩니다.

## 라이선스

Lucide는 ISC 라이선스를 따르며 라이선스 전문은 `assets/vendor/LUCIDE-LICENSE`에 있습니다. Pretendard 라이선스 전문은 `assets/fonts/PRETENDARD-LICENSE`에 포함되어 있습니다.
