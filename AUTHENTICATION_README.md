# Authentication Integration - Frontend

This document describes the authentication system integrated into the hedg-bot-frontend application.

## Overview

The frontend now supports email/password authentication with automatic session restoration using cookies. The authentication flow integrates with the Web Trader API through the Django backend.

## Architecture

### Authentication Flow

```
1. App Load → Check Auth Status
   ├─ Has customer data in localStorage? → Authenticated ✓
   ├─ Has auth_id cookie? → Call autologin → Authenticated ✓
   └─ Neither? → Show Login Page

2. Login Page
   ├─ User enters email + password
   ├─ Call POST /api/auth/login
   ├─ Backend calls Web Trader API
   ├─ Receive response + cookies (sid, auth_id)
   └─ Store customer data + access_token → Authenticated ✓

3. Session Management
   ├─ sid cookie: Active session (httpOnly)
   ├─ auth_id cookie: Long-term (30 days, httpOnly)
   └─ localStorage: customer data, access_token
```

## File Structure

```
src/
├── services/
│   ├── authService.js       # Authentication service (login, autologin, logout)
│   └── api.js               # Updated with withCredentials: true
├── pages/
│   └── LoginPage/
│       ├── LoginPage.jsx    # Login form component
│       ├── LoginPage.css    # Styling matching app design
│       └── index.jsx        # Export
└── App.js                   # Updated with auth state management
```

## Components

### 1. Authentication Service (`src/services/authService.js`)

**Functions:**
- `login(email, password, brandId, systemId)` - Login with credentials
- `autologin(brandId, systemId)` - Auto-login using auth_id cookie
- `logout()` - Clear local storage
- `isAuthenticated()` - Check if user has valid session
- `getCustomer()` - Get current customer data
- `getAccessToken()` - Get stored access token
- `checkAuthStatus()` - Check auth status on app load

**Example Usage:**
```javascript
import authService from './services/authService';

// Login
const response = await authService.login('test@example.com', 'password123');

// Check authentication
const isAuth = authService.isAuthenticated();

// Get customer
const customer = authService.getCustomer();

// Logout
authService.logout();
```

### 2. Login Page Component (`src/pages/LoginPage/LoginPage.jsx`)

A full-page login form with:
- Email and password inputs
- Form validation
- Loading states
- Error handling
- Consistent styling with existing pages

**Props:**
- `onLoginSuccess(response)` - Callback when login succeeds

**Example:**
```javascript
<LoginPage onLoginSuccess={(response) => {
  console.log('Logged in:', response);
  // Handle post-login logic
}} />
```

### 3. App.js Updates

**New State:**
```javascript
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [customer, setCustomer] = useState(null);
```

**New Frame:**
- Added `'login'` to frame states

**New Functions:**
- `checkAuthentication()` - Runs on app mount
- `handleLoginSuccess(response)` - Handles successful login

**Flow:**
```javascript
App Mount
  → checkAuthentication()
    ├─ Authenticated → initializeOnboarding()
    └─ Not Authenticated → Show Login Page

Login Success
  → handleLoginSuccess()
    → Set customer & isAuthenticated
    → initializeOnboarding()
```

## API Integration

### Backend Endpoints

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "brand_id": "HEDG",
  "system_id": "web"
}

Response:
{
  "customer": {
    "cid": 11126,
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "brand_id": "HEDG",
    "status_id": "active"
  },
  "expires_at": "2026-01-22T15:26:32.243Z",
  "session_status": "active",
  "session_mode": "customer",
  "access_token": "JWT_TOKEN"
}

Cookies Set:
- sid (session cookie)
- auth_id (30-day cookie)
```

**Auto Login:**
```http
POST /api/auth/autologin
Content-Type: application/json
Cookie: auth_id=<cookie_value>

{
  "brand_id": "HEDG",
  "system_id": "web"
}

Response:
{
  "customer": { ... },
  "expires_at": "2026-01-22T15:26:32.243Z",
  "session_status": "active",
  "session_mode": "customer"
}

Cookies Set:
- sid (new session cookie)
```

### CORS Configuration

The frontend uses `withCredentials: true` to send/receive cookies:

```javascript
// In authService.js and api.js
const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true, // Enable cookie handling
});
```

**Backend CORS settings required:**
```python
# settings.py
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

