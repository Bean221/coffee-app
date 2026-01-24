# API Test Script for Coffee App (Windows PowerShell)
# Sử dụng để test API endpoints trực tiếp

# ⚠️ Thay đổi API_URL thành IP của bạn
$API_URL = "https://nonsporting-definitively-dorene.ngrok-free.dev"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "☕ Coffee App API Test Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "API URL: $API_URL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Login
Write-Host "1️⃣ Testing Login Endpoint" -ForegroundColor Yellow
Write-Host "POST $API_URL/auth/login" -ForegroundColor Gray
Write-Host ""

$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginBody

    Write-Host "Response:" -ForegroundColor Green
    $loginResponse | ConvertTo-Json | Write-Host
    Write-Host ""

    $token = $loginResponse.token

    if ($token) {
        Write-Host "✅ Login successful! Token received" -ForegroundColor Green
        Write-Host "Token: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Green
        Write-Host ""

        # Test 2: Profile
        Write-Host "2️⃣ Testing Profile Endpoint" -ForegroundColor Yellow
        Write-Host "GET $API_URL/auth/profile" -ForegroundColor Gray
        Write-Host "Header: Authorization: Bearer $token" -ForegroundColor Gray
        Write-Host ""

        try {
            $profileResponse = Invoke-RestMethod -Uri "$API_URL/auth/profile" `
                -Method GET `
                -Headers @{
                    "Content-Type" = "application/json"
                    "Authorization" = "Bearer $token"
                }

            Write-Host "Response:" -ForegroundColor Green
            $profileResponse | ConvertTo-Json | Write-Host
            Write-Host ""

            if ($profileResponse.id) {
                Write-Host "✅ Profile endpoint works!" -ForegroundColor Green
            }
        } catch {
            Write-Host "❌ Profile endpoint failed!" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Login failed! No token received" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  1. Server is not running" -ForegroundColor Gray
    Write-Host "  2. IP address is incorrect" -ForegroundColor Gray
    Write-Host "  3. User doesn't exist in database" -ForegroundColor Gray
    Write-Host "  4. Wrong password" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Fix:" -ForegroundColor Yellow
    Write-Host "  1. Check server is running on port 3000" -ForegroundColor Gray
    Write-Host "  2. Update API_URL variable with correct IP" -ForegroundColor Gray
    Write-Host "  3. Use correct credentials" -ForegroundColor Gray
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✨ Test complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
