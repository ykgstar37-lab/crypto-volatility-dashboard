# DEVLOG — CryptoVol Dashboard

> 개발 진행 로그. 각 단계별 구현 내용과 기술적 의사결정을 기록합니다.

---

## v0.1.0 — Initial Release (c569f3d)

**실시간 BTC 변동성 예측 대시보드 MVP**

### Backend
- FastAPI REST API 서버 구축
- SQLAlchemy + SQLite 데이터 저장소
- CoinGecko API 연동 (BTC 가격, FNG 지수, 거래량)
- APScheduler 일일 자동 데이터 수집 (매일 0:05 UTC)
- 서버 시작 시 365일 과거 데이터 자동 백필
- 5개 GARCH 모형 구현: GARCH(1,1), TGARCH, HAR-GARCH, HAR-TGARCH, HAR-TGARCH-X
- Risk Score 산출 (5개 모형 가중평균 → 0~100)
- 매매 시그널 엔진 (FNG + 변동성 추세 + 가격 모멘텀)
- 백테스트 API (MSE, RMSE, MAE, MAPE, R²)
- 모형 정확도 리더보드

### Frontend
- React + Vite + Tailwind CSS 기반 SPA
- 대시보드 레이아웃: Sidebar + 메인 콘텐츠 영역
- 핵심 컴포넌트:
  - PriceChart — BTC 가격 시계열 차트
  - VolatilityChart — 5개 모형 예측 비교 시계열
  - FngGauge — Fear & Greed 반원형 게이지
  - FngChart — FNG 추이 차트
  - SignalCard — 매매 시그널 카드 (BUY/SELL/NEUTRAL)
  - Leaderboard — 모형 정확도 랭킹
  - BacktestPanel — 인터랙티브 날짜 범위 백테스트
  - LogReturnsChart — 일별 로그수익률
  - RiskScore — 위험도 점수 시각화
  - ModelTable — 모형별 예측 상세표
  - StatCard — 통계 요약 카드
  - ApiLog — API 디버그 로그 터미널
- 한/영 다국어 지원 (i18n)
- 다크/라이트 모드 지원

### 인프라
- 데이터: CoinGecko API → SQLite
- API: FastAPI (Render 배포 대상)
- 프론트: Vite dev proxy `/api` → `localhost:8000`

---

## v0.2.0 — Binance WebSocket 실시간 가격 (dc2a086)

**CoinGecko 폴링 → Binance WebSocket 스트리밍 전환**

### Backend
- `routers/ws.py` 신규: Binance WebSocket 릴레이 서버
  - `btcusdt@trade` 스트림 연결
  - `/ws/ticks` WebSocket 엔드포인트로 클라이언트에 브로드캐스트
  - 자동 재연결 (3초 백오프)

### Frontend
- `hooks/useRealtimePrice.js` 신규: WebSocket 커스텀 훅
  - 실시간 tick 데이터 수신 (price, timestamp)
  - 연결 상태 관리 + 자동 재연결
- Dashboard에 실시간 가격 표시 통합
- WebSocket 연결 시 자동 리프레시 5분, 미연결 시 1분

---

## v0.3.0 — Multi-coin 지원 (53e1f32)

**BTC 단일 → BTC / ETH / SOL 3개 코인 지원 확장**

### Backend
- `models/price.py`: 코인별 테이블 분리 (coin 컬럼 추가)
- `scheduler.py`: 3개 코인 병렬 백필 + 일일 수집
- `services/coingecko.py`: 멀티코인 API 호출 지원
- `routers/price.py`: `?coin=BTC|ETH|SOL` 쿼리 파라미터 추가, `/api/price/multi` 엔드포인트
- `routers/volatility.py`: 코인별 변동성 예측
- `routers/ws.py`: `btcusdt`, `ethusdt`, `solusdt` 3개 스트림 동시 연결

### Frontend
- Dashboard 상단 코인 셀렉터 (BTC / ETH / SOL 탭)
- `useRealtimePrice.js`: 3개 코인 tick 동시 추적
- `api/client.js`: 멀티코인 API 함수 추가 (`fetchMultiPrices`, `fetchEthPrice`)
- 코인 전환 시 모든 차트/데이터 동적 리로드

