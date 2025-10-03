# deploy.ps1 - Railway Deployment Script

Write-Host "🚀 Deploying Lecturer Reporting System Backend..." -ForegroundColor Green

# Check if Railway CLI is installed
try {
    $version = railway --version
    Write-Host "✅ Railway CLI found: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not installed. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "🔐 Logging into Railway..." -ForegroundColor Yellow
railway login

# Set environment variables
Write-Host "⚙️ Setting environment variables..." -ForegroundColor Yellow
railway variables set DATABASE_URL="postgresql://neondb_owner:npg_yxjM6rlUT8KO@ep-blue-surf-ad9nh6al-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
railway variables set JWT_SECRET="lecturer_reporting_system_secret_key_2024_very_secure"
railway variables set NODE_ENV="production"
railway variables set PORT="5000"
railway variables set FRONTEND_URL="https://your-app-name.netlify.app"

# Deploy
Write-Host "📦 Deploying to Railway..." -ForegroundColor Yellow
railway deploy

Write-Host "✅ Deployment complete!" -ForegroundColor Green