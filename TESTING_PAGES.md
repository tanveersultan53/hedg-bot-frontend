# Testing Individual Pages - Quick Guide

## How to Test Each Page

Your app currently uses **state-based navigation**. To test individual pages during development:

### Method 1: Change Initial State (Recommended)

Edit `src/App.js` line 14:

```javascript
// Original (starts at splash screen)
const [currentFrame, setCurrentFrame] = useState('splash');

// Change to test specific pages:
const [currentFrame, setCurrentFrame] = useState('wheelPrompt');  // ← Test this page
```

### Method 2: Use Browser Console

While app is running, open browser console and run:

```javascript
// Manually change state
window.currentFrame = 'wheelPrompt';  // Then refresh
```

---

## Test Each Page:

### 🎬 Test Splash Screen
```javascript
const [currentFrame, setCurrentFrame] = useState('splash');
```
**URL:** `http://localhost:3000`

### 🎡 Test Wheel Prompt
```javascript
const [currentFrame, setCurrentFrame] = useState('wheelPrompt');
```
**URL:** `http://localhost:3000`

### ⚡ Test Spinning Wheel
```javascript
const [currentFrame, setCurrentFrame] = useState('spinning');
```
**Mock Data Needed:**
```javascript
const [reward, setReward] = useState({ name: 'Risk-free credit' });
```

### 📝 Test Reward Form
```javascript
const [currentFrame, setCurrentFrame] = useState('rewardForm');
```
**Mock Data Needed:**
```javascript
const [reward, setReward] = useState({
  name: 'Risk-free credit',
  description: '100 units'
});
```

### ✅ Test Success Screen
```javascript
const [currentFrame, setCurrentFrame] = useState('success');
```
**Mock Data Needed:**
```javascript
const [redirectUrl, setRedirectUrl] = useState('https://hedg.com/platform');
```

---

## Quick Test Setup

Add this to `App.js` for easy testing:

```javascript
// Add at the top of App component
const DEV_MODE = true;  // Set to false in production
const TEST_PAGE = 'wheelPrompt';  // Change this to test different pages

const [currentFrame, setCurrentFrame] = useState(
  DEV_MODE ? TEST_PAGE : 'splash'
);
```

Now just change `TEST_PAGE` to switch between pages!

---

## Run Development Server

```bash
npm start
```

Then open: `http://localhost:3000`

---

## All Page States Reference

| Page Name | State Value | Needs Mock Data? |
|-----------|-------------|------------------|
| Splash Screen | `'splash'` | ❌ No |
| Wheel Prompt | `'wheelPrompt'` | ❌ No |
| Spinning Wheel | `'spinning'` | ✅ Yes (reward) |
| Reward Form | `'rewardForm'` | ✅ Yes (reward) |
| Success Screen | `'success'` | ✅ Yes (redirectUrl) |