## Local Storage

The frontend stores the following in localStorage:

```javascript
{
  "access_token": "JWT_TOKEN",
  "customer": {
    "cid": 11126,
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "brand_id": "HEDG",
    "status_id": "active"
  }
}
```

## Cookie Management

**Cookies are httpOnly** (cannot be accessed via JavaScript):
- `sid` - Session cookie, short-lived
- `auth_id` - Long-term cookie (30 days)

These cookies are automatically sent with every request to the backend when `withCredentials: true` is set.

## Testing

### Manual Testing

1. **Start Backend:**
   ```bash
   cd hedg-bot-backend
   ./venv/bin/python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   cd hedg-bot-frontend
   npm start
   ```

3. **Test Login:**
   - Navigate to http://localhost:3000
   - Should see Login Page
   - Enter credentials:
     - Email: test@protonixltd.com
     - Password: Qwerty12345@
   - Click "Sign In"
   - Should authenticate and proceed to onboarding

4. **Test Auto-Login:**
   - Refresh the page
   - Should automatically authenticate without showing login
   - This works because auth_id cookie persists

5. **Test Logout:**
   - Open console: `authService.logout()`
   - Refresh page
   - Should show login page again

### Test Credentials

Use the credentials from the API documentation:
- **Email:** test@protonixltd.com
- **Password:** Qwerty12345@
- **Brand ID:** HEDG
- **System ID:** web

## Error Handling

### Login Errors

```javascript
// Invalid credentials
{
  "error": "Invalid credentials"
}

// Network error
{
  "error": "Failed to connect to authentication service"
}

// Backend error
{
  "error": "Authentication service error"
}
```

The LoginPage component displays these errors to the user in a styled error banner.

### Auto-Login Errors

If autologin fails (expired/invalid auth_id cookie), the app gracefully falls back to showing the login page.

## Security Considerations

1. **HttpOnly Cookies:** Session cookies are httpOnly, preventing XSS attacks
2. **SameSite:** Cookies use SameSite=Lax to prevent CSRF
3. **CORS:** Specific origins allowed, not wildcard when credentials enabled
4. **HTTPS:** In production, use HTTPS and set `secure: true` on cookies
5. **Token Storage:** Access token in localStorage (consider using sessionStorage for more security)

## Production Deployment

### Frontend Changes

1. Update `.env`:
   ```
   REACT_APP_API_URL=https://api.yourdomain.com
   ```

2. Build:
   ```bash
   npm run build
   ```

### Backend Changes

1. Update `settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       'https://yourdomain.com',
   ]

   # In views.py, ensure secure=True for cookies
   response.set_cookie(
       key='sid',
       value=cookies['sid'],
       httponly=True,
       secure=True,  # Requires HTTPS
       samesite='Lax'
   )
   ```

2. Use environment variable for allowed origins:
   ```python
   CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
   ```

## Troubleshooting

### Cookies Not Being Set

**Issue:** Login succeeds but cookies not set

**Solution:**
- Ensure `withCredentials: true` in axios config
- Ensure `CORS_ALLOW_CREDENTIALS = True` in backend
- Check that frontend origin is in `CORS_ALLOWED_ORIGINS`
- Verify browser allows third-party cookies

### Auto-Login Not Working

**Issue:** Refresh shows login page even with auth_id cookie

**Solution:**
- Check that cookie hasn't expired
- Verify cookie is sent in request headers (Network tab)
- Check backend autologin endpoint logs
- Ensure auth_id cookie domain matches

### CORS Errors

**Issue:** Blocked by CORS policy

**Solution:**
- Frontend origin must be in `CORS_ALLOWED_ORIGINS`
- Cannot use `CORS_ALLOW_ALL_ORIGINS = True` with credentials
- Check preflight OPTIONS request succeeds

## Future Enhancements

1. **Token Refresh:** Implement automatic token refresh
2. **Remember Me:** Add checkbox to control auth_id cookie
3. **Password Reset:** Add forgot password flow
4. **Social Login:** Add OAuth providers (Google, Facebook)
5. **Multi-Factor Auth:** Add 2FA support
6. **Session Management:** Show active sessions, allow logout from all devices

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs: `./venv/bin/python manage.py runserver`
3. Use Network tab to inspect requests/responses
4. Review CORS configuration in both frontend and backend
