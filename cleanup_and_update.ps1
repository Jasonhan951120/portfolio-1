# Antigravity Cleanup and Update Helper Script
# This script terminates all running Antigravity processes to allow the update to proceed.

Write-Host "Searching for Antigravity processes..." -ForegroundColor Cyan

$processes = Get-Process -Name Antigravity -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "Found $($processes.Count) Antigravity processes. Terminating..." -ForegroundColor Yellow
    $processes | Stop-Process -Force
    Write-Host "All processes terminated." -ForegroundColor Green
} else {
    Write-Host "No Antigravity processes found running." -ForegroundColor White
}

Write-Host "`nChecking for pending updates..." -ForegroundColor Cyan
$localAppData = $env:LOCALAPPDATA
$updateFolder = Join-Path $localAppData "antigravity-updater"

if (Test-Path $updateFolder) {
    Write-Host "Found update folder: $updateFolder" -ForegroundColor White
}

Write-Host "`nSetup complete. Please restart Antigravity manually now." -ForegroundColor Green
Write-Host "If the update still fails, please restart your computer and try again." -ForegroundColor Yellow
