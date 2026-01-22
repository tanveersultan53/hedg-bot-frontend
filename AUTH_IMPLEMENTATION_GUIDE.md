# Authentication Implementation Guide for HEDG-Bot Frontend

## Overview

This guide provides step-by-step instructions for adding authentication to the hedg-bot-frontend, with three implementation options ranging from minimal to enterprise-grade.

---

## Option 1: MINIMAL IMPLEMENTATION (Recommended for MVP)

**Scope:** Token storage and basic persistence  
**Effort:** 2-3 hours  
**Files to Create:** 1 new file  
**Files to Modify:** 2 existing files  

### Implementation Steps

#### Step 1: Create Auth Service
**File:** `src/services/authService.js` (NEW)

```javascript
// Token storage utilities
export const authService = {
  // Store token in localStorage
  setToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    }
  },

  // Retrieve token from localStorage
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Check if token exists
  hasToken() {
    return !!localStorage.getItem('authToken');
  },

  // Clear token (logout)
  clearToken() {
    localStorage.removeItem('authToken');
  },

  // Optional: Validate token (check expiry, format)
  isValidToken(token) {
    if (!token) return false;
    // Add your validation logic here
    // For now, just check if it's not empty
    return token.length > 0;
  }
};

export default authService;
```

#### Step 2: Update API Service with Interceptors
**File:** `src/services/api.js` (MODIFY)

```javascript
import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/onboarding`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Store token from response
api.interceptors.response.use(
  (response) => {
    // Store token if present in response
    if (response.data.token) {
      authService.setToken(response.data.token);
      console.log('Token stored from response');
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      authService.clearToken();
      // Could redirect to login here if needed
      console.log('Token expired, cleared');
    }
    return Promise.reject(error);
  }
);

export const onboardingAPI = {
  checkUser: (telegramId) => {
    return api.post('/check-user', { telegram_id: telegramId });
  },

  signup: (userData) => {
    return api.post('/signup', userData);
  },
};

export default api;
```

#### Step 3: Update App.js to Use Token
**File:** `src/App.js` (MODIFY)

Add this import at the top:
```javascript
import { authService } from './services/authService';
```

Update the `useEffect` in App.js:
```javascript
useEffect(() => {
  console.log('🎯 App mounted - Initializing Telegram WebApp...');

  WebApp.ready();
  WebApp.expand();

  // NEW: Check for existing token
  const existingToken = authService.getToken();
  if (existingToken && authService.isValidToken(existingToken)) {
    console.log('✅ Valid token found, skipping user check');
    // You can either skip the check-user call or proceed with verification
    // For safety, still verify with backend but you could redirect if you trust the token
    initializeOnboarding();
    return;
  }

  initializeOnboarding();
}, []);

