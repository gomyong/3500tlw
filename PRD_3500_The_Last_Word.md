# PRD: 3500 — The Last Word
**버전:** 1.0  
**작성일:** 2026-05-02  
**플랫폼:** iOS (Expo + React Native)  
**대상:** 개인 사용 → 소규모 지인 배포 → 선택적 무료 공개

---

## 1. 제품 개요

### 1.1 한 줄 정의
3,500개의 영단어를 망각 곡선 기반 간격 반복으로 완전 정복하면, 스스로 삭제를 권고하는 영단어 앱.

### 1.2 핵심 가치 명제
- **끝이 있다:** 목표 단어 수가 고정되어 있어 완주 가능성을 체감할 수 있다.
- **자발적 소멸:** 완료 시 앱 삭제를 권고함으로써 도구로서의 순수한 목적성을 부여한다.
- **인지과학 기반:** Active Recall + Spaced Repetition + 가중치 학습을 통합한 구조.

### 1.3 비목표 (Non-goals)
- 게이미피케이션 (포인트, 뱃지, 스트릭 보상)
- 소셜/커뮤니티 기능
- 단어 커스텀 추가 (v1 기준)
- 발음 음성 지원 (v1 기준)
- Android 지원 (v1 기준)

---

## 2. 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| Framework | **Expo (React Native)** | 웹 스택(TSX) 친화적, OTA 업데이트, iOS 빌드 간소화 |
| Language | TypeScript | 타입 안정성, 기존 스택 연장 |
| Local DB | **SQLite (expo-sqlite)** | 오프라인 우선, 쿼리 유연성, 용량 효율 |
| State | Zustand | 경량, boilerplate 최소화 |
| 알림 | expo-notifications | 복습 스케줄 푸시 알림 |
| 단어 데이터 | JSON/CSV 번들 (앱 내 포함) | 서버 없이 독립 동작 |
| 배포 | Expo EAS Build → TestFlight | 지인 배포 최적 경로 |

> **서버/Supabase 없음.** 모든 데이터는 기기 로컬에 저장. 소규모 사용에서 인프라 비용 제로.  
> 추후 공개 시 Supabase 동기화 레이어 추가 가능.

---

## 3. 데이터 모델

### 3.1 words 테이블 (초기 적재, READ 전용)
```sql
CREATE TABLE words (
  id          INTEGER PRIMARY KEY,
  word        TEXT NOT NULL,
  meaning     TEXT NOT NULL,        -- 한국어 뜻
  example     TEXT                  -- 예문 (선택)
);
```
> 3,500개 단어는 앱 최초 설치 시 JSON → SQLite로 일괄 seed.

### 3.2 user_words 테이블 (학습 상태 관리)
```sql
CREATE TABLE user_words (
  word_id          INTEGER PRIMARY KEY REFERENCES words(id),
  current_level    INTEGER DEFAULT 0,      -- 0: 미학습, 1~5: 진행 중, 6: Mastered
  is_mastered      INTEGER DEFAULT 0,      -- BOOLEAN (0/1)
  next_review_date TEXT,                   -- ISO 날짜. NULL이면 미배정
  fail_count       INTEGER DEFAULT 0,      -- 누적 오답 횟수 (가중치 계산용)
  last_failed_at   TEXT,                   -- 마지막 오답 일시 (Stage 4 강조 로직용)
  mastered_at      TEXT                    -- Mastered 달성 일시
);
```

### 3.3 학습 레벨 스케줄 상수
```typescript
const LEVEL_SCHEDULE_DAYS: Record<number, number> = {
  1: 0,   // 당일
  2: 1,   // 1일 후
  3: 7,   // 7일 후
  4: 15,  // 15일 후
  5: 30,  // 30일 후 → Mastered
};
```

### 3.4 상태 전이 규칙
- **정답** → `current_level + 1`, `next_review_date = today + LEVEL_SCHEDULE_DAYS[new_level]`
- **오답** → `current_level = 1`, `next_review_date = today`, `last_failed_at = now`
- **Level 5 정답** → `is_mastered = 1`, `current_level = 6`, `mastered_at = now`

---

## 4. 화면 구조 (Screen Map)

```
App
├── HomeScreen          ← 메인 대시보드
├── SessionSetupScreen  ← 오늘 학습량 설정
├── StudyFlow
│   ├── Stage1Screen    ← Test (단어 → 뜻 맞추기)
│   ├── Stage2Screen    ← Collection (오답 뜻 노출)
│   ├── Stage3Screen    ← Re-test (오답 재시험)
│   ├── Stage4Screen    ← Deep Collection (2차 오답 강조)
│   └── Stage5Screen    ← Final Sweep (무한 반복, 전원 정답 시 종료)
├── ReviewScreen        ← 간격 반복 복습 세션 (Stage 1 → 5 동일 플로우)
├── ProgressScreen      ← 전체 진행 현황
└── TerminationScreen   ← 미션 완료 화면
```

---

## 5. 핵심 기능 상세

### 5.1 HomeScreen

**표시 정보:**
- `학습 대기` : `next_review_date <= today` 인 단어 수
- `정복 완료` : `is_mastered = 1` 인 단어 수 / 3,500
- `오늘 학습 시작` 버튼 (신규 + 복습 혼합 세션)

**UI 원칙:**
- 숫자 2개 + 버튼 1개. 그 외 제거.
- 폰트 크기로 위계 표현. 색상은 흑백 + 강조색 1개.

### 5.2 SessionSetupScreen

- 슬라이더 또는 숫자 입력: 오늘 신규 학습 단어 수 (기본값: 20)
- 복습 due 단어는 자동 포함 (별도 설정 불필요)
- "시작" → StudyFlow 진입

### 5.3 StudyFlow (Stage 1~5)

#### Stage 1: Test
```
[단어 카드]
  WORD
  ──────────────────
  [ 알았다 ] [ 몰랐다 ]
```
- 탭 → 즉시 다음 단어
- 전체 완료 → Stage 2 진입 (오답이 없으면 Stage 2~5 스킵, 세션 완료)

#### Stage 2: Collection
```
WORD
한국어 뜻 / 예문
──────────────────
[ 확인 ]
```
- 오답 단어를 순서대로 뜻과 함께 노출
- 전체 확인 → Stage 3

#### Stage 3: Re-test
- Stage 2 단어들로만 재시험 (Stage 1과 동일 UI)
- 오답 → Stage 4 대상으로 분류

#### Stage 4: Deep Collection
```
[Stage 2와 중복 오답]  → Bold + Red
[Stage 3 신규 오답]   → 일반
──────────────────────
[ 확인 ]
```
- `last_failed_at`이 오늘이면서 Stage 3에서도 오답인 단어 = Bold + Red
- 뜻 노출 후 확인 → Stage 5

#### Stage 5: Final Sweep
- 오늘 오답 이력이 있는 **모든** 단어 (Stage 1 + 3 오답 합집합)
- 전원 정답 처리될 때까지 랜덤 순서로 무한 반복
- 정답 시 해당 단어는 풀에서 제거
- 마지막 단어 정답 → 세션 완료 화면

#### 세션 완료 시 처리
```typescript
// 각 단어별 상태 업데이트
for (const word of sessionWords) {
  if (word.wasCorrectInSession) {
    promoteLevel(word);  // level + 1, next_review_date 계산
  } else {
    resetToLevel1(word); // level = 1, next_review_date = today
  }
}
```

### 5.4 ReviewScreen

- `next_review_date <= today` 인 단어들을 대상으로 Stage 1~5 동일 플로우 실행
- 신규 학습 없이 복습만 필요한 날에 자동 제안

### 5.5 ProgressScreen

| 지표 | 쿼리 |
|---|---|
| 미학습 | `current_level = 0` |
| 학습 중 (Level 1~5) | `current_level BETWEEN 1 AND 5` |
| Mastered | `is_mastered = 1` |
| 오늘 복습 due | `next_review_date <= today AND is_mastered = 0` |
| 예상 완료일 | 현재 속도 기반 단순 추정 |

- 막대 그래프 1개 (미학습 / 학습중 / 정복) — 이 외 시각화 배제

### 5.6 TerminationScreen

`mastered_count === 3500` 달성 즉시 트리거.

```
Mission Complete
3,500 / 3,500

마지막 단어의 장기 기억 전이가 완료되었습니다.
이제 이 앱에 저장된 모든 단어는 당신의 뇌로 완전히 이동했습니다.
더 이상 이 앱을 유지할 이유가 없습니다.

지금 앱을 삭제하고, 자유롭게 영어를 사용하세요.

[ 앱 삭제하기 ]
```

- 모든 학습 기능 잠금
- "앱 삭제하기" 버튼 → iOS 설정으로 딥링크 (또는 삭제 가이드 모달)

---

## 6. 알림 시스템

| 트리거 | 내용 | 타이밍 |
|---|---|---|
| 복습 due 발생 | "복습할 단어 {N}개가 준비됐습니다." | 오전 9시 |
| 3일 연속 미접속 | "단어들이 기다리고 있습니다." | 오전 9시 |
| Mastered 10개 단위 | "{N}개 정복. {3500-N}개 남았습니다." | 달성 직후 |
| Mission Complete | 종료 알림 | 달성 직후 |

---

## 7. 가중치 학습 알고리즘

`fail_count`가 높은 단어는 Level 복귀 후에도 더 촘촘한 복습 주기를 적용.

```typescript
function getNextReviewDays(level: number, failCount: number): number {
  const base = LEVEL_SCHEDULE_DAYS[level];
  if (failCount >= 5) return Math.max(1, Math.floor(base * 0.5));
  if (failCount >= 3) return Math.max(1, Math.floor(base * 0.7));
  return base;
}
```