---

## v0.4.0 — 예측 정확도 트래커 (28b974b)

**GARCH 모형별 예측 정확도를 시계열로 추적**

### Backend
- `routers/volatility.py`: `/api/volatility/accuracy` 엔드포인트 추가
  - 60일 롤링 윈도우 기준 일별 예측 vs 실현 변동성 비교
  - GARCH(1,1), TGARCH, HAR-GARCH 3개 모형의 MAE/RMSE 누적 추적

### Frontend
- `AccuracyTracker.jsx` 신규: 예측 정확도 시각화 컴포넌트
  - 모형별 RMSE 랭킹 (메달 표시)
  - Cumulative RMSE / Daily Error 두 가지 뷰 모드
  - 60일 라인 차트

---

## v0.5.0 — 포트폴리오 시뮬레이터 (784317f)

**Monte Carlo 시뮬레이션 기반 멀티코인 포트폴리오 리스크 분석**

### Backend
- `routers/portfolio.py` 신규: `/api/portfolio/simulate` POST 엔드포인트
  - BTC / ETH / SOL 가중치 기반 포트폴리오 구성
  - GARCH 변동성 기반 VaR (95%, 99%) 산출
  - Monte Carlo 1,000 시나리오 시뮬레이션
  - Sharpe Ratio, 코인별 리스크 분해, 상관행렬

### Frontend
- `PortfolioSimulator.jsx` 신규: 포트폴리오 시뮬레이터 UI
  - 코인별 비중 슬라이더 (BTC 50% / ETH 30% / SOL 20% 기본값)
  - 투자금액 + 투자기간 설정
  - Monte Carlo 분포 히스토그램 차트
  - VaR, Sharpe Ratio, 코인별 상세 결과 표시
- Sidebar에 Portfolio 메뉴 추가
- Dashboard에 PortfolioSimulator 섹션 통합

---

## v0.5.1 — 심볼 필터 버그 수정 (b251ce8)

**멀티코인 전환 시 데이터 혼재 버그 수정**

### Backend
- `routers/signal.py`: 시그널/리더보드/적중률 쿼리에 `symbol` 필터 추가
- `routers/briefing.py`: AI 브리핑 쿼리에 코인별 필터 적용
- `routers/backtest.py`: 백테스트 쿼리에 `symbol` 조건 추가
- 코인 전환 시 이전 코인 데이터가 섞이는 문제 해결

---

## 추가 기능 (Initial 커밋에 포함되었으나 별도 기록)

README에 미기재된 기능들로, 초기 커밋 시점에 이미 구현되어 있던 컴포넌트:

| 컴포넌트 | 기능 |
|---------|------|
| **AiBriefing.jsx** | GPT-4o-mini 기반 AI 시장 브리핑 (한/영) |
| **AiMascot.jsx** | 플로팅 AI 마스코트 + 말풍선 브리핑 인터페이스 |
| **ModelExplainer.jsx** | 5개 GARCH 모형 교육용 인터랙티브 설명 (수식, 파라미터, 인사이트) |
| **ReportDownload.jsx** | 대시보드 현황 텍스트 리포트 다운로드 (.txt) |
| **SignalAccuracy.jsx** | 매매 시그널 적중률 히스토리 시각화 |
| **PriceAlert.jsx** | 가격 알림 설정 (하한/상한 트리거 + Toast 알림) |
| **Toast.jsx** | Toast 알림 시스템 (alert/success/info, 자동 해제) |
| **BottomDock.jsx** | 하단 플로팅 독 (Signal Accuracy, ETH 가격, Price Alert, Report 빠른 접근) |
| **Skeleton.jsx** | 로딩 스켈레톤 UI (SkeletonCard, SkeletonChart, SkeletonWide) |
| **briefing.py** | `/api/briefing` — AI 시장 분석 브리핑 API (OpenAI GPT-4o-mini) |
| **signal.py /accuracy** | `/api/signal/accuracy` — 시그널 적중률 API |
