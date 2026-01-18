# Backend API Specification for HEDG Bot

Complete API specification for the backend to support the Telegram Mini App frontend.

---

## Base URL

```
Production: https://your-backend-api.com
Development: http://localhost:8000
```

All endpoints are prefixed with: `/api/onboarding`

---

## API Endpoints

### 1. Start Onboarding

**Endpoint:** `POST /api/onboarding/start/`

**Description:** Initialize onboarding for a Telegram user. Check if user is new or returning.

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "telegram_id": 1212228340,
  "telegram_username": "Muhamma153",
  "first_name": "Muhammad",
  "last_name": "Tanveer"
}
```

**Response (New User - 200 OK):**
```json
{
  "status": "new_user",
  "session": {
    "session_token": "abc123xyz789",
    "created_at": "2024-01-17T10:30:00Z"
  },
  "message": "Onboarding started"
}
```

**Response (Returning User - 200 OK):**
```json
{
  "status": "returning_user",
  "redirect_url": "https://hedg.com/platform/dashboard?token=xyz123",
  "message": "Welcome back!"
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "error": "Missing required fields",
  "details": ["telegram_id is required"]
}
```

---

### 2. Update Session Status

**Endpoint:** `POST /api/onboarding/update-status/`

**Description:** Update the current status of the onboarding session for analytics/tracking.

**Request Body:**
```json
{
  "session_token": "abc123xyz789",
  "status": "splash_shown"
}
```

**Status Values:**
- `splash_shown` - User viewed splash screen
- `spinning` - User is spinning the wheel
- `reward_shown` - Reward was displayed

**Response (200 OK):**
```json
{
  "success": true,
  "status": "splash_shown",
  "updated_at": "2024-01-17T10:31:00Z"
}
```

**Response (Error - 404 Not Found):**
```json
{
  "error": "Session not found",
  "session_token": "abc123xyz789"
}
```

---

### 3. Spin Wheel

**Endpoint:** `POST /api/onboarding/spin/`

**Description:** Spin the reward wheel and return a random reward for the user.

**Request Body:**
```json
{
  "session_token": "abc123xyz789"
}
```

**Response (200 OK):**
```json
{
  "reward": {
    "name": "Risk-free credit",
    "description": "100 units",
    "reward_id": "reward_001",
    "value": 100
  },
  "spun_at": "2024-01-17T10:32:00Z"
}
```

**Available Rewards (Choose randomly):**
```json
[
  {
    "name": "Risk-free credit",
    "description": "100 units",
    "reward_id": "reward_001",
    "value": 100
  },
  {
    "name": "VIP onboarding",
    "description": "Premium access",
    "reward_id": "reward_002",
    "value": 0
  },
  {
    "name": "fee discounts",
    "description": "50% off trading fees",
    "reward_id": "reward_003",
    "value": 50
  },
  {
    "name": "welcome bonus",
    "description": "$50 bonus",
    "reward_id": "reward_004",
    "value": 50
  }
]
```

**Response (Error - 404 Not Found):**
```json
{
  "error": "Session not found"
}
```

**Response (Error - 409 Conflict):**
```json
{
  "error": "Wheel already spun for this session",
  "existing_reward": {
    "name": "Risk-free credit",
    "description": "100 units"
  }
}
```

---

### 4. Submit Registration Form

**Endpoint:** `POST /api/onboarding/submit/`

**Description:** Submit the final registration form with user details and Telegram data.

**Request Body:**
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
  "photo_url": "https://t.me/i/userpic/320/..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "redirect_url": "https://hedg.com/platform/dashboard?token=xyz123",
  "user_id": "user_12345",
  "message": "Registration completed successfully"
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email format"],
    "phone_number": ["Phone number is required"]
  }
}
```

**Response (Error - 404 Not Found):**
```json
{
  "error": "Session not found"
}
```

**Response (Error - 409 Conflict):**
```json
{
  "error": "User already registered",
  "telegram_id": 1212228340
}
```

---

### 5. Get Session Status

**Endpoint:** `GET /api/onboarding/session/{session_token}/`

**Description:** Get the current status of an onboarding session (optional endpoint for debugging).

**Response (200 OK):**
```json
{
  "session_token": "abc123xyz789",
  "telegram_id": 1212228340,
  "status": "reward_shown",
  "reward": {
    "name": "Risk-free credit",
    "description": "100 units"
  },
  "created_at": "2024-01-17T10:30:00Z",
  "updated_at": "2024-01-17T10:32:00Z"
}
```

---

### 6. Auto Login

**Endpoint:** `POST /api/onboarding/auto-login/`

**Description:** Auto-login a returning Telegram user (optional - for future use).

**Request Body:**
```json
{
  "telegram_id": 1212228340
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "redirect_url": "https://hedg.com/platform/dashboard?token=xyz123",
  "user_id": "user_12345"
}
```

**Response (Error - 404 Not Found):**
```json
{
  "error": "User not found",
  "telegram_id": 1212228340
}
```

