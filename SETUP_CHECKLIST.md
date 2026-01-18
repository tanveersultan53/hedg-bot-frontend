# Telegram Mini App Setup Checklist

Use this checklist to track your setup progress.

---

## 🤖 Step 1: Create Telegram Bot

- [ ] Opened @BotFather in Telegram
- [ ] Created new bot with `/newbot`
- [ ] Saved bot token: `_________________________`
- [ ] Saved bot username: `_________________________`

---

## 🔧 Step 2: Setup Backend

- [ ] Backend code ready
- [ ] Backend deployed to: `_________________________`
- [ ] Backend URL (HTTPS): `https://_________________________`
- [ ] Bot token added to backend environment
- [ ] CORS configured for Telegram domains
- [ ] Tested API endpoints (use Postman/curl)

**Test your backend:**
```bash
curl https://your-backend-url.com/api/onboarding/start/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 123456789}'
```

---

## ⚛️ Step 3: Configure Frontend

- [ ] Updated `.env.production` with backend URL
- [ ] Updated `.env.production` with bot username
- [ ] Telegram Web App script added to index.html ✅ (already done)
- [ ] Tested locally with `npm start`

**Your .env.production should look like:**
```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_BOT_USERNAME=your_bot_username
```

---

## 🚀 Step 4: Deploy Frontend

Choose ONE option:

### Option A: Vercel
- [ ] Installed Vercel CLI: `npm install -g vercel`
- [ ] Built project: `npm run build`
- [ ] Deployed: `vercel --prod`
- [ ] Frontend URL: `https://_________________________`

OR use script:
```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

### Option B: Netlify
- [ ] Installed Netlify CLI: `npm install -g netlify-cli`
- [ ] Built project: `npm run build`
- [ ] Deployed: `netlify deploy --prod --dir=build`
- [ ] Frontend URL: `https://_________________________`

OR use script:
```bash
chmod +x deploy-netlify.sh
./deploy-netlify.sh
```

### Option C: Other (Render, Railway, etc.)
- [ ] Deployed to: `_________________________`
- [ ] Frontend URL: `https://_________________________`

---

## 🔗 Step 5: Connect Bot to Mini App

- [ ] Opened @BotFather
- [ ] Sent `/mybots`
- [ ] Selected bot: `@_________________________`
- [ ] Clicked "Bot Settings"
- [ ] Clicked "Menu Button"
- [ ] Clicked "Configure menu button"
- [ ] Entered button text: `_________________________`
- [ ] Entered frontend URL: `https://_________________________`
- [ ] Saved configuration

**Alternative: Create Web App**
- [ ] Sent `/newapp` to @BotFather
- [ ] Selected bot
- [ ] Uploaded image (640x360px)
- [ ] Entered title: `HEDG Onboarding`
- [ ] Entered description
- [ ] Entered Web App URL: `https://_________________________`
- [ ] Entered short name: `_________________________`
- [ ] Web App link: `https://t.me/your_bot/your_short_name`

---

## ✅ Step 6: Test Everything

### Basic Tests
- [ ] Opened bot in Telegram mobile app
- [ ] Clicked menu button / Start
- [ ] Mini App opened successfully
- [ ] App expanded to full screen

### Flow Tests
- [ ] Splash screen appeared
- [ ] Transitioned to wheel prompt
- [ ] Clicked "Spin the Wheel"
- [ ] Wheel animation played
- [ ] Reward displayed correctly
- [ ] Form appeared with fields: email, phone, country
- [ ] Filled form and submitted
- [ ] Success screen appeared
- [ ] Redirect worked (or countdown showed)

### API Tests
- [ ] Check browser console - no errors
- [ ] Check network tab - API calls successful
- [ ] Check backend logs - requests received
- [ ] User data saved correctly in backend

### Cross-Platform Tests
- [ ] Tested on Android Telegram
- [ ] Tested on iOS Telegram
- [ ] Tested on Telegram Desktop (Mac/Windows/Linux)
- [ ] Tested on Telegram Web

---

## 🐛 Troubleshooting

If something doesn't work, check:

- [ ] Backend is accessible via HTTPS
- [ ] Frontend is deployed with HTTPS
- [ ] Environment variables are correct
- [ ] CORS is enabled for Telegram domains
- [ ] Telegram Web App script loads (check console)
- [ ] No errors in browser console
- [ ] No errors in backend logs

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Check REACT_APP_API_URL in .env.production |
| CORS error | Add Telegram domains to backend CORS config |
| User data null | Must test in actual Telegram app, not browser |
| App not expanding | Check WebApp.ready() and WebApp.expand() calls |
| 404 on deploy | Check build folder exists and deployment path |

---

## 📊 Final Status

**Deployment Date:** `_________________________`

**URLs:**
- Bot: `https://t.me/_________________________`
- Mini App: `https://t.me/_________________________ /start`
- Frontend: `https://_________________________`
- Backend: `https://_________________________`

**Status:**
- [ ] ✅ Production Ready
- [ ] ⚠️ Needs Testing
- [ ] ❌ Issues to Fix

**Notes:**
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

## 🎯 Post-Launch

After successful launch:

- [ ] Monitor backend logs for errors
- [ ] Track user signups
- [ ] Gather user feedback
- [ ] Set up analytics (Google Analytics, Mixpanel, etc.)
- [ ] Set up error tracking (Sentry)
- [ ] Document any issues
- [ ] Plan improvements

---

**Good luck! 🚀**

For detailed instructions, see: `TELEGRAM_SETUP_GUIDE.md`
