# 포트폴리오 프로젝트 - 중요 정보

## 📌 현재 상황 (2026-02-02)

### ✅ 완료된 작업
1. **디자인 시스템 적용 완료**
   - Fresh Blue + Smile Yellow 색상 테마
   - Soft UI 스타일 (둥근 모서리, 부드러운 그림자)
   - 모든 컴포넌트 리팩토링 완료 (Stats, Services, Team, Pricing, Footer, Booking)

2. **프로덕션 빌드 완료**
   - `npm run build` 성공
   - `dist` 폴더에 배포 파일 생성됨

3. **개발 서버 실행 중**
   - 개발 서버: http://localhost:3000
   - 프로덕션 테스트: http://localhost:8001

### 🔧 현재 해결 중인 문제
**Supabase에서 npx 오류**
- 문제: `Error: exec: "npx": executable file not found in %PATH%`
- 원인: Supabase CLI가 npx를 찾지 못함
- 해결 방법: VS Code 재시작 필요

## 🚀 다음 단계

### VS Code 재시작 후 할 일:
1. VS Code 완전히 종료 후 재시작
2. 터미널에서 다시 시도:
   ```powershell
   npx supabase login
   ```
3. 정상 작동하면 Supabase 토큰 생성 진행

### 배포 방법 (나중에):
1. **Netlify Drop 사용 (가장 쉬움)**
   - https://app.netlify.com/drop 접속
   - `C:\Users\Donggyun\.gemini\antigravity\scratch\portfolio-1\dist` 폴더를 드래그 앤 드롭
   - 즉시 공개 URL 생성됨

2. **또는 Netlify CLI 사용**
   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
   npx netlify deploy --prod --dir=dist
   ```

## 📁 중요 파일 위치

- **프로젝트 폴더**: `C:\Users\Donggyun\.gemini\antigravity\scratch\portfolio-1`
- **배포 파일**: `C:\Users\Donggyun\.gemini\antigravity\scratch\portfolio-1\dist`
- **소스 코드**: `portfolio-1/components/`, `portfolio-1/App.tsx`

## 💡 유용한 명령어

### 개발 서버 시작
```powershell
cd C:\Users\Donggyun\.gemini\antigravity\scratch\portfolio-1
npm run dev
```

### 프로덕션 빌드
```powershell
npm run build
```

### PATH 새로고침 (npx 오류 시)
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
```

## 📞 문제 발생 시

1. **서버가 안 켜져요**
   - Node.js 경로 확인: `where.exe node`
   - PATH 새로고침 후 재시도

2. **npx 명령어가 안 돼요**
   - VS Code 재시작
   - 또는 위의 "PATH 새로고침" 명령어 실행

3. **배포가 안 돼요**
   - `dist` 폴더 확인: `ls dist`
   - 없으면 `npm run build` 다시 실행

---

**이 파일은 재시작 후에도 그대로 남아있습니다!**
