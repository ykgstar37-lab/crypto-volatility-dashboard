# CryptoVol Dashboard

> **P학기 팀 프로젝트(GARCH 변동성 분석)를 개인 프로젝트로 확장한 실시간 멀티코인 변동성 예측 대시보드**

---

## 프로젝트 배경

### 원본 프로젝트 (P학기 — 팀 프로젝트)

P학기(통계 실무 프로젝트)에서 **6조 52경** 팀으로 비트코인 변동성을 분석했습니다.

- **주제**: 암호화폐 변동성 비교 및 분석: GARCH 모델을 기반으로 한 예측
- **기간**: 2023.12 — 2024.01
- **데이터**: 2018.02 ~ 2023.11 (2,129 거래일)
- **핵심 분석**:
  - GARCH(1,1), TGARCH, HAR-GARCH, HAR-TGARCH, HAR-TGARCH-X 5개 모형 체계적 비교
  - ADF 검정, ARCH-LM 검정, 정규성 검정 등 통계적 사전 검정
  - BTC ↔ FNG 상관계수 0.72 (p < 0.001) 확인
  - 외생변수(Volume + FNG)의 예측력 향상 기여도 실증 분석
  - TGARCH 레버리지 효과(γ = 0.099) — 하락 시 변동성 비대칭 확인
  - HAR 구조(1일/7일/30일)의 다중 스케일 변동성 포착

### 확장 (개인 프로젝트)

팀 프로젝트의 분석 결과를 **실제 서비스**로 전환했습니다.

| 구분 | P학기 (팀) | CryptoVol Dashboard (개인) |
|------|-----------|---------------------------|
| 형태 | Python 분석 코드 + 논문 | 풀스택 웹 서비스 |
| 데이터 | CSV 정적 데이터 | CoinGecko API + Binance WebSocket 실시간 |
| 코인 | BTC 단일 | BTC / ETH / SOL 멀티코인 |
| 모형 | Jupyter에서 수동 실행 | API로 자동 예측 서빙 + 정확도 추적 |
| 결과 | matplotlib 차트 | React 인터랙티브 대시보드 |
| 배포 | 로컬 실행 | Render + Vercel 클라우드 |

---

## 핵심 기능

### 1. 실시간 멀티코인 변동성 예측
CoinGecko API + Binance WebSocket으로 BTC / ETH / SOL 실시간 가격, 거래량, FNG 지수를 수집하고 5개 GARCH 모형으로 변동성을 예측합니다.

### 2. 5개 GARCH 모형 비교

| 모형 | 수식 | 특징 |
|------|------|------|
| **GARCH(1,1)** | σ²ₜ = ω + α·r²ₜ₋₁ + β·σ²ₜ₋₁ | 기본 조건부 분산 모형 |
| **TGARCH** | + γ·r²ₜ₋₁·I(rₜ₋₁<0) | 비대칭 레버리지 효과 |
| **HAR-GARCH** | HARCH(1,7,30) | 단·중·장기 변동성 구조 |
| **HAR-TGARCH** | HAR + 비대칭 결합 | HAR + TGARCH OLS |
| **HAR-TGARCH-X** | + Volume + FNG | 외생변수 추가 |

### 3. 모형 인터랙티브 설명 (Model Explainer)
각 GARCH 모형의 수식, 파라미터, 특징, 인사이트를 탭 형태로 설명합니다. 통계 모형에 익숙하지 않은 사용자도 이해할 수 있도록 교육용 컴포넌트를 제공합니다.

### 4. 위험도 점수 (Risk Score)
5개 모형의 연간화 변동성 가중 평균으로 0~100 위험도 점수를 산출합니다.
- 0~25: Low / 25~50: Moderate / 50~75: High / 75~100: Extreme

### 5. 매매 시그널 (Trading Signal)
FNG 지수 + 변동성 추세 + 가격 모멘텀을 종합하여 매매 시그널을 자동 생성합니다.

| 조건 | 시그널 |
|------|--------|
| FNG < 20 (극단적 공포) + 변동성 하락 | **BUY** — 매수 기회 가능성 |
| FNG > 80 (극단적 탐욕) + 변동성 급등 | **SELL** — 조정 주의 |
| 그 외 | **NEUTRAL** |

- Score: -100 (Strong Sell) ~ +100 (Strong Buy)
- 시그널 적중률 히스토리 추적 및 시각화

