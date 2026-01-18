# Telegram Mini App Setup Guide

Complete step-by-step guide to deploy your HEDG Bot frontend as a Telegram Mini App.

---

## ✅ STEP 1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start chat and send: `/newbot`
3. Enter bot name: `HEDG Bot` (or your choice)
4. Enter username: `hedg_onboarding_bot` (must end with 'bot')
5. **SAVE THE BOT TOKEN** - you'll need it for backend

Example token: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

---

## ✅ STEP 2: Deploy Backend API

### Option A: Using Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your backend repository
5. Add environment variable: `TELEGRAM_BOT_TOKEN` (paste your token from Step 1)
6. Wait for deployment
7. Copy the deployment URL: `https://your-app.railway.app`

### Option B: Using Render

1. Go to [Render.com](https://render.com)
2. Sign in with GitHub
3. Click **New** → **Web Service**
4. Connect your backend repository
5. Add environment variable: `TELEGRAM_BOT_TOKEN`
6. Deploy
7. Copy the URL: `https://your-app.onrender.com`

### Option C: Local Testing with ngrok

```bash
# Terminal 1: Start your backend
cd your-backend-folder
npm start  # or python manage.py runserver

# Terminal 2: Expose with ngrok
ngrok http 8000

# Copy the HTTPS URL: https://abc123.ngrok-free.app
```

**⚠️ Save your backend URL!**

---

## ✅ STEP 3: Configure Frontend

1. **Update `.env.production` file:**

```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_BOT_USERNAME=hedg_onboarding_bot
```

Replace:
- `https://your-backend-url.com` with your actual backend URL from Step 2
- `hedg_onboarding_bot` with your actual bot username from Step 1

2. **Test locally (optional):**

```bash
npm start
```

Open http://localhost:3000 - should work in demo mode

---

## ✅ STEP 4: Build & Deploy Frontend

### Option A: Deploy to Vercel (Easiest)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Build and deploy:
```bash
npm run build
vercel --prod
```

3. Follow prompts, copy deployment URL: `https://your-app.vercel.app`

### Option B: Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=build
```

3. Copy deployment URL: `https://your-app.netlify.app`

### Option C: Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/hedg-bot-frontend",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

**⚠️ Save your frontend URL!**

---

## ✅ STEP 5: Connect Bot to Mini App

1. Open Telegram, go to `@BotFather`
2. Send: `/mybots`
3. Select your bot (e.g., `@hedg_onboarding_bot`)
4. Click **Bot Settings**
5. Click **Menu Button**
6. Click **Configure menu button**
7. Enter:
   - **Button text**: `Start Onboarding` (or your choice)
   - **URL**: `https://your-frontend-url.vercel.app` (from Step 4)
8. Confirm

---

## ✅ STEP 6: Create Web App (Alternative Method)

If menu button doesn't work, create a Web App:

1. Go to `@BotFather`
2. Send: `/newapp`
3. Select your bot
4. Upload an image (640x360px)
5. Enter title: `HEDG Onboarding`
6. Enter description: `Spin the wheel and win rewards!`
7. Upload demo GIF (optional)
8. Enter Web App URL: `https://your-frontend-url.vercel.app`
9. Enter short name: `start` (will be used in URL)

Your Mini App will be available at:
`https://t.me/hedg_onboarding_bot/start`

---

## ✅ STEP 7: Test Your Mini App

### Test 1: Open Bot
1. Search for your bot in Telegram: `@hedg_onboarding_bot`
2. Click **Start** or tap the **Menu button**
3. Mini App should open

### Test 2: Direct Link
Open in Telegram:
```
https://t.me/your_bot_username/your_app_short_name
```

### Test 3: Flow Testing

Expected flow:
1. ✅ Splash screen appears
2. ✅ Wheel prompt shows
3. ✅ Click "Spin" - wheel spins
4. ✅ Reward appears
5. ✅ Form appears (email, phone, country)
6. ✅ Submit form
7. ✅ Success screen with redirect

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" error

**Solution:**
- Check `.env.production` has correct `REACT_APP_API_URL`
- Ensure backend is running and accessible
- Check CORS settings in backend (must allow Telegram domains)

### Issue: Telegram user data not loading

**Solution:**
- Ensure `telegram-web-app.js` script is loaded (check public/index.html)
- Test in actual Telegram app (not browser)
- Check `WebApp.initDataUnsafe.user` in console

### Issue: App not expanding to full screen

**Solution:**
- Ensure `WebApp.ready()` and `WebApp.expand()` are called (src/App.js:23-24)

### Issue: Backend CORS errors

**Solution:**
Add to backend:
```python
# Django example
CORS_ALLOWED_ORIGINS = [
    "https://web.telegram.org",
    "https://your-frontend-url.vercel.app"
]
```

---

## 📱 Mobile vs Desktop Testing

### Desktop Telegram
- Open Telegram Desktop
- Search for bot
- Click menu button or use direct link

### Mobile Telegram
- Open Telegram app
- Search for bot
- Tap menu button or open direct link

---

## 🚀 Production Checklist

- [ ] Backend deployed with HTTPS
- [ ] Frontend deployed with HTTPS
- [ ] Environment variables updated in `.env.production`
- [ ] Bot created in BotFather
- [ ] Web App configured in BotFather
- [ ] CORS configured in backend
- [ ] Tested on mobile Telegram
- [ ] Tested on desktop Telegram
- [ ] All API endpoints working
- [ ] Error handling tested

---

## 📚 Useful Commands

### Local Development
```bash
npm start                 # Run dev server
npm run build            # Build for production
npm test                 # Run tests
```

### Check Environment
```bash
cat .env.production      # View production config
npm run build && npx serve -s build  # Test production build locally
```

### Update Deployment
```bash
# Vercel
vercel --prod

# Netlify
npm run build && netlify deploy --prod --dir=build

# GitHub Pages
npm run deploy
```

---

## 🔗 Important Links

- [Telegram Bots Documentation](https://core.telegram.org/bots)
- [Telegram Web Apps Guide](https://core.telegram.org/bots/webapps)
- [Telegram Web App SDK](https://core.telegram.org/bots/webapps#initializing-web-apps)
- [BotFather Commands](https://core.telegram.org/bots#botfather)

---

## 📞 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check backend logs
3. Verify environment variables
4. Test API endpoints directly (use Postman/curl)
5. Check Telegram Web App documentation

---

## 🎯 Next Steps

After successful setup:

1. Customize rewards in backend
2. Add analytics tracking
3. Implement user dashboard
4. Add more Telegram features (haptic feedback, MainButton, etc.)
5. Set up monitoring (Sentry, LogRocket)

Good luck with your Telegram Mini App! 🚀