---

## CORS Configuration

**Required CORS Headers:**

Your backend must allow requests from:
- `https://web.telegram.org`
- `https://t.me`
- Your ngrok/deployed frontend URL

**Example (Django):**
```python
CORS_ALLOWED_ORIGINS = [
    "https://web.telegram.org",
    "https://t.me",
    "https://your-frontend.vercel.app",
    "https://your-ngrok-url.ngrok-free.app",
]

CORS_ALLOW_CREDENTIALS = True
```

**Example (Express.js):**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://web.telegram.org',
    'https://t.me',
    'https://your-frontend.vercel.app',
    'https://your-ngrok-url.ngrok-free.app'
  ],
  credentials: true
}));
```

---

## Database Schema (Suggested)

### OnboardingSession Table
```sql
CREATE TABLE onboarding_sessions (
  id SERIAL PRIMARY KEY,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  telegram_id BIGINT NOT NULL,
  telegram_username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'started',
  reward_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  telegram_username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  language_code VARCHAR(10),
  photo_url TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(50),
  country VARCHAR(2),
  country_code VARCHAR(10),
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Rewards Table
```sql
CREATE TABLE rewards (
  id SERIAL PRIMARY KEY,
  reward_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(10, 2),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Error Handling

All errors should return appropriate HTTP status codes:

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request (validation errors) |
| 401 | Unauthorized |
| 404 | Resource Not Found |
| 409 | Conflict (duplicate entry) |
| 500 | Internal Server Error |

**Standard Error Response Format:**
```json
{
  "error": "Error message",
  "details": "Additional details or validation errors",
  "timestamp": "2024-01-17T10:30:00Z"
}
```

---

## Security Considerations

### 1. Validate Telegram Data

**Important:** Verify the Telegram data is legitimate using the hash provided by Telegram:

```python
# Python example
import hmac
import hashlib

def validate_telegram_data(init_data, bot_token):
    """Validate Telegram WebApp data"""
    # Parse the init_data
    # Check the hash matches
    # Verify auth_date is recent (< 1 hour old)
    pass
```

### 2. Session Token Generation

Use secure random tokens:
```python
import secrets
session_token = secrets.token_urlsafe(32)
```

### 3. Rate Limiting

Implement rate limiting to prevent abuse:
- Max 10 requests per minute per IP
- Max 1 spin per session

### 4. Input Validation

Validate all inputs:
- Email format
- Phone number format
- Country code exists
- Session token exists

---

## Example Implementation (Python/Django)

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import secrets
import random

@csrf_exempt
@require_http_methods(["POST"])
def start_onboarding(request):
    """Start onboarding for Telegram user"""
    try:
        data = json.loads(request.body)
        telegram_id = data.get('telegram_id')

        # Check if user exists
        user = User.objects.filter(telegram_id=telegram_id).first()

        if user:
            # Returning user
            return JsonResponse({
                'status': 'returning_user',
                'redirect_url': f'https://hedg.com/platform/dashboard?user={user.id}',
                'message': 'Welcome back!'
            })

        # New user - create session
        session_token = secrets.token_urlsafe(32)
        session = OnboardingSession.objects.create(
            session_token=session_token,
            telegram_id=telegram_id,
            telegram_username=data.get('telegram_username'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            status='started'
        )

        return JsonResponse({
            'status': 'new_user',
            'session': {
                'session_token': session_token,
                'created_at': session.created_at.isoformat()
            },
            'message': 'Onboarding started'
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def spin_wheel(request):
    """Spin the reward wheel"""
    try:
        data = json.loads(request.body)
        session_token = data.get('session_token')

        session = OnboardingSession.objects.get(session_token=session_token)

        # Check if already spun
        if session.reward_id:
            return JsonResponse({
                'error': 'Wheel already spun',
                'existing_reward': get_reward_by_id(session.reward_id)
            }, status=409)

        # Get random reward
        rewards = [
            {'name': 'Risk-free credit', 'description': '100 units', 'reward_id': 'reward_001'},
            {'name': 'VIP onboarding', 'description': 'Premium access', 'reward_id': 'reward_002'},
            {'name': 'fee discounts', 'description': '50% off trading fees', 'reward_id': 'reward_003'},
            {'name': 'welcome bonus', 'description': '$50 bonus', 'reward_id': 'reward_004'},
        ]
        reward = random.choice(rewards)

        # Save reward to session
        session.reward_id = reward['reward_id']
        session.save()

        return JsonResponse({
            'reward': reward,
            'spun_at': session.updated_at.isoformat()
        })

    except OnboardingSession.DoesNotExist:
        return JsonResponse({'error': 'Session not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def submit_form(request):
    """Submit final registration form"""
    try:
        data = json.loads(request.body)
        session_token = data.get('session_token')

        session = OnboardingSession.objects.get(session_token=session_token)

        # Create user
        user = User.objects.create(
            telegram_id=data.get('telegram_id'),
            telegram_username=data.get('telegram_username'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            language_code=data.get('language_code'),
            photo_url=data.get('photo_url'),
            email=data.get('email'),
            phone_number=data.get('phone_number'),
            country=data.get('country'),
            country_code=data.get('country_code'),
            full_name=data.get('full_name')
        )

        # Mark session as completed
        session.status = 'completed'
        session.save()

        return JsonResponse({
            'success': True,
            'redirect_url': f'https://hedg.com/platform/dashboard?user={user.id}',
            'user_id': str(user.id),
            'message': 'Registration completed successfully'
        })

    except OnboardingSession.DoesNotExist:
        return JsonResponse({'error': 'Session not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def update_status(request):
    """Update session status"""
    try:
        data = json.loads(request.body)
        session_token = data.get('session_token')
        status = data.get('status')

        session = OnboardingSession.objects.get(session_token=session_token)
        session.status = status
        session.save()

        return JsonResponse({
            'success': True,
            'status': status,
            'updated_at': session.updated_at.isoformat()
        })

    except OnboardingSession.DoesNotExist:
        return JsonResponse({'error': 'Session not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
```

---

## Example Implementation (Node.js/Express)

```javascript
// routes.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Start onboarding
router.post('/api/onboarding/start/', async (req, res) => {
  try {
    const { telegram_id, telegram_username, first_name, last_name } = req.body;

    // Check if user exists
    const user = await User.findOne({ telegram_id });

    if (user) {
      return res.json({
        status: 'returning_user',
        redirect_url: `https://hedg.com/platform/dashboard?user=${user._id}`,
        message: 'Welcome back!'
      });
    }

    // Create new session
    const session_token = crypto.randomBytes(32).toString('hex');
    const session = await OnboardingSession.create({
      session_token,
      telegram_id,
      telegram_username,
      first_name,
      last_name,
      status: 'started'
    });

    res.json({
      status: 'new_user',
      session: {
        session_token,
        created_at: session.created_at
      },
      message: 'Onboarding started'
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Spin wheel
router.post('/api/onboarding/spin/', async (req, res) => {
  try {
    const { session_token } = req.body;

    const session = await OnboardingSession.findOne({ session_token });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if already spun
    if (session.reward_id) {
      return res.status(409).json({
        error: 'Wheel already spun',
        existing_reward: await getReward(session.reward_id)
      });
    }

    // Random reward
    const rewards = [
      { name: 'Risk-free credit', description: '100 units', reward_id: 'reward_001' },
      { name: 'VIP onboarding', description: 'Premium access', reward_id: 'reward_002' },
      { name: 'fee discounts', description: '50% off trading fees', reward_id: 'reward_003' },
      { name: 'welcome bonus', description: '$50 bonus', reward_id: 'reward_004' }
    ];

    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    session.reward_id = reward.reward_id;
    await session.save();

    res.json({
      reward,
      spun_at: session.updated_at
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit form
router.post('/api/onboarding/submit/', async (req, res) => {
  try {
    const {
      session_token,
      telegram_id,
      telegram_username,
      first_name,
      last_name,
      language_code,
      photo_url,
      email,
      phone_number,
      country,
      country_code,
      full_name
    } = req.body;

    const session = await OnboardingSession.findOne({ session_token });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create user
    const user = await User.create({
      telegram_id,
      telegram_username,
      first_name,
      last_name,
      language_code,
      photo_url,
      email,
      phone_number,
      country,
      country_code,
      full_name
    });

    session.status = 'completed';
    await session.save();

    res.json({
      success: true,
      redirect_url: `https://hedg.com/platform/dashboard?user=${user._id}`,
      user_id: user._id,
      message: 'Registration completed successfully'
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Testing the API

Use curl or Postman to test:

```bash
# 1. Start onboarding
curl -X POST http://localhost:8000/api/onboarding/start/ \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 1212228340,
    "telegram_username": "Muhamma153",
    "first_name": "Muhammad",
    "last_name": "Tanveer"
  }'

# 2. Spin wheel
curl -X POST http://localhost:8000/api/onboarding/spin/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_token": "YOUR_SESSION_TOKEN_HERE"
  }'

# 3. Submit form
curl -X POST http://localhost:8000/api/onboarding/submit/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_token": "YOUR_SESSION_TOKEN_HERE",
    "telegram_id": 1212228340,
    "email": "test@example.com",
    "phone_number": "1234567890",
    "country": "US",
    "full_name": "Test User"
  }'
```

---

## Next Steps

1. Choose your backend framework (Django, Express, Flask, etc.)
2. Set up database (PostgreSQL, MySQL, MongoDB)
3. Implement the endpoints above
4. Configure CORS
5. Deploy backend to Railway/Render/Heroku
6. Update frontend `.env` with backend URL
7. Test end-to-end flow

---

**Questions? Let me know which backend framework you're using and I can provide more specific code!**