---

## 8. 단어 데이터 적재

### 포맷 (words.json)
```json
[
  { "id": 1, "word": "abandon", "meaning": "버리다, 포기하다", "example": "He abandoned the project." },
  ...
]
```

### 초기화 로직
```typescript
// 앱 최초 실행 시 1회만 실행
async function seedDatabase() {
  const count = await db.getFirstAsync('SELECT COUNT(*) as c FROM words');
  if (count.c > 0) return;
  
  const words = require('./assets/words.json');
  await db.runAsync('BEGIN TRANSACTION');
  for (const w of words) {
    await db.runAsync(
      'INSERT INTO words (id, word, meaning, example) VALUES (?, ?, ?, ?)',
      [w.id, w.word, w.meaning, w.example]
    );
  }
  await db.runAsync('COMMIT');
}
```

---

## 9. UI 디자인 원칙

| 원칙 | 구현 방식 |
|---|---|
| 텍스트 가독성 최우선 | SF Pro / System Font, 최소 17pt 본문 |
| 색상 최소화 | 흑백 기반 + 강조색 1개 (오답 Red: #E53E3E) |
| 애니메이션 배제 | 카드 전환 없음. 즉각 교체. |
| 진행감 | 상단 `XX / YY` 카운터만 표시 |
| 다크모드 | iOS 시스템 따라가기 (자동 지원) |

---

## 10. 개발 마일스톤

### Phase 0: 기반 세팅 (1주)
- [ ] Expo 프로젝트 초기화 (TypeScript)
- [ ] expo-sqlite 설치 및 스키마 생성
- [ ] words.json 시드 스크립트
- [ ] Zustand 스토어 설계

### Phase 1: 핵심 학습 플로우 (2~3주)
- [ ] Stage 1~5 화면 구현
- [ ] 세션 완료 후 DB 업데이트 로직
- [ ] HomeScreen + SessionSetupScreen

### Phase 2: 간격 반복 엔진 (1주)
- [ ] next_review_date 계산 함수
- [ ] ReviewScreen 구현
- [ ] 가중치 알고리즘 적용

### Phase 3: 알림 + 마무리 (1주)
- [ ] expo-notifications 설정
- [ ] ProgressScreen
- [ ] TerminationScreen
- [ ] TestFlight 배포

### Phase 4: 선택적 공개 준비
- [ ] App Store Connect 설정
- [ ] 온보딩 화면 추가
- [ ] (선택) Supabase 클라우드 백업 레이어

---

## 11. 리스크 및 의존성

| 리스크 | 대응 |
|---|---|
| 단어 JSON 품질 | 적재 전 id 중복/결측 검증 스크립트 실행 |
| 복습 due 폭증 | 하루 최대 복습 단어 수 캡(예: 100개) 설정 옵션 |
| 앱 삭제 후 재설치 | v1은 백업 없음. 이용 안내에 명시. (v2에서 iCloud 백업 고려) |
| TestFlight 만료 | EAS Update로 OTA 업데이트 주기적 갱신 |

---

## 부록 A: 핵심 쿼리 모음

```sql
-- 오늘 복습 대상
SELECT w.*, uw.* FROM user_words uw
JOIN words w ON w.id = uw.word_id
WHERE uw.is_mastered = 0
  AND uw.next_review_date <= date('now')
ORDER BY uw.fail_count DESC;

-- 신규 학습 대상 (미배정 단어)
SELECT * FROM words
WHERE id NOT IN (SELECT word_id FROM user_words)
LIMIT :dailyGoal;

-- 진행 현황 요약
SELECT
  SUM(CASE WHEN current_level = 0 THEN 1 ELSE 0 END) as unstarted,
  SUM(CASE WHEN current_level BETWEEN 1 AND 5 THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN is_mastered = 1 THEN 1 ELSE 0 END) as mastered
FROM user_words;
```

---

## 부록 B: 파일 구조 (권장)

```
app/
├── (tabs)/
│   ├── index.tsx          # HomeScreen
│   └── progress.tsx       # ProgressScreen
├── session/
│   ├── setup.tsx          # SessionSetupScreen
│   ├── stage1.tsx
│   ├── stage2.tsx
│   ├── stage3.tsx
│   ├── stage4.tsx
│   └── stage5.tsx
├── review.tsx             # ReviewScreen
└── termination.tsx        # TerminationScreen

lib/
├── db.ts                  # SQLite 초기화 + 쿼리 함수
├── scheduler.ts           # next_review_date 계산
├── seed.ts                # 초기 데이터 적재
└── notifications.ts       # 알림 스케줄링

store/
└── session.ts             # Zustand: 현재 세션 상태

assets/
└── words.json             # 3,500 단어 원본
```
