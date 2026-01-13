# Hedg Bot - Complete Setup Guide

## 🎯 Quick Overview

You now have a complete Telegram Bot onboarding system:
- ✅ Django Backend (API + Admin + Telegram Bot)
- ✅ React Frontend (5 animated frames + Telegram WebApp)
- ✅ Database models and sample data
- ✅ Full API integration

## 📁 Project Structure

```
Sultan/
├── hedg-bot-backend/          # Django API + Telegram Bot
│   ├── onboarding/            # Main app
│   ├── hedg_backend/          # Settings
│   ├── db.sqlite3             # Database (6 rewards loaded)
│   └── manage.py
│
└── hedg-bot-frontend/         # React Telegram WebApp
    ├── src/
    │   ├── components/        # 5 frame components
    │   ├── services/          # API integration
    │   └── App.js             # Main app
    ├── public/
    └── package.json
```

## 🚀 Step-by-Step Setup

### Part 1: Backend Setup (Already Done!)

The backend is fully configured and ready:

```bash
cd hedg-bot-backend

# Activate virtual environment
source venv/bin/activate

# Start server
python manage.py runserver
```

**Backend runs on:** `http://localhost:8000`

**Admin panel:** `http://localhost:8000/admin/`
- Create superuser: `python manage.py createsuperuser`

### Part 2: Frontend Setup

```bash
cd hedg-bot-frontend

# Install dependencies (if not done)
npm install

# Start development server
npm start
```

**Frontend runs on:** `http://localhost:3000`

## 🤖 Telegram Bot Configuration

### 1. Create Your Bot

1. Open Telegram and find @BotFather
2. Send `/newbot`
3. Choose a name: `Hedg Trading Bot`
4. Choose username: `hedg_trading_bot` (must end with 'bot')
5. Save your bot token

### 2. Set Bot Commands

Send to @BotFather:
```
/setcommands

Then paste:
start - Start trading or spin the wheel
help - Show help message
status - Check account status
```

### 3. Create Web App

