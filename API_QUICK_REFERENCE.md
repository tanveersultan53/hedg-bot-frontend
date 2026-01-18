# API Quick Reference

Quick overview of all backend endpoints needed.

---

## Base URL: `/api/onboarding`

---

## 1. POST `/start/` - Start Onboarding

**Request:**
```json
{
  "telegram_id": 1212228340,
  "telegram_username": "Muhamma153",
  "first_name": "Muhammad",
  "last_name": "Tanveer"
}
```

**Response (New User):**
```json
{
  "status": "new_user",
  "session": {
    "session_token": "abc123xyz789"
  }
}
```

**Response (Returning User):**
```json
{
  "status": "returning_user",
  "redirect_url": "https://hedg.com/platform"
}
```

---

## 2. POST `/spin/` - Spin Wheel

**Request:**
```json
{
  "session_token": "abc123xyz789"
}
```

**Response:**
```json
{
  "reward": {
    "name": "Risk-free credit",
    "description": "100 units"
  }
}
```

---

## 3. POST `/submit/` - Submit Form

**Request:**
```json
{
  "session_token": "abc123xyz789",
  "full_name": "Muhammad Tanveer Sultan",
  "email": "info@devzenix.com",
  "phone_number": "1111111111",
  "country": "US",
  "country_code": "+1",
  "telegram_id": 1212228340,
  "telegram_username": "Muhamma153",
  "first_name": "Muhammad",
  "last_name": "Tanveer",
  "language_code": "en",
  "photo_url": "..."
}
```

**Response:**
```json
{
  "success": true,
  "redirect_url": "https://hedg.com/platform",
  "user_id": "user_12345"
}
```

---

## 4. POST `/update-status/` - Update Status (Optional)

**Request:**
```json
{
  "session_token": "abc123xyz789",
  "status": "splash_shown"
}
```

**Status values:** `splash_shown`, `spinning`, `reward_shown`

**Response:**
```json
{
  "success": true,
  "status": "splash_shown"
}
```

---

## Required Rewards

Return one of these randomly from `/spin/`:

```json
[
  {"name": "Risk-free credit", "description": "100 units"},
  {"name": "VIP onboarding", "description": "Premium access"},
  {"name": "fee discounts", "description": "50% off trading fees"},
  {"name": "welcome bonus", "description": "$50 bonus"}
]
```

---

## CORS Setup

Allow these origins:
- `https://web.telegram.org`
- `https://t.me`
- Your frontend URL

---

## Test with curl

```bash
# Start
curl -X POST http://localhost:8000/api/onboarding/start/ \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 123, "first_name": "Test"}'

# Spin
curl -X POST http://localhost:8000/api/onboarding/spin/ \
  -H "Content-Type: application/json" \
  -d '{"session_token": "YOUR_TOKEN"}'

# Submit
curl -X POST http://localhost:8000/api/onboarding/submit/ \
  -H "Content-Type: application/json" \
  -d '{"session_token": "YOUR_TOKEN", "email": "test@test.com", "telegram_id": 123}'
```

---

**See `BACKEND_API_SPEC.md` for complete details, examples, and database schema.**
