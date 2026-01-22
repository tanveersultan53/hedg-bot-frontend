# HEDG-Bot Frontend Architecture Analysis

## Project Overview

**Project Name:** hedg-bot-frontend  
**Location:** /Users/muhammad/Documents/Sultan/hedg-bot-frontend  
**Repository Type:** Git  
**Code Lines:** ~914 lines (JavaScript/JSX + CSS)  
**Current Branch:** main  
**Status:** Production-ready (with demo mode support)

---

## 1. FRAMEWORK & TECHNOLOGY STACK

### Core Framework
- **React:** v19.2.3 (Latest)
- **React DOM:** v19.2.3
- **Build Tool:** React Scripts v5.0.1 (Create React App)
- **Runtime:** Node.js (npm/Node environment)

### Key Libraries
- **HTTP Client:** Axios v1.13.2 (for API calls)
- **UI Component Library:** react-phone-input-2 v2.15.1 (phone input)
- **Animation Library:** react-spring v10.0.3 (smooth animations)
- **Telegram SDK:** @twa-dev/sdk v8.0.2 (Telegram Mini App integration)
- **Testing:** React Testing Library v16.3.1

### Styling Approach
- **CSS:** Plain CSS (no CSS-in-JS framework)
- **Pattern:** Component-scoped CSS files (1:1 ratio with components)
- **No:** Tailwind, Styled-Components, or CSS Modules
- **Theme Colors:** Custom color palette in each CSS file

---

## 2. PROJECT STRUCTURE & FOLDER ORGANIZATION

```
src/
├── pages/                    # All screen/page components (5 main pages)
│   ├── SplashScreen/        # Frame 1 - Logo animation (3 seconds)
│   ├── WheelPrompt/         # Frame 2 - "Spin wheel" prompt
│   ├── SpinningWheel/       # Frame 3 - Wheel spinning animation
│   ├── RewardForm/          # Frame 4 - User details form
│   └── SuccessScreen/       # Frame 5 - Success & redirect
│
├── components/              # Reusable UI components
│   └── Spinner.jsx         # Generic loading spinner
│
├── services/                # API client and service layer
│   └── api.js             # Axios instance + API methods
│
├── App.js                  # Main app component (routing logic)
├── App.css                 # Global styles
├── index.js                # Entry point
└── index.css               # Base styles

public/
├── index.html              # HTML template
├── logo.svg                # Logo asset
└── assets/                 # Images (wheel, ring, pointer, spinner)
```

### Total Structure
- **Total Files:** 17 React/JS files + 8 CSS files
- **Page Components:** 5 main pages (each with folder structure)
- **Reusable Components:** 1 (Spinner)
- **Services:** 1 centralized API client
- **Entry Point:** src/index.js -> src/App.js

---

## 3. CURRENT AUTHENTICATION IMPLEMENTATION

### Current State: NO AUTHENTICATION SYSTEM

The frontend currently has **NO authentication mechanism** in place. Here's what exists:

#### Telegram Integration (Pseudo-Authentication)
```javascript
// App.js lines 23-71
useEffect(() => {
  WebApp.ready();
  WebApp.expand();
  
  const telegramUser = WebApp.initDataUnsafe?.user;
  
  if (!telegramUser) {
    // Falls back to Demo Mode (no API calls made)
    setCurrentFrame('splash');
    return;
  }
  
  // Stores Telegram user data (NOT secure - client-side only)
  setTelegramUserData({
    telegram_id: telegramUser.id,
    telegram_username: telegramUser.username,
    first_name: telegramUser.first_name,
    last_name: telegramUser.last_name,
    language_code: telegramUser.language_code,
    photo_url: telegramUser.photo_url,
  });
});
```

#### Current Data Storage
- **Telegram User Data:** Stored in React state (lost on page refresh)
- **Form Data:** Stored in component local state (lost on page refresh)
- **Session Tokens:** NO session tokens stored anywhere
- **Local Storage:** NOT USED
- **Session Storage:** NOT USED
- **Cookies:** NOT USED

#### Current User Flow
1. Extract Telegram user ID from WebApp SDK
2. Call `/api/onboarding/check-user` endpoint
3. If existing user → Redirect to platform
4. If new user → Show onboarding flow
5. No token management or session persistence

---

## 4. API CLIENT/SERVICE SETUP