### 6. 예측 정확도 트래커 (Accuracy Tracker)
GARCH 모형별 예측 정확도를 60일 롤링 기준으로 시계열 추적합니다.
- 모형별 RMSE 랭킹 (메달 표시)
- Cumulative RMSE / Daily Error 두 가지 뷰 모드

### 7. 모형 정확도 리더보드
최근 30일 롤링 예측 기준으로 가장 정확한 GARCH 모형을 실시간 랭킹합니다.

### 8. 인터랙티브 백테스트
날짜 범위를 선택하여 각 모형의 MSE, RMSE, MAE, MAPE, R² 성능 지표를 비교할 수 있습니다. 어떤 시장 구간에서 어떤 모형이 최적이었는지 확인 가능합니다.

### 9. 포트폴리오 시뮬레이터 (Portfolio Simulator)
Monte Carlo 시뮬레이션 기반 멀티코인 포트폴리오 리스크 분석 도구입니다.
- BTC / ETH / SOL 비중 슬라이더로 포트폴리오 구성
- GARCH 변동성 기반 VaR (95%, 99%) 산출
- 1,000 시나리오 Monte Carlo 시뮬레이션
- Sharpe Ratio, 코인별 리스크 분해, 상관행렬

### 10. AI 시장 브리핑 (AI Briefing)
GPT-4o-mini 기반 일일 BTC 시장 분석을 제공합니다.
- 날씨 비유, 가격 추세, FNG 해석, 변동성 상태, 행동 추천
- 플로팅 AI 마스코트 말풍선 인터페이스
- 한국어/영어 자동 전환

### 11. 가격 알림 (Price Alert)
BTC 가격 상한/하한 트리거를 설정하면 실시간 WebSocket 가격을 모니터링하여 Toast 알림을 표시합니다.

### 12. 리포트 다운로드
대시보드 현재 상태(가격, FNG, 모형 예측값)를 타임스탬프 포함 텍스트 파일로 다운로드할 수 있습니다.

### 13. FNG + 거래량 시각화
Fear & Greed Index와 거래량을 듀얼축 차트로 시각화하여 시장 심리와 변동성의 관계를 직관적으로 파악합니다.

### 14. Binance WebSocket 실시간 틱
Binance WebSocket 스트림을 릴레이하여 BTC/ETH/SOL 실시간 거래가를 밀리초 단위로 표시합니다.
- 자동 재연결 (3초 백오프)
- WebSocket 연결 시 5분 / 미연결 시 1분 자동 리프레시

### 15. 한/영 다국어 지원
대시보드 전체 UI가 한국어/영어 전환을 지원합니다.

### 16. 다크/라이트 모드
전체 UI 테마 전환을 지원합니다.

### 17. 하단 플로팅 독 (Bottom Dock)
Signal Accuracy, ETH 가격, Price Alert, Report Download에 빠르게 접근할 수 있는 하단 독 바를 제공합니다.

### 18. API 디버그 로그
실시간 데이터 수집 상태를 터미널 스타일 로그로 확인할 수 있습니다.

---

## 사용자 인사이트

| 인사이트 | 설명 | 대상 |
|---------|------|------|
| **매매 타이밍** | FNG + 변동성 기반 시그널로 진입/청산 참고 | 일반 투자자 |
| **시장 심리** | FNG 게이지 + 추이 차트로 공포/탐욕 즉시 파악 | 심리적 매매 |
| **모형 신뢰도** | 리더보드 + 정확도 트래커로 현재 가장 정확한 모형 확인 | 연구/분석 |
| **위험 경고** | Risk Score + 변동성 추세로 위험도 실시간 모니터링 | 리스크 관리 |
| **기간별 비교** | 백테스트로 특정 시장 구간의 최적 모형 탐색 | 전략 설계 |
| **포트폴리오 리스크** | VaR + Monte Carlo로 포트폴리오 손실 시나리오 파악 | 포트폴리오 관리 |
| **AI 브리핑** | GPT-4o-mini가 시장 상황을 자연어로 요약 | 빠른 현황 파악 |

---

## 기술 스택

### Backend
| 기술 | 용도 |
|------|------|
| **FastAPI** | REST API + WebSocket 서버 |
| **SQLAlchemy** | ORM (SQLite) |
| **arch** | GARCH 모형 적합 및 예측 |
| **APScheduler** | 일일 데이터 수집 스케줄러 |
| **httpx** | CoinGecko API 비동기 호출 |
| **websockets** | Binance WebSocket 스트림 수신 |
| **pandas / numpy / scipy** | 데이터 처리 및 통계 연산 |
| **OpenAI API** | GPT-4o-mini AI 브리핑 생성 |

