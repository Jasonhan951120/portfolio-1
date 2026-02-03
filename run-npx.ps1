# npx 명령어 실행 헬퍼 스크립트
# 사용법: .\run-npx.ps1 <npx 명령어>
# 예시: .\run-npx.ps1 netlify deploy

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

# PATH 환경변수 업데이트
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

# npx 실행
& npx @args