### API Configuration
**File:** `/Users/muhammad/Documents/Sultan/hedg-bot-frontend/src/services/api.js`

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/onboarding`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

### Current Endpoints Called
1. **POST `/api/onboarding/check-user`** - Check if user exists
2. **POST `/api/onboarding/signup`** - Complete onboarding signup

### API Base URL Configuration
- **Environment Variable:** `REACT_APP_API_URL`
- **Current Value:** https://hedg-bot-backend-zl7gphieia-el.a.run.app (from .env)
- **Default Fallback:** http://localhost:8000

### Request/Response Handling
- Axios instance configured with default base URL
- All responses handled with try-catch blocks
- Error messages displayed in UI error banner
- No request/response interceptors currently

---

## 5. STATE MANAGEMENT APPROACH

### State Management Architecture: REACT HOOKS ONLY (No Redux/Context)

**Primary State Location:** App.js (Top-level component)

```javascript
const [currentFrame, setCurrentFrame] = useState('loading');
const [reward, setReward] = useState(null);
const [redirectUrl, setRedirectUrl] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [telegramUserData, setTelegramUserData] = useState(null);
```

### State Flow Pattern
- **Central State:** App.js manages all global state
- **Down Props:** Data passed down to child pages via props
- **Callbacks Up:** Pages call parent functions for actions
- **No Context API:** No context providers or consumers used
- **No Redux:** No Redux store or actions
- **No Zustand/MobX:** No external state manager

### State Locations by Component
| Component | State Type | Storage |
|-----------|-----------|---------|
| App.js | Global UI state | React hooks |
| RewardForm.jsx | Form data | Local component state |
| SpinningWheel.jsx | Animation state | Local component state |
| SplashScreen.jsx | Timer state | Local component state (implicit) |

### Why This Approach Works Currently
- Simple, linear flow (5 pages)
- No complex state interactions
- Single entry point (App.js)
- Prop drilling acceptable for current depth

---

## 6. WHERE API CALLS ARE MADE

### API Call Locations

#### 1. App.js - initializeOnboarding() [Lines 37-105]
```javascript
// On app load - check if user exists
const response = await onboardingAPI.checkUser(telegramUser.id);
```
- Called: On component mount (useEffect, empty dependencies)
- Purpose: Determine if new or existing user
- Response: redirect_url or status

#### 2. App.js - handleFormSubmit() [Lines 127-180]
```javascript
// On form submission - complete signup
const response = await onboardingAPI.signup(completeData);
```
- Called: When user submits RewardForm
- Purpose: Complete user onboarding with all details
- Response: redirect_url for platform

### API Call Flow Diagram
```
App.js
├── useEffect (mount) → initializeOnboarding()
│   └── onboardingAPI.checkUser() → /api/onboarding/check-user
│       ├── Existing user → redirect
│       └── New user → show splash
└── handleFormSubmit() → onboardingAPI.signup() → /api/onboarding/signup
    └── Success → show success screen + redirect
```

### Error Handling
- Try-catch blocks around all API calls
- Error messages displayed in error banner (top of page)
- Form validation before submission
- User can retry by dismissing error

---

## 7. ROUTING CONFIGURATION

### Routing Pattern: STATE-BASED FRAME ROUTING (NOT React Router)

**NO React Router Used.** Instead, uses a state machine pattern with frame states.

### Frame States
```javascript
const [currentFrame, setCurrentFrame] = useState('loading');
// Values: 'loading' | 'splash' | 'wheelPrompt' | 'spinning' | 'rewardForm' | 'success'
```

### Frame Transitions Flow
```
App Mount
    ↓
loading (initial state)
    ↓
[API Call] check-user
    ├─→ checkUser response = new_user → splash
    └─→ checkUser response = existing_user → [Redirect to platform]
    ↓
splash (3 second animation)
    ↓
wheelPrompt (user clicks "Spin")
    ↓
spinning (wheel spinning animation 5 seconds)
    ↓
rewardForm (user enters details)
    ↓
[API Call] signup
    ├─→ Success → success
    └─→ Error → [show error, stay on rewardForm]
    ↓
success (3 second countdown + redirect)
    ↓
