# Hedg Bot Frontend - React Telegram Web App

React-based Telegram Web App for the Hedg Bot onboarding funnel with spin-to-win functionality.

## Features

- 🎨 Beautiful animated UI with smooth transitions
- 🎰 Interactive spinning wheel with probability-based rewards
- 📱 Fully responsive mobile-first design
- 🤖 Telegram WebApp integration
- ✨ Engaging animations and visual effects
- 📋 Form validation and error handling
- 🔄 Auto-redirect to trading platform
- 🎁 Reward announcement system

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Environment Setup

Create/edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BOT_USERNAME=your_bot_username
```

## Project Structure

```
src/
├── components/           # All frame components
│   ├── SplashScreen.jsx
│   ├── WheelPrompt.jsx
│   ├── SpinningWheel.jsx
│   ├── RewardForm.jsx
│   └── SuccessScreen.jsx
├── services/
│   └── api.js           # Backend API integration
├── App.js               # Main app logic
└── App.css              # Global styles
```

## User Flow

1. **Splash** → Logo animation (3s)
2. **Wheel Prompt** → User clicks SPIN
3. **Spinning** → Animated wheel (5s)
4. **Reward + Form** → User fills details
5. **Success** → Auto-redirect (3s)

## Telegram Bot Setup

1. Create bot with @BotFather
2. Set Web App URL to your deployment URL
3. Configure webhook in backend
4. Test with `/start` command

## Deployment

### Build
```bash
npm run build
```

### Deploy
Upload `build/` folder to your web server with HTTPS enabled.

### Nginx Config Example
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    root /var/www/hedg-bot;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

## API Integration

All API calls handled in `src/services/api.js`:

- `startOnboarding()` - Initialize session
- `spinWheel()` - Get reward
- `submitForm()` - Complete registration
- `updateStatus()` - Track progress

## Testing

### Local Testing with Telegram

1. Use ngrok to expose localhost:
```bash
ngrok http 3000
```

2. Set ngrok URL as Web App URL in BotFather

3. Open bot in Telegram and test

### Browser Testing

The app works outside Telegram for development testing.

## Components

### SplashScreen
- Animated HEDG logo
- Auto-advances after 3 seconds

### WheelPrompt
- Wheel preview
- SPIN button

### SpinningWheel
- 5-second animation
- Calls backend for reward

### RewardForm
- Shows won reward
- Registration form with validation

### SuccessScreen
- Success animation
- 3-second countdown
- Auto-redirect to platform

## Troubleshooting

**App won't load in Telegram?**
- Ensure HTTPS is enabled
- Check Web App URL in BotFather
- Verify backend is accessible

**API errors?**
- Check REACT_APP_API_URL in .env
- Verify backend CORS settings
- Check browser console

**Form validation issues?**
- All fields required
- Valid email format needed
- Phone number must be complete

## Tech Stack

- React 18
- Telegram WebApp SDK (@twa-dev/sdk)
- Axios
- React Phone Input 2
- CSS3 Animations

## Browser Support

- Telegram in-app browser (required for production)
- Chrome/Safari/Firefox (development)
- Mobile browsers

## License

Proprietary - Hedg Trading Platform
