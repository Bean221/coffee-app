# 🚨 Fix: "No Token Received from Server"

## ❌ Error Message

```
No token received from server
```

## 🔍 Nguyên Nhân

API response **không có field `token`**. Có 3 khả năng:

### 1️⃣ API Server Response Format Sai

```json
// ❌ WRONG - Server trả về response không có token field
{
  "success": true,
  "message": "Login successful"
  // ❌ Missing "token" field
}

// ❌ WRONG - Token ở vị trí khác
{
  "data": {
    "token": "...",  // ← Token ở đây nhưng không match interface
    "user": {...}
  }
}

// ✅ CORRECT - Token phải ở root level
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "name": "User Name"
  }
}
```

### 2️⃣ Request Body Sai

```json
// ❌ WRONG
{
  "username": "test@example.com",  // ← API expects "email"
  "pwd": "password"                // ← API expects "password"
}

// ✅ CORRECT
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3️⃣ API Server Error

- Server crash khi login
- Database connection error
- User validation error

---

## 🛠️ Solution

### Step 1: Enable Enhanced Logging

I've added better logging to show API response structure. Rebuild app:

```bash
npx expo start --clear
```

### Step 2: Test Login & Check Console

1. Open login screen
2. Click 🔧 Debug
3. Click "Test Login Flow"
4. **Check console output carefully**

### Expected Log Output (Success)

```
🧪 Testing Login API...
📧 Email: test@example.com
🌐 API URL: http://192.168.1.43:3000/api/auth/login
✅ API Response Status: 200
✅ API Response Data: {
  token: "eyJhbGciOiJIUzI1NiI...",
  user: {
    id: "123",
    email: "test@example.com",
    name: "Test User"
  }
}
✅ Login Response Structure: {
  hasToken: true,
  hasUser: true,
  responseKeys: ["token", "user"],
  token: "eyJhbGciOiJIUzI1NiI...",
  user: {...}
}
```

### Expected Log Output (Error - Missing Token)

```
🧪 Testing Login API...
📧 Email: test@example.com
🌐 API URL: http://192.168.1.43:3000/api/auth/login
✅ API Response Status: 200
✅ API Response Data: {
  success: true,
  message: "Login successful"
  // ❌ No token field!
}

❌ ERROR: Response missing 'token' field
❌ Full Response: {success: true, message: "Login successful"}
```

---

## 🔧 Fix API Server Response

If you control the API server, make sure `/auth/login` endpoint returns:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Node.js/Express Example

```javascript
// ✅ CORRECT
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate user...
  const user = await User.findOne({ email });
  if (!user || !user.validatePassword(password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate token
  const token = jwt.sign({ id: user.id }, SECRET_KEY);

  // Return with token field
  res.json({
    token: token, // ← REQUIRED
    user: {
      // ← REQUIRED
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});
```

### Python/Flask Example

```python
# ✅ CORRECT
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        'token': token,  # ← REQUIRED
        'user': {        # ← REQUIRED
            'id': user.id,
            'email': user.email,
            'name': user.name
        }
    }), 200
```

---

## 🧪 Test API with Script

### Windows PowerShell

```powershell
$response = Invoke-RestMethod -Uri "http://192.168.1.43:3000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body '{"email":"test@example.com","password":"password123"}'

$response | ConvertTo-Json | Write-Host
```

### Mac/Linux Bash

```bash
curl -X POST http://192.168.1.43:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq .
```

---

## ✅ Verification Checklist

- [ ] API returns response with `token` field at root level
- [ ] Token is a valid JWT string (not null/empty)
- [ ] Response also has `user` object (optional but recommended)
- [ ] Request body has `email` and `password` fields
- [ ] API server returns HTTP 200 on success
- [ ] No typos in field names

---

## 📋 Common Issues

### Issue 1: API Response Structure Different

```javascript
// ❌ Wrong structure
{ data: { token: "...", user: {...} } }

// ✅ Fix: Return flat structure
{ token: "...", user: {...} }
```

### Issue 2: Token Field Named Differently

```javascript
// ❌ Wrong field names
{ accessToken: "...", userData: {...} }

// ✅ Fix: Use correct names
{ token: "...", user: {...} }
```

### Issue 3: Wrapper Object

```javascript
// ❌ Wrong
{ result: { token: "...", user: {...} } }

// ✅ Fix: Remove wrapper
{ token: "...", user: {...} }
```

---

## 🎯 Next Steps

1. **Check logs** from "Test Login Flow" debug tool
2. **Look at API response** - what fields does it have?
3. **Fix API server** to return correct format
4. **Test again** with debug tool
5. **Login should work** ✅

---

## 📞 Debug Commands

### Check API directly (Windows)

```powershell
.\test-api.ps1
# Check if token field is in response
```

### Check API directly (Mac/Linux)

```bash
bash test-api.sh
# Check if token field is in response
```

### Check App Logs

1. Click 🔧 Debug in login screen
2. Click "Test Login Flow"
3. Look for "❌ ERROR: Response missing 'token' field"
4. Check what fields the response actually has

---

**Fix the API response format and login will work! 🚀**

```bash
bash test-api.sh
# Check if token field is in response
```

### Check App Logs

1. Click 🔧 Debug in login screen
2. Click "Test Login Flow"
3. Look for "❌ ERROR: Response missing 'token' field"
4. Check what fields the response actually has

---

**Fix the API response format and login will work! 🚀**