[Redirect to platform]
```

### Frame Rendering Logic
**File:** App.js, renderFrame() method [Lines 182-226]

```javascript
const renderFrame = () => {
  switch (currentFrame) {
    case 'loading':
      return <LoadingSpinner />;
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    case 'wheelPrompt':
      return <WheelPrompt onSpin={handleSpin} />;
    case 'spinning':
      return <SpinningWheel onSpinComplete={handleSpinComplete} />;
    case 'rewardForm':
      return <RewardForm onSubmit={handleFormSubmit} />;
    case 'success':
      return <SuccessScreen redirectUrl={redirectUrl} />;
    default:
      return <SplashScreen />;
  }
};
```

### Why Not React Router?
- Linear, non-branching flow
- All pages shown in specific sequence
- No need for URL-based routing
- Simplified state management
- Better for Telegram Mini App context

### Deep Linking / URL State
- Currently NOT supported
- No URL parameters tracked
- Cannot resume from middle of flow
- Page refresh starts from loading state

---

## 8. ENVIRONMENT CONFIGURATION

### Environment Files
- **.env** - Development configuration
- **.env.production** - Production configuration

### Current Environment Variables
```
REACT_APP_API_URL=https://hedg-bot-backend-zl7gphieia-el.a.run.app
REACT_APP_BOT_USERNAME=hedg_onboarding_bot
BOT_TOKEN=8250936740:AAHAz-E9FQFf246fYl12mHOHMg0qwPjNydQ
```

### Available for Use
- `REACT_APP_*` prefix required for client-side access
- Can add new env vars as needed
- Separate .env.production for deployments

---

## 9. CURRENT FEATURES & FUNCTIONALITY

### Implemented Features
1. Telegram Mini App integration
2. User onboarding flow (5 pages)
3. Spinning wheel animation
4. Form validation (first/last name, email, phone)
5. Phone number detection by country
6. Auto-population of Telegram data into form
7. Demo mode (for testing outside Telegram)
8. Error handling and display
9. Loading states and spinners
10. Responsive design (Telegram WebApp)

### NOT Implemented
- Authentication tokens/sessions
- User login/logout
- Authorization roles/permissions
- Persistent sessions
- Protected routes
- Refresh token rotation
- API request interceptors
- API response interceptors
- Token refresh logic

---

## 10. BUILD & DEPLOYMENT

### Build Process
```bash
npm start       # Development server (port 3000)
npm build       # Production build
npm test        # Run tests
npm eject       # Eject from Create React App (irreversible)
```

### Build Output
- **Directory:** ./build
- **Size:** Optimized React app
- **Target:** Static hosting (Vercel, Firebase, Netlify, etc.)

### Current Deployment
- Backend: Google Cloud Run (hedg-bot-backend-*.a.run.app)
- Frontend: Not deployed yet (local/ngrok for testing)

---

## AUTHENTICATION INTEGRATION RECOMMENDATIONS

Based on the current architecture, here's where to add authentication:

### Option 1: MINIMAL - Token Storage (Recommended)
**Effort:** Low | **Scope:** Current flow + persistence

**Where to Add:**
1. **src/services/api.js** - Add request/response interceptors
   - Store token from API response
   - Add token to all subsequent requests
   - Handle token refresh

2. **src/App.js** - Add storage logic
   - Store token in localStorage/sessionStorage after signup
   - Retrieve token on app load
   - Validate token before showing pages

3. **New File:** src/services/authService.js
   - Token storage/retrieval methods
   - Token validation helpers
   - Logout/clear logic

**Files to Modify:**
- src/services/api.js (add interceptors)
- src/App.js (store/retrieve tokens)
- src/pages/RewardForm/RewardForm.jsx (optional: validate before form)

---

### Option 2: COMPREHENSIVE - Context API + Auth (Recommended for Future)
**Effort:** Medium | **Scope:** Full auth system with protected routes

**New Files to Create:**
1. src/context/AuthContext.js
2. src/services/authService.js
3. src/components/ProtectedRoute.jsx (optional)

**Files to Modify:**
- src/services/api.js
- src/App.js
- src/index.js

---

### Option 3: ENTERPRISE - Full Solution
**Effort:** High | **Scope:** Production-grade with role-based access

**New Files:**
1. src/context/AuthContext.js
2. src/services/authService.js
3. src/hooks/useAuth.js
4. src/hooks/useProtectedRoute.js
5. src/utils/tokenUtils.js

**Would Include:**
- Role-based authorization
- Token refresh mechanism
- Logout functionality
- Session recovery
- Protected page routes
- Error boundary for auth errors

---

## 11. KEY FILES TO KNOW

| File | Purpose | Size | Key Points |
|------|---------|------|-----------|
| src/App.js | Main app logic, frame routing | 241 lines | Central state, API calls here |
| src/services/api.js | Axios config + API methods | 27 lines | Add interceptors here |
| src/pages/*/*/\*.jsx | Page components | ~200 lines each | UI + form validation |
| src/index.js | Entry point | 18 lines | Simple ReactDOM render |
| .env | Config | 3 lines | API URL, bot username |

---

## 12. QUICK START FOR AUTH IMPLEMENTATION

### Minimal Implementation (Token Storage)

**Step 1:** Modify src/services/api.js
```javascript
// Add response interceptor to store token
api.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  }
);

// Add request interceptor to send token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Step 2:** Retrieve token on App.js mount
```javascript
useEffect(() => {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    // Skip check-user, go directly to form or home
  }
}, []);
```

**Step 3:** Clear token on logout
```javascript
const handleLogout = () => {
  localStorage.removeItem('authToken');
  setCurrentFrame('loading');
  // Re-initialize
};
```

---

## Summary

The hedg-bot-frontend is a **simple, linear React application** with:
- Modern React 19 with hooks
- No external state management
- Telegram Mini App integration
- State-based routing (not React Router)
- Minimal API integration (2 endpoints only)
- NO current authentication system

**Best Path Forward for Auth:**
1. Start with token storage in api.js interceptors
2. Store token in localStorage after signup
3. Send token with all future requests
4. Validate token on app load
5. Clear token on logout

This is a **great candidate for adding authentication** because:
- Simple, focused codebase
- Centralized state management
- Clear data flow
- Easy to trace API calls
- No conflicting patterns
