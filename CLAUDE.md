# 3500 — The Last Word

제품 요구사항의 전체 근거는 저장소 루트의 `PRD_3500_The_Last_Word.md`에 있다. 구현 전 항상 PRD와 이 파일을 함께 참고한다.

## 제품 한 줄

3,500개 영단어를 망각 곡선 기반 간격 반복으로 정복하면 스스로 삭제를 권하는 iOS 앱(Expo). v1에서 Android·서버·단어 커스텀·발음 지원은 하지 않는다.

## 스택

- Expo (React Native), TypeScript
- `expo-sqlite` — 오프라인 로컬 DB
- Zustand — 상태
- `expo-notifications` — 알림
- 단어: 앱 번들 `words.json` → 최초 1회 SQLite seed

## 아키텍처 메모

- `words`: READ 전용 시드. `user_words`: 학습 상태·`next_review_date`·레벨 0~6·`fail_count` 등.
- 레벨 일정·상태 전이·가중치 `getNextReviewDays`는 PRD §3~§7과 동일하게 유지한다.
- 화면 맵·StudyFlow Stage 1~5·Termination 조건은 PRD §4~§6을 따른다.
- UI: 흑백 + 강조 1색(오답 `#E53E3E`), 애니메이션 최소, 다크모드는 시스템 따름.

## 권장 디렉터리 (PRD 부록 B)

Expo Router를 쓰면 `app/`·`lib/`·`store/`·`assets/words.json` 구조를 목표로 한다.

## 로컬 개발 (프로젝트 초기화 후)

- 의존성: `npm install`
- 개발 서버: `npx expo start`
- iOS 시뮬레이터: Expo CLI 안내에 따라 `i` 등

## Claude Code에게

- PRD의 Non-goals(게이미피케이션, 소셜, v1 Android 등)를 기본으로 위반하지 않는다.
- 새 기능은 PRD에 없으면 제안만 하고, 사용자 확인 없이 스코프를 키우지 않는다.
- `.env` 및 비밀 키는 커밋하지 않는다. v1은 서버 없음.