1. Send `/newapp` to @BotFather
2. Select your bot
3. Provide app details:
   - Title: Hedg Trading
   - Description: Trade with confidence
   - Photo: Upload your logo
   - Web App URL: `https://yourdomain.com` (you'll update this after deployment)

### 4. Configure Backend

Edit `hedg-bot-backend/.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_WEBHOOK_URL=https://yourdomain.com/api/onboarding/telegram/webhook/
```

## 🌐 Deployment Guide

### Option 1: Using Ngrok (For Testing)

This allows you to test the Telegram WebApp locally:

```bash
# Terminal 1: Start backend
cd hedg-bot-backend
source venv/bin/activate
python manage.py runserver

# Terminal 2: Start frontend
cd hedg-bot-frontend
npm start

# Terminal 3: Expose frontend to internet
ngrok http 3000

# Terminal 4: Expose backend to internet
ngrok http 8000
```

Then:
1. Copy the ngrok HTTPS URL for frontend (e.g., `https://abc123.ngrok.io`)
2. Update frontend .env: `REACT_APP_API_URL=https://xyz789.ngrok.io`
3. Restart frontend
4. Set the frontend ngrok URL as Web App URL in @BotFather
5. Set webhook:
```bash
curl -X POST http://localhost:8000/api/onboarding/telegram/set-webhook/ \
  -H "Content-Type: application/json" \
  -d '{"webhook_url": "https://xyz789.ngrok.io/api/onboarding/telegram/webhook/"}'
```

### Option 2: Production Deployment

#### Backend Deployment

1. **Get a server** (DigitalOcean, AWS, etc.)

2. **Install requirements:**
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx
```

3. **Upload backend code**

4. **Configure:**
```bash
cd hedg-bot-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Update .env with production values
```

5. **Run with Gunicorn:**
```bash
gunicorn hedg_backend.wsgi:application --bind 0.0.0.0:8000
```

6. **Setup nginx:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

7. **Setup SSL:**
```bash
sudo certbot --nginx -d api.yourdomain.com
```

#### Frontend Deployment

1. **Build the app:**
```bash
cd hedg-bot-frontend
npm run build
```

2. **Upload build folder to server**

3. **Configure nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/hedg-bot;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

4. **Setup SSL:**
```bash
sudo certbot --nginx -d yourdomain.com
```

5. **Update Web App URL in @BotFather:**
```
/setmenubutton
Select your bot
Send: https://yourdomain.com
```

6. **Set webhook:**
```bash
curl -X POST https://api.yourdomain.com/api/onboarding/telegram/set-webhook/ \
  -H "Content-Type: application/json" \
  -d '{"webhook_url": "https://api.yourdomain.com/api/onboarding/telegram/webhook/"}'
```

## ✅ Testing Checklist

### Backend Testing
```bash
# Test API endpoints
curl http://localhost:8000/api/onboarding/start/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 123456789}'

# Access admin
# Visit: http://localhost:8000/admin/
# Check rewards are loaded
```

### Frontend Testing
```bash
# Open browser
# Visit: http://localhost:3000
# Should see splash screen
# Test each frame manually
```

### Telegram Integration Testing
1. Open your bot in Telegram
2. Send `/start`
3. Bot should reply with Web App button
4. Click button → App should open
5. Complete the flow:
   - Splash screen
   - Click SPIN
   - See spinning wheel
   - See reward
   - Fill form
   - Submit
   - See success screen
   - Auto-redirect

### Returning User Testing
1. Complete registration once
2. Close app
3. Send `/start` again
4. Should auto-redirect to platform (no wheel spin)

## 📊 Admin Panel Usage

1. **Access:** `http://localhost:8000/admin/`

2. **Manage Rewards:**
   - Go to "Wheel rewards"
   - Edit probabilities
   - Add new rewards
   - Activate/deactivate rewards

3. **View Users:**
   - See all registered users
   - Check registration status
   - View user details

4. **Monitor Sessions:**
   - Track active sessions
   - See session progress
   - Check completion rates

5. **View Activity Logs:**
   - Monitor user activities
   - Debug issues
   - Analyze user behavior

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Database locked:**
```bash
rm db.sqlite3
python manage.py migrate
python manage.py create_sample_rewards
```

**CORS errors:**
- Check `CORS_ALLOW_ALL_ORIGINS` in backend settings
- Ensure frontend URL is correct in .env

### Frontend Issues

**API connection failed:**
- Check `REACT_APP_API_URL` in .env
- Ensure backend is running
- Check browser console for errors

**Telegram WebApp not working:**
- Must use HTTPS in production
- Check Web App URL in @BotFather
- Clear Telegram cache

**Spinning wheel doesn't work:**
- Check backend has rewards loaded
- Verify session token is set
- Check network tab for API calls

## 📱 Testing on Mobile

1. **Use ngrok (recommended for testing)**
2. **Or deploy to production**
3. Open Telegram on phone
4. Find your bot
5. Send `/start`
6. Test full flow

## 🔐 Security Notes

Before going to production:

- [ ] Change `SECRET_KEY` in backend .env
- [ ] Set `DEBUG=False` in backend
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up proper `ALLOWED_HOSTS`
- [ ] Enable HTTPS (required for Telegram)
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Configure backups

## 📚 Documentation Files

### Backend
- `README.md` - Complete backend documentation
- `API_FLOW.md` - Detailed API flow
- `QUICKSTART.md` - Quick start guide
- `SETUP_COMPLETE.md` - Setup summary

### Frontend
- `HEDG_README.md` - Frontend documentation
- `SETUP_GUIDE.md` - This file

## 🎉 You're All Set!

Your Hedg Bot is ready to go! Here's what you have:

✅ **Backend API** - Fully functional with all endpoints
✅ **Database** - Models created, 6 rewards loaded
✅ **Telegram Bot** - Webhook handlers ready
✅ **Frontend App** - 5 beautiful animated frames
✅ **API Integration** - Frontend connected to backend
✅ **Admin Panel** - Manage everything easily
✅ **Documentation** - Complete guides

## 🚀 Next Steps

1. Create Telegram bot with @BotFather
2. Configure bot token in backend .env
3. Test locally with ngrok
4. Deploy to production server
5. Set up HTTPS
6. Configure Web App URL
7. Test end-to-end
8. Launch! 🎊

## 💡 Tips

- Test thoroughly with ngrok before deploying
- Monitor backend logs for errors
- Check Telegram webhook status
- Use admin panel to manage rewards
- Adjust probabilities for better engagement
- Monitor user completion rates

## 📞 Need Help?

- Check backend logs: Backend terminal
- Check frontend logs: Browser console (F12)
- Check API calls: Network tab in DevTools
- Review documentation files

---

**Built for Hedg Trading Platform**
**Ready to onboard users with style! 🎰**