// Update handleFormSubmit to store token
const handleFormSubmit = async (formData) => {
  console.log('📝 Form submission started...');
  setLoading(true);
  setError(null);

  const completeData = {
    ...formData,
    ...(telegramUserData || {}),
    reward: reward,
  };

  try {
    if (telegramUserData) {
      console.log('📤 Calling signup API...');
      const response = await onboardingAPI.signup(completeData);

      console.log('📥 Signup response:', response.data);
      
      // NEW: Store token if present
      if (response.data.token) {
        authService.setToken(response.data.token);
        console.log('✅ Auth token stored');
      }

      console.log('🔗 Redirect URL:', response.data.redirect_url);
      setRedirectUrl(response.data.redirect_url);
    } else {
      console.log('🎮 Demo mode: Signup with complete data:', completeData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUrl = 'https://hedg.com/platform';
      console.log('🔗 Mock redirect URL:', mockUrl);
      setRedirectUrl(mockUrl);
    }

    console.log('✅ Moving to success screen');
    setCurrentFrame('success');
  } catch (err) {
    console.error('❌ Error during signup:', err);
    const errorMessage = err.response?.data?.message ||
                        err.response?.data?.error ||
                        'Unable to complete signup. Please try again.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
```

### Testing Minimal Implementation

1. Sign up a new user
2. Check browser DevTools → Application → localStorage
3. Should see `authToken` key with JWT value
4. Reload the page
5. Token should be sent with next API request
6. Inspect Network tab to see `Authorization: Bearer {token}` header

---

## Option 2: COMPREHENSIVE IMPLEMENTATION (Recommended for Production)

**Scope:** Full auth system with Context API  
**Effort:** 5-7 hours  
**Files to Create:** 3 new files + 1 hook  
**Files to Modify:** 3 existing files  

### Implementation Steps

#### Step 1: Create Auth Context
**File:** `src/context/AuthContext.js` (NEW)

```javascript
import React, { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const storedToken = authService.getToken();
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = useCallback((token, userData = null) => {
    authService.setToken(token);
    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    console.log('User logged in');
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.clearToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out');
  }, []);

  // Update user info
  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const value = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Step 2: Create useAuth Hook
**File:** `src/hooks/useAuth.js` (NEW)

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
```

#### Step 3: Update API Service
**File:** `src/services/api.js` (MODIFY - same as Option 1)

#### Step 4: Update App.js
**File:** `src/App.js` (MODIFY)

```javascript
import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';

import SplashScreen from './pages/SplashScreen';
import WheelPrompt from './pages/WheelPrompt';
import SpinningWheel from './pages/SpinningWheel';
import RewardForm from './pages/RewardForm';
import SuccessScreen from './pages/SuccessScreen';

import { onboardingAPI } from './services/api';
import { useAuth } from './hooks/useAuth';

function App() {
  const { login } = useAuth();
  
  // ... rest of existing state and logic

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    const completeData = {
      ...formData,
      ...(telegramUserData || {}),
      reward: reward,
    };

    try {
      if (telegramUserData) {
        const response = await onboardingAPI.signup(completeData);

        // Store token using auth context
        if (response.data.token) {
          login(response.data.token, response.data.user);
        }

        setRedirectUrl(response.data.redirect_url);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRedirectUrl('https://hedg.com/platform');
      }

      setCurrentFrame('success');
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err.response?.data?.message || 'Unable to complete signup');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

#### Step 5: Update index.js to Wrap with Provider
**File:** `src/index.js` (MODIFY)

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
```

---

## Option 3: ENTERPRISE IMPLEMENTATION

**Scope:** Production-grade with advanced features  
**Effort:** 10-15 hours  
**Includes:**
- Token refresh mechanism
- Role-based access control
- Session recovery
- Error boundaries
- Protected routes
- Logout functionality

### Additional Files Needed

```
src/
├── context/
│   ├── AuthContext.js
│   └── ErrorBoundary.js (NEW)
├── hooks/
│   ├── useAuth.js
│   ├── useProtectedRoute.js (NEW)
│   └── useTokenRefresh.js (NEW)
├── utils/
│   └── tokenUtils.js (NEW)
├── components/
│   ├── ProtectedRoute.jsx (NEW)
│   ├── LogoutButton.jsx (NEW)
│   └── TokenRefresh.jsx (NEW)
└── services/
    └── api.js (enhanced with refresh logic)
```

---

## General Recommendations

### 1. Where to Store Tokens

| Storage Type | Pros | Cons | Use Case |
|---|---|---|---|
| localStorage | Persists across sessions | Vulnerable to XSS | Default choice for SPAs |
| sessionStorage | Clears on tab close | Lost on page refresh | Short-lived tokens |
| Memory | Most secure | Lost on refresh | Refresh token storage |
| Cookies | httpOnly option available | CSRF vulnerability | With proper CORS setup |

**Recommendation:** Use localStorage for access tokens + refresh tokens

### 2. Token Structure

Expect JWT format from backend:
```
header.payload.signature
```

Where payload contains:
```json
{
  "user_id": 123,
  "telegram_id": 456,
  "exp": 1234567890,
  "iat": 1234567800
}
```

### 3. Token Expiration Handling

Add token refresh before/after expiry:
```javascript
// Check if token expires in next 5 minutes
const willExpireSoon = (token) => {
  const decoded = jwt_decode(token);
  const expiresIn = decoded.exp * 1000 - Date.now();
  return expiresIn < 5 * 60 * 1000; // 5 minutes
};
```

### 4. API Response Expected Format

Backend should return:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 123,
    "telegram_id": 456,
    "email": "user@example.com"
  },
  "redirect_url": "https://platform.hedg.com"
}
```

### 5. Error Handling Strategy

```javascript
// 401 - Token invalid/expired
// Action: Clear token, show login

// 403 - Token valid but no permission
// Action: Show error, keep token

// 429 - Rate limited
// Action: Show error, retry later

// 500 - Server error
// Action: Show error, could retry
```

### 6. Security Best Practices

- Never log tokens to console in production
- Use httpOnly cookies if backend supports (prevents XSS)
- Implement token refresh before expiry
- Clear tokens on logout
- Never store sensitive data in state (lost on refresh)
- Validate tokens on backend for all API calls
- Use HTTPS only
- Implement CORS properly

---

## Testing Authentication

### Manual Testing Checklist

- [ ] User signs up → token stored in localStorage
- [ ] Page refresh → token persists in localStorage
- [ ] Next API call includes Authorization header
- [ ] Token appears in Network tab requests
- [ ] Invalid token triggers 401 error
- [ ] Logout clears token from localStorage
- [ ] API call without token fails (if protected)
- [ ] Expired token shows error and clears

### Automated Testing Example

```javascript
// __tests__/authService.test.js
import authService from '../services/authService';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('setToken stores token in localStorage', () => {
    const token = 'test-token-123';
    authService.setToken(token);
    expect(authService.getToken()).toBe(token);
  });

  test('clearToken removes token from localStorage', () => {
    authService.setToken('test-token');
    authService.clearToken();
    expect(authService.getToken()).toBeNull();
  });

  test('hasToken returns correct boolean', () => {
    expect(authService.hasToken()).toBe(false);
    authService.setToken('token');
    expect(authService.hasToken()).toBe(true);
  });
});
```

---

## Common Pitfalls to Avoid

1. **Storing sensitive data in state** - Lost on refresh
2. **Not handling 401 errors** - User stuck in authenticated state
3. **Missing CORS headers** - API calls fail from browser
4. **Token not in request headers** - Backend can't authenticate
5. **Not clearing token on error** - User stays logged in when shouldn't
6. **Race conditions** - Multiple simultaneous token refreshes
7. **Hardcoding tokens** - Security risk in code
8. **Not validating tokens** - Invalid tokens accepted

---

## Migration Path

### Phase 1: Implement Option 1 (Week 1)
- Add token storage
- Update API service with interceptors
- Test locally
- Deploy and monitor

### Phase 2: Implement Option 2 (Week 2-3)
- Create AuthContext
- Add useAuth hook
- Refactor App.js
- Add protected routes

### Phase 3: Implement Option 3 (Week 4+)
- Add token refresh mechanism
- Implement logout
- Add role-based access
- Add error boundaries

---

## Questions to Ask Backend Team

1. What format is the auth token? (JWT, opaque string, etc.)
2. How long do tokens expire? (15 min, 1 hour, 1 day, etc.)
3. Do you support refresh tokens? If so, how?
4. What's the exact response format from /signup endpoint?
5. Should Authorization header use "Bearer" or something else?
6. Any rate limiting on auth endpoints?
7. Do you support CORS? What origins?
8. Any special requirements for token validation?

---

## Files Summary

### Minimal Implementation (Option 1)
```
NEW:
- src/services/authService.js

MODIFY:
- src/services/api.js
- src/App.js
```

### Comprehensive Implementation (Option 2)
```
NEW:
- src/services/authService.js
- src/context/AuthContext.js
- src/hooks/useAuth.js

MODIFY:
- src/services/api.js
- src/App.js
- src/index.js
```

### Enterprise Implementation (Option 3)
```
NEW:
- src/context/AuthContext.js
- src/context/ErrorBoundary.js
- src/hooks/useAuth.js
- src/hooks/useProtectedRoute.js
- src/hooks/useTokenRefresh.js
- src/utils/tokenUtils.js
- src/components/ProtectedRoute.jsx
- src/components/LogoutButton.jsx
- src/components/TokenRefresh.jsx

MODIFY:
- src/services/api.js
- src/App.js
- src/index.js
- All page components (optional)
```

---

## Resources

- [JWT.io](https://jwt.io) - JWT explanation and debugger
- [Axios Interceptors](https://axios-http.com/docs/interceptors) - Request/response interceptors
- [React Context API](https://react.dev/reference/react/useContext) - State management
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - Browser storage

---

## Next Steps

1. Choose implementation option (recommend Option 1 for MVP)
2. Review with backend team for token format/expiry
3. Create authService.js file
4. Update api.js with interceptors
5. Update App.js to handle tokens
6. Test thoroughly before deployment
7. Plan Phase 2 migration once Phase 1 stable

