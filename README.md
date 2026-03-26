# CryptoVol Dashboard

> **P학기 팀 프로젝트(GARCH 변동성 분석)를 개인 프로젝트로 확장한 실시간 BTC 변동성 예측 대시보드**

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
| 데이터 | CSV 정적 데이터 | CoinGecko API 실시간 연동 |
| 모형 | Jupyter에서 수동 실행 | API로 자동 예측 서빙 |
| 결과 | matplotlib 차트 | React 인터랙티브 대시보드 |
| 배포 | 로컬 실행 | Render + Vercel 클라우드 |

---

## 핵심 기능

### 1. 실시간 BTC 변동성 예측
CoinGecko API에서 실시간 BTC 가격, 거래량, FNG 지수를 수집하고 5개 GARCH 모형으로 변동성을 예측합니다.

### 2. 5개 GARCH 모형 비교

| 모형 | 수식 | 특징 |
|------|------|------|
| **GARCH(1,1)** | σ²ₜ = ω + α·r²ₜ₋₁ + β·σ²ₜ₋₁ | 기본 조건부 분산 모형 |
| **TGARCH** | + γ·r²ₜ₋₁·I(rₜ₋₁<0) | 비대칭 레버리지 효과 |
| **HAR-GARCH** | HARCH(1,7,30) | 단·중·장기 변동성 구조 |
| **HAR-TGARCH** | HAR + 비대칭 결합 | HAR + TGARCH OLS |
| **HAR-TGARCH-X** | + Volume + FNG | 외생변수 추가 |

### 3. 위험도 점수 (Risk Score)
5개 모형의 연간화 변동성 가중 평균으로 0~100 위험도 점수를 산출합니다.
- 0~25: Low / 25~50: Moderate / 50~75: High / 75~100: Extreme

### 4. 백테스팅
사용자가 날짜 범위를 선택하면 MSE, RMSE, MAPE, MAE, R² 성능 지표를 모형별로 비교합니다.

### 5. FNG + 거래량 시각화
Fear & Greed Index와 거래량을 듀얼축 차트로 시각화하여 시장 심리와 변동성의 관계를 직관적으로 파악합니다.

### 6. 매매 시그널 (Trading Signal)
FNG 지수 + 변동성 추세 + 가격 모멘텀을 종합하여 매매 시그널을 자동 생성합니다.

| 조건 | 시그널 |
|------|--------|
| FNG < 20 (극단적 공포) + 변동성 하락 | **BUY** — 매수 기회 가능성 |
| FNG > 80 (극단적 탐욕) + 변동성 급등 | **SELL** — 조정 주의 |
| 그 외 | **NEUTRAL** |

- Score: -100 (Strong Sell) ~ +100 (Strong Buy)
- P학기 논문에서 확인한 FNG-BTC 상관계수 0.72를 실제 시그널로 활용

### 7. 모형 정확도 리더보드
최근 30일 롤링 예측 기준으로 가장 정확한 GARCH 모형을 실시간 랭킹합니다.

### 8. 인터랙티브 백테스트
날짜 범위를 선택하여 각 모형의 MSE, RMSE, MAE, MAPE, R² 성능 지표를 비교할 수 있습니다. 어떤 시장 구간에서 어떤 모형이 최적이었는지 확인 가능합니다.

### 9. 한/영 다국어 지원
대시보드 전체 UI가 한국어/영어 전환을 지원합니다.

### 10. API 디버그 로그
실시간 데이터 수집 상태를 터미널 스타일 로그로 확인할 수 있습니다.

---

## 사용자 인사이트

| 인사이트 | 설명 | 대상 |
|---------|------|------|
| **매매 타이밍** | FNG + 변동성 기반 시그널로 진입/청산 참고 | 일반 투자자 |
| **시장 심리** | FNG 게이지 + 추이 차트로 공포/탐욕 즉시 파악 | 심리적 매매 |
| **모형 신뢰도** | 리더보드로 현재 가장 정확한 모형 확인 | 연구/분석 |
| **위험 경고** | Risk Score + 변동성 추세로 위험도 실시간 모니터링 | 리스크 관리 |
| **기간별 비교** | 백테스트로 특정 시장 구간의 최적 모형 탐색 | 전략 설계 |

---

## 기술 스택