### Frontend
| 기술 | 용도 |
|------|------|
| **React 19** | UI 프레임워크 |
| **Vite** | 빌드 도구 |
| **Tailwind CSS v4** | 스타일링 |
| **Recharts** | 차트 시각화 |
| **Axios** | API 통신 |

### Infra
| 기술 | 용도 |
|------|------|
| **Render** | 백엔드 배포 |
| **Vercel** | 프론트엔드 배포 |
| **SQLite** | 데이터베이스 |
| **Binance WebSocket** | 실시간 거래 데이터 소스 |

---

## 시스템 아키텍처

```
Binance WebSocket ──→ FastAPI Backend ──→ React Dashboard
(BTC/ETH/SOL ticks)    │                    │
                       │                    ├── 코인 셀렉터 (BTC/ETH/SOL)
CoinGecko API ────────→│                    ├── 실시간 가격 (WebSocket)
(가격, FNG, 거래량)     │                    ├── 변동성 예측 비교 차트
                       ├── SQLite DB        ├── Risk Gauge + Score
OpenAI API ───────────→├── GARCH Models     ├── 매매 시그널 + 적중률
(GPT-4o-mini)          ├── Risk Score       ├── 정확도 트래커
                       ├── Monte Carlo      ├── 포트폴리오 시뮬레이터
                       └── APScheduler      ├── AI 마스코트 브리핑
                         (일일 데이터)       ├── FNG + Volume 차트
                                            ├── 백테스트 테이블
                                            └── 하단 독 + Price Alert
```

---

## API Endpoints

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| GET | `/api/price/current?coin=BTC` | 현재 가격 + 24h 변동 + FNG |
| GET | `/api/price/multi` | BTC/ETH/SOL 전체 현재 가격 |
| GET | `/api/price/history?days=365&coin=BTC` | 일별 OHLCV + FNG + 로그수익률 |
| GET | `/api/volatility/predict?coin=BTC` | 5개 모형 변동성 예측 + 위험도 점수 |
| GET | `/api/volatility/compare?days=90&coin=BTC` | 예측 vs 실현 변동성 비교 |
| GET | `/api/volatility/accuracy?days=60&coin=BTC` | 모형별 예측 정확도 시계열 |
| GET | `/api/backtest?start=...&end=...` | 기간별 백테스트 성능 지표 |
| GET | `/api/signal` | 매매 시그널 (FNG + 변동성 + 모멘텀 종합) |
| GET | `/api/signal/leaderboard` | 모형 정확도 리더보드 (최근 30일) |
| GET | `/api/signal/accuracy` | 시그널 적중률 (최근 60일) |
| GET | `/api/briefing?lang=ko` | AI 시장 브리핑 (GPT-4o-mini) |
| POST | `/api/portfolio/simulate` | 포트폴리오 VaR + Monte Carlo 시뮬레이션 |
| WS | `/ws/ticks` | Binance 실시간 틱 릴레이 (BTC/ETH/SOL) |

---

## P학기 분석 기반 — 통계적 근거

### 사전 검정

| 검정 | 목적 | 결과 |
|------|------|------|
| **ADF 검정** | 시계열 정상성 확인 | 로그수익률 정상 (p < 0.05) |
| **ARCH-LM 검정** | 이분산성 확인 | ARCH 효과 존재 (p < 0.05) |
| **정규성 검정** | 수익률 분포 확인 | 정규성 기각 → 두터운 꼬리 |

### 상관 분석

| 변수 쌍 | 상관계수 | p-value | 유의성 |
|---------|---------|---------|--------|
| BTC ↔ FNG | 0.72 | 2.2e-16 | 유의 |
| BTC ↔ KOSPI | -0.03 | 0.98 | 비유의 |
| BTC ↔ NASDAQ | -0.05 | 0.84 | 비유의 |

### 핵심 발견
1. **TGARCH 레버리지 효과** (γ = 0.099): 비트코인 하락 시 변동성이 상승 시보다 약 10% 더 증가
2. **HAR 구조**: 단기(1일)/중기(7일)/장기(30일) 변동성의 다중 스케일 분석이 예측력 향상
3. **FNG 지수**: 비트코인 가격과 유의미한 상관 (r = 0.72) → 외생변수로 활용 근거
4. **Volume + FNG**: 거래량(시장 활동 강도)과 심리지수(공포/탐욕)가 보완적 정보 제공

---

## 프로젝트 구조

