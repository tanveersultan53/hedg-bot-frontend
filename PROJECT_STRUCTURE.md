# HEDG Bot Frontend - Project Structure

## Directory Organization

```
src/
├── pages/               # All screen/page components
│   ├── SplashScreen/    # Frame 1 - Logo animation
│   │   ├── SplashScreen.jsx
│   │   ├── SplashScreen.css
│   │   └── index.jsx
│   │
│   ├── WheelPrompt/     # Frame 2 - Spin wheel prompt
│   │   ├── WheelPrompt.jsx
│   │   ├── WheelPrompt.css
│   │   └── index.jsx
│   │
│   ├── SpinningWheel/   # Frame 3 - Spinning animation
│   │   ├── SpinningWheel.jsx
│   │   ├── SpinningWheel.css
│   │   ├── CongratulationsModal.jsx
│   │   ├── CongratulationsModal.css
│   │   └── index.jsx
│   │
│   ├── RewardForm/      # Frame 4 - User details form
│   │   ├── RewardForm.jsx
│   │   ├── RewardForm.css
│   │   └── index.jsx
│   │
│   └── SuccessScreen/   # Frame 5 - Success & redirect
│       ├── SuccessScreen.jsx
│       ├── SuccessScreen.css
│       └── index.jsx
│
├── components/          # Shared/reusable components only
│   ├── Spinner.jsx      # Loading spinner component
│   ├── Spinner.css
│   └── README.md
│
├── services/            # API services
│   └── api.js
│
├── App.js              # Main app with routing logic
├── App.css
└── index.js

```

## Page Flow

1. **SplashScreen** → Logo animation (3 seconds)
2. **WheelPrompt** → "Spin to unlock" screen
3. **SpinningWheel** → Wheel spinning + Congratulations modal
4. **RewardForm** → Collect user details (name, phone, email)
5. **SuccessScreen** → Success message + platform redirect

## File Naming Convention

- ✅ **Use `.jsx`** for all React component files
- ✅ **Use `.css`** for all stylesheet files
- ✅ **Use `.js`** only for non-React JavaScript files (utils, configs, etc.)

## Import Pattern

Each page has an `index.jsx` for clean imports:

```javascript
// In App.js
import SplashScreen from './pages/SplashScreen';
import WheelPrompt from './pages/WheelPrompt';
// etc...
```

## Styling Convention

- Each page has its CSS file alongside the JSX
- Keeps related code together
- Easy to find and maintain
- No global style conflicts

## Color Palette

- **Background**: `#142333` (dark blue)
- **Primary Orange**: `#FF7522`
- **Dark Orange**: `#D94F00`
- **Text Light**: `#F8F9FA`
- **Text Gray**: `#D9D9D9`
- **Teal Accent**: `rgba(60, 200, 200, 0.15)`

## Font

- **Primary**: Outfit (via Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