### Backend
| 기술 | 용도 |
|------|------|
| **FastAPI** | REST API 서버 |
| **SQLAlchemy** | ORM (SQLite) |
| **arch** | GARCH 모형 적합 및 예측 |
| **APScheduler** | 일일 데이터 수집 스케줄러 |
| **httpx** | CoinGecko API 비동기 호출 |
| **pandas / numpy / scipy** | 데이터 처리 및 통계 연산 |

### Frontend
| 기술 | 용도 |
|------|------|
| **React 18** | UI 프레임워크 |
| **Vite** | 빌드 도구 |
| **Tailwind CSS** | 스타일링 |
| **Recharts** | 차트 시각화 |
| **Axios** | API 통신 |

### Infra
| 기술 | 용도 |
|------|------|
| **Render** | 백엔드 배포 |
| **Vercel** | 프론트엔드 배포 |
| **SQLite** | 데이터베이스 |

---

## 시스템 아키텍처

```
CoinGecko API ──→ FastAPI Backend ──→ React Dashboard
(BTC, FNG)         │                    │
                   ├── SQLite DB        ├── BTC 가격 차트
                   ├── GARCH Models     ├── 변동성 예측 비교
                   ├── Risk Score       ├── Risk Gauge
                   └── APScheduler      ├── FNG + Volume 차트
                     (일일 데이터)       └── 백테스트 테이블
```

---

## API Endpoints

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| GET | `/api/price/current` | 현재 BTC 가격 + 24h 변동 + FNG |
| GET | `/api/price/history?days=365` | 일별 OHLCV + FNG + 로그수익률 |
| GET | `/api/volatility/predict` | 5개 모형 변동성 예측 + 위험도 점수 |
| GET | `/api/volatility/compare?days=90` | 예측 vs 실현 변동성 비교 |
| GET | `/api/backtest?start=...&end=...` | 기간별 백테스트 성능 지표 |
| GET | `/api/signal` | 매매 시그널 (FNG + 변동성 + 모멘텀 종합) |
| GET | `/api/signal/leaderboard` | 모형 정확도 리더보드 (최근 30일) |

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
├── .gitignore
│
├── backend/
│   ├── requirements.txt
│   ├── .env
│   └── app/
│       ├── main.py              # FastAPI 앱 + CORS + lifespan
│       ├── config.py            # 환경설정 (pydantic-settings)
│       ├── database.py          # SQLite + SQLAlchemy
│       ├── scheduler.py         # APScheduler 일일 데이터 수집
│       ├── models/
│       │   └── price.py         # btc_daily 테이블 ORM
│       ├── schemas/
│       │   └── volatility.py    # Pydantic 응답 모델
│       ├── services/
│       │   ├── coingecko.py     # CoinGecko API 클라이언트
│       │   ├── garch.py         # 5개 GARCH 모형 서비스
│       │   └── risk_score.py    # 위험도 점수 산출
│       └── routers/
│           ├── price.py         # /api/price 엔드포인트
│           ├── volatility.py    # /api/volatility 엔드포인트
│           ├── backtest.py      # /api/backtest 엔드포인트
│           └── signal.py        # /api/signal 매매 시그널 + 리더보드
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.jsx
        ├── api/client.js
        ├── i18n.js              # 한/영 번역
        ├── components/
        │   ├── PriceChart.jsx       # BTC 가격 차트
        │   ├── VolatilityChart.jsx   # 5개 모형 비교 시계열
        │   ├── FngGauge.jsx         # FNG 반원형 게이지
        │   ├── FngChart.jsx         # FNG 추이 차트
        │   ├── SignalCard.jsx       # 매매 시그널 카드
        │   ├── Leaderboard.jsx      # 모형 정확도 리더보드
        │   ├── BacktestPanel.jsx    # 인터랙티브 백테스트
        │   ├── LogReturnsChart.jsx  # 일별 로그수익률
        │   ├── RiskScore.jsx        # 위험도 점수
        │   ├── ModelTable.jsx       # 모형 예측 상세표
        │   ├── Sidebar.jsx          # 왼쪽 사이드바
        │   ├── ApiLog.jsx           # API 디버그 로그
        │   └── StatCard.jsx         # 통계 카드
        └── pages/Dashboard.jsx  # 메인 대시보드
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

서버 시작 시 자동으로 365일 BTC 데이터를 CoinGecko에서 백필합니다.

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
```

---

## 개발자

**윤경은 (Yoon Gyeongeun)**
- P학기 팀 프로젝트 참여 → 개인 프로젝트로 확장
- GitHub: [@ykgstar37-lab](https://github.com/ykgstar37-lab)