```
crypto-volatility-dashboard/
├── README.md
├── DEVLOG.md
├── .gitignore
│
├── backend/
│   ├── requirements.txt
│   ├── .env
│   └── app/
│       ├── main.py              # FastAPI 앱 + CORS + lifespan + WS 릴레이
│       ├── config.py            # 환경설정 (pydantic-settings)
│       ├── database.py          # SQLite + SQLAlchemy
│       ├── scheduler.py         # APScheduler 일일 데이터 수집 (BTC/ETH/SOL)
│       ├── models/
│       │   └── price.py         # coin_daily 테이블 ORM (멀티코인)
│       ├── schemas/
│       │   └── volatility.py    # Pydantic 응답 모델
│       ├── services/
│       │   ├── coingecko.py     # CoinGecko API 클라이언트 (멀티코인)
│       │   ├── garch.py         # 5개 GARCH 모형 서비스
│       │   └── risk_score.py    # 위험도 점수 산출
│       └── routers/
│           ├── price.py         # /api/price 엔드포인트 (멀티코인)
│           ├── volatility.py    # /api/volatility 엔드포인트 + 정확도 추적
│           ├── backtest.py      # /api/backtest 엔드포인트
│           ├── signal.py        # /api/signal 매매 시그널 + 리더보드 + 적중률
│           ├── briefing.py      # /api/briefing AI 브리핑 (GPT-4o-mini)
│           ├── portfolio.py     # /api/portfolio Monte Carlo 시뮬레이터
│           └── ws.py            # /ws/ticks Binance WebSocket 릴레이
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api/client.js           # Axios API 클라이언트 (11개 함수)
│       ├── i18n.js                 # 한/영 번역
│       ├── hooks/
│       │   └── useRealtimePrice.js # Binance WebSocket 커스텀 훅
│       ├── components/
│       │   ├── PriceChart.jsx          # 가격 시계열 차트
│       │   ├── VolatilityChart.jsx     # 5개 모형 비교 시계열
│       │   ├── FngGauge.jsx            # FNG 반원형 게이지
│       │   ├── FngChart.jsx            # FNG 추이 차트
│       │   ├── SignalCard.jsx          # 매매 시그널 카드
│       │   ├── SignalAccuracy.jsx      # 시그널 적중률 히스토리
│       │   ├── Leaderboard.jsx         # 모형 정확도 리더보드
│       │   ├── AccuracyTracker.jsx     # 예측 정확도 시계열 트래커
│       │   ├── BacktestPanel.jsx       # 인터랙티브 백테스트
│       │   ├── PortfolioSimulator.jsx  # Monte Carlo 포트폴리오 시뮬레이터
│       │   ├── LogReturnsChart.jsx     # 일별 로그수익률
│       │   ├── RiskScore.jsx           # 위험도 점수
│       │   ├── ModelTable.jsx          # 모형 예측 상세표
│       │   ├── ModelExplainer.jsx      # GARCH 모형 인터랙티브 설명
│       │   ├── AiBriefing.jsx          # AI 시장 브리핑 패널
│       │   ├── AiMascot.jsx            # 플로팅 AI 마스코트
│       │   ├── PriceAlert.jsx          # 가격 알림 설정
│       │   ├── ReportDownload.jsx      # 리포트 다운로드
│       │   ├── Toast.jsx               # Toast 알림 시스템
│       │   ├── BottomDock.jsx          # 하단 플로팅 독
│       │   ├── Sidebar.jsx             # 사이드바 내비게이션
│       │   ├── ApiLog.jsx              # API 디버그 로그
│       │   ├── StatCard.jsx            # 통계 카드
│       │   └── Skeleton.jsx            # 로딩 스켈레톤 UI
│       └── pages/
│           └── Dashboard.jsx       # 메인 대시보드 (오케스트레이션)
│
└── image/                          # AI 마스코트 이미지 (4종)
```

---

## 빠른 시작

### Backend

```bash
cd backend
python -m venv venv
venv/Scripts/activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

서버 시작 시 자동으로 365일 BTC/ETH/SOL 데이터를 CoinGecko에서 백필합니다.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### 환경 변수 (.env)

```
DATABASE_URL=sqlite:///./data/crypto.db
CORS_ORIGINS=http://localhost:5173
OPENAI_API_KEY=sk-...    # AI 브리핑용 (선택)
```

---

## 개발자

**윤경은 (Yoon Gyeongeun)**
- P학기 팀 프로젝트 참여 → 개인 프로젝트로 확장
- GitHub: [@ykgstar37-lab](https://github.com/ykgstar37-lab)
