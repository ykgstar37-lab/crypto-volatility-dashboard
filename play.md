실행 방법

  # 1. 백엔드 실행
  cd backend
  source venv/bin/activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload --port 8001

  # 2. 프론트엔드 실행
  cd frontend
  npm install
  npm run dev

  - 백엔드 API 문서: http://localhost:8001/docs
  - 프론트엔드: http://localhost:5174
