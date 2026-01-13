# HEDG Bot - Pages Reference

## Current Navigation System

Your app uses **state-based navigation** (not URL routing). The `currentFrame` state determines which page is shown.

## All Pages & File Paths

### 📁 Page Structure

```
src/pages/
├── SplashScreen/
│   ├── SplashScreen.jsx
│   ├── SplashScreen.css
│   └── index.jsx
├── WheelPrompt/
│   ├── WheelPrompt.jsx
│   ├── WheelPrompt.css
│   └── index.jsx
├── SpinningWheel/
│   ├── SpinningWheel.jsx
│   ├── SpinningWheel.css
│   ├── CongratulationsModal.jsx
│   ├── CongratulationsModal.css
│   └── index.jsx
├── RewardForm/
│   ├── RewardForm.jsx
│   ├── RewardForm.css
│   └── index.jsx
└── SuccessScreen/
    ├── SuccessScreen.jsx
    ├── SuccessScreen.css
    └── index.jsx
```

---

## Page Flow & States

### 1. 🎬 Splash Screen
- **File:** `src/pages/SplashScreen/SplashScreen.jsx`
- **State:** `currentFrame = 'splash'`
- **Purpose:** Logo animation (3 seconds auto-advance)
- **Next:** → WheelPrompt

### 2. 🎡 Wheel Prompt
- **File:** `src/pages/WheelPrompt/WheelPrompt.jsx`
- **State:** `currentFrame = 'wheelPrompt'`
- **Purpose:** Initial screen with "Spin" button
- **Action:** User clicks "Spin"
- **Next:** → SpinningWheel

### 3. ⚡ Spinning Wheel
- **File:** `src/pages/SpinningWheel/SpinningWheel.jsx`
- **State:** `currentFrame = 'spinning'`
- **Purpose:** Wheel animation + Congratulations modal
- **Duration:** ~5 seconds
- **Next:** → RewardForm

### 4. 📝 Reward Form
- **File:** `src/pages/RewardForm/RewardForm.jsx`
- **State:** `currentFrame = 'rewardForm'`
- **Purpose:** Collect user details (name, phone, email)
- **Action:** User submits form
- **Next:** → SuccessScreen

### 5. ✅ Success Screen
- **File:** `src/pages/SuccessScreen/SuccessScreen.jsx`
- **State:** `currentFrame = 'success'`
- **Purpose:** Success message + redirect to platform
- **Auto-redirect:** After 3 seconds

---

## Testing Individual Pages

To test a specific page, modify `App.js` line 14:

```javascript
// Current default
const [currentFrame, setCurrentFrame] = useState('splash');

// Test specific pages:
const [currentFrame, setCurrentFrame] = useState('wheelPrompt');  // Test Wheel Prompt
const [currentFrame, setCurrentFrame] = useState('spinning');      // Test Spinning Wheel
const [currentFrame, setCurrentFrame] = useState('rewardForm');    // Test Reward Form
const [currentFrame, setCurrentFrame] = useState('success');       // Test Success Screen
```

---

## URL Access (Optional - If You Want Routing)

Currently, your app doesn't use URL routing. If you want to add it:

### Option 1: Query Parameter (Current)
```
http://localhost:3000/?session=TOKEN
```

### Option 2: Add React Router (Recommended for Development)

Install React Router:
```bash
npm install react-router-dom
```

Example routes you could add:
```
http://localhost:3000/                    → Splash Screen
http://localhost:3000/spin                → Wheel Prompt
http://localhost:3000/spinning            → Spinning Wheel
http://localhost:3000/form                → Reward Form
http://localhost:3000/success             → Success Screen
```

---

## API Integration

Each page connects to your backend API:

- **SplashScreen** → `onboardingAPI.startOnboarding()`
- **WheelPrompt** → `onboardingAPI.updateStatus('splash_shown')`
- **SpinningWheel** → `onboardingAPI.spinWheel()`
- **RewardForm** → `onboardingAPI.submitForm()`
- **SuccessScreen** → Redirects to `response.data.redirect_url`

---

## Quick Reference

| Page | Frame State | File Path | Duration |
|------|-------------|-----------|----------|
| Splash | `splash` | `pages/SplashScreen/` | 3s auto |
| Wheel Prompt | `wheelPrompt` | `pages/WheelPrompt/` | User action |
| Spinning | `spinning` | `pages/SpinningWheel/` | 5s auto |
| Form | `rewardForm` | `pages/RewardForm/` | User action |
| Success | `success` | `pages/SuccessScreen/` | 3s auto redirect |

---

## Notes

- This is a **Telegram WebApp** (not a traditional website)
- Navigation is controlled by React state, not URLs
- Perfect for embedded Telegram bots
- URL routing is optional (only if needed for development/testing)
