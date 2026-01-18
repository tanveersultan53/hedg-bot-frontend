# Simplified API - Just 2 Endpoints!

## ✅ What Changed

**Before:** 6 complex endpoints with sessions, tokens, multiple API calls
**Now:** 2 simple endpoints - clean and easy!

---

## 🎯 Simple Flow

```
1. User opens Telegram Bot
   ↓
   Frontend calls: POST /api/check-user/ with telegram_id
   ↓
   - If user exists → Return token → Auto redirect to platform
   - If new user → Return "new_user" → Show onboarding

2. New user goes through:
   - Splash screen
   - Wheel spin (frontend only - no API)
   - Form (collect details)
   ↓
   Frontend calls: POST /api/signup/ with ALL data
   (telegram info + form data + reward)
   ↓
   Backend creates user, calls webtrader API, returns token
   ↓
   Redirect to platform
```

---

## 📡 API Endpoints

### 1. POST `/api/onboarding/check-user/`

**Purpose:** Check if telegram user already signed up

**Request:**
```json
{
  "telegram_id": 1212228340
}
```

**Response (Existing user):**
```json
{
  "status": "existing_user",
  "token": "webtrader_token_xyz",
  "redirect_url": "https://trader.hedg.com?token=xyz",
  "user": {
    "full_name": "Muhammad Tanveer Sultan",
    "email": "info@devzenix.com"
  }
}
```

**Response (New user):**
```json
{
  "status": "new_user"
}
```

---

### 2. POST `/api/onboarding/signup/`

**Purpose:** Complete signup with all user data in one call

**Request:**
```json
{
  "telegram_id": 1212228340,
  "telegram_username": "Muhamma153",
  "first_name": "Muhammad",
  "last_name": "Tanveer",
  "language_code": "en",
  "photo_url": "https://...",
  "full_name": "Muhammad Tanveer Sultan",
  "email": "info@devzenix.com",
  "phone_number": "1111111111",
  "country": "US",
  "country_code": "+1",
  "reward": {
    "name": "Risk-free credit",
    "description": "100 units"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Registration completed successfully!",
  "token": "webtrader_token_xyz",
  "redirect_url": "https://trader.hedg.com?token=xyz",
  "user_id": "123"
}
```

**Error Response (Already registered):**
```json
{
  "error": "User already registered",
  "status": "existing_user",
  "redirect_url": "https://trader.hedg.com?token=xyz"
}
```

---

## 🔥 Benefits

✅ **Much simpler** - 2 endpoints instead of 6
✅ **No session management** - No tokens, no session tracking
✅ **One API call** - All signup data sent at once
✅ **Frontend controls wheel** - No backend needed for spin
✅ **Easier to maintain** - Less code, less complexity
✅ **Faster** - Fewer API calls = faster onboarding

---

## 🧪 Testing

### Test with curl:

**1. Check user (new user):**
```bash
curl -X POST http://localhost:8000/api/onboarding/check-user/ \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 999999999}'
```

Expected: `{"status": "new_user"}`

**2. Signup:**
```bash
curl -X POST http://localhost:8000/api/onboarding/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 999999999,
    "email": "test@example.com",
    "full_name": "Test User",
    "phone_number": "1234567890",
    "country": "US",
    "reward": {"name": "Welcome bonus", "description": "$50"}
  }'
```

**3. Check user again (should be existing):**
```bash
curl -X POST http://localhost:8000/api/onboarding/check-user/ \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 999999999}'
```

Expected: `{"status": "existing_user", "token": "...", "redirect_url": "..."}`

---

## 🚀 Next Steps

1. **Start backend:**
   ```bash
   cd /Users/muhammad/Documents/Sultan/hedg-bot-backend
   python manage.py runserver
   ```

2. **Update frontend .env:**
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

3. **Test in Telegram:**
   - Use ngrok for frontend
   - Open bot in Telegram
   - Watch console logs!

---

## 📝 What Got Removed

- ❌ Session tokens
- ❌ Session database tracking
- ❌ Multiple API calls during onboarding
- ❌ Update status endpoints
- ❌ Separate spin endpoint
- ❌ Complex session management

---

## 🎯 Summary

**Old way:**
```
/start → session_token → /spin → /update-status → /submit → done
```

**New way:**
```
/check-user → /signup → done ✅
```

Much better! 🚀
