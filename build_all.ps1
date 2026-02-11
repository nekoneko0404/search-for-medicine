# Build script for Search for Medicine Monorepo

Write-Host "Starting Unified Build..." -ForegroundColor Cyan
$ErrorActionPreference = "Stop"

# 1. Build Root (Vite)
Write-Host "Building Root (Vite)..." -ForegroundColor Cyan
npm run build

# 2. Build Drug Navigator (Next.js)
Write-Host "Building Drug Navigator..." -ForegroundColor Cyan
Set-Location "drug-navigator"
npm install
npm run build
Set-Location ..

# 3. Build Okuri Pakkun (Next.js)
Write-Host "Building Okuri Pakkun..." -ForegroundColor Cyan
Set-Location "okuri_pakkun/okusuri-pakkun-app"
npm install
npm run build
Set-Location ../..

# 4. Copy Artifacts
Write-Host "Copying Artifacts..." -ForegroundColor Cyan

# Create destination directories
New-Item -ItemType Directory -Force -Path "dist/drug-navigator" | Out-Null
New-Item -ItemType Directory -Force -Path "dist/okuri_pakkun" | Out-Null

# Copy Drug Navigator (content of 'out' to 'dist/drug-navigator')
Copy-Item -Path "drug-navigator/out/*" -Destination "dist/drug-navigator" -Recurse -Force

# Copy Okuri Pakkun (content of 'out' to 'dist/okuri_pakkun')
Copy-Item -Path "okuri_pakkun/okusuri-pakkun-app/out/*" -Destination "dist/okuri_pakkun" -Recurse -Force

Write-Host "Unified Build Complete!" -ForegroundColor Green
Write-Host "Output is in 'dist/'" -ForegroundColor Green
