#!/bin/bash

# API Test Script for Coffee App
# Sử dụng để test API endpoints trực tiếp

# Thay đổi API_URL thành IP của bạn
API_URL="https://nonsporting-definitively-dorene.ngrok-free.dev"

echo "=========================================="
echo "☕ Coffee App API Test Script"
echo "=========================================="
echo "API URL: $API_URL"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Login
echo -e "${YELLOW}1️⃣ Testing Login Endpoint${NC}"
echo "POST $API_URL/auth/login"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extract token from response
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✅ Login successful! Token received${NC}"
  echo "Token: ${TOKEN:0:20}..."
  echo ""

  # Test 2: Profile (using token)
  echo -e "${YELLOW}2️⃣ Testing Profile Endpoint${NC}"
  echo "GET $API_URL/auth/profile"
  echo "Header: Authorization: Bearer $TOKEN"
  echo ""

  PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN")

  echo "Response:"
  echo "$PROFILE_RESPONSE" | jq '.' 2>/dev/null || echo "$PROFILE_RESPONSE"
  echo ""

  if echo "$PROFILE_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Profile endpoint works!${NC}"
  else
    echo -e "${RED}❌ Profile endpoint failed!${NC}"
  fi
else
  echo -e "${RED}❌ Login failed! No token received${NC}"
  echo "Possible issues:"
  echo "  1. Server is not running"
  echo "  2. IP address is incorrect"
  echo "  3. User doesn't exist in database"
  echo "  4. Wrong password"
  echo ""
  echo "Fix:"
  echo "  1. Check server is running on port 3000"
  echo "  2. Update API_URL variable with correct IP"
  echo "  3. Use correct credentials"
fi

echo ""
echo "=========================================="
echo "✨ Test complete!"
echo "=========================================="
