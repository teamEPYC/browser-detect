# Cloudflare Workers Deployment Script
Write-Host "🚀 Starting Cloudflare Workers deployment..." -ForegroundColor Green

# Step 1: Build the application
Write-Host "📦 Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Get the latest asset filenames
Write-Host "🔍 Finding latest asset filenames..." -ForegroundColor Yellow

$cssFile = Get-ChildItem "dist/client/assets" -Filter "root-*.css" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | ForEach-Object { $_.Name }
$jsFile = Get-ChildItem "dist/client/assets" -Filter "entry.client-*.js" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | ForEach-Object { $_.Name }

if (-not $cssFile -or -not $jsFile) {
    Write-Host "❌ Could not find CSS or JS files!" -ForegroundColor Red
    exit 1
}

Write-Host "📄 CSS File: $cssFile" -ForegroundColor Cyan
Write-Host "📄 JS File: $jsFile" -ForegroundColor Cyan

# Step 3: Update the worker file
Write-Host "✏️ Updating worker file..." -ForegroundColor Yellow

$workerContent = Get-Content "workers/final-app.ts" -Raw
$workerContent = $workerContent -replace 'const cssFile = "root-[^"]*\.css";', "const cssFile = `"$cssFile`";"
$workerContent = $workerContent -replace 'const jsFile = "entry\.client-[^"]*\.js";', "const jsFile = `"$jsFile`";"
$workerContent | Set-Content "workers/final-app.ts"

Write-Host "✅ Worker file updated successfully!" -ForegroundColor Green

# Step 4: Deploy to Cloudflare
Write-Host "☁️ Deploying to Cloudflare Workers..." -ForegroundColor Yellow
npx wrangler deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
} 