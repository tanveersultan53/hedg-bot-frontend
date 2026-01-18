# Local Testing with Telegram using ngrok

Complete guide to run your frontend locally and test it in Telegram app using ngrok.

---

## 📋 Prerequisites

- [ ] Node.js installed
- [ ] Telegram bot created (you have token in .env)
- [ ] ngrok account (free tier works fine)

---

## STEP 1: Install ngrok

### Option A: Direct Download (Recommended)
1. Go to https://ngrok.com/download
2. Sign up for free account
3. Download ngrok for your OS
4. Unzip and move to a folder in your PATH

**Mac:**
```bash
# Using Homebrew (easiest)
brew install ngrok/ngrok/ngrok

# Or manual install
cd ~/Downloads
unzip ~/Downloads/ngrok-*.zip
sudo mv ngrok /usr/local/bin/
```

**Windows:**
```bash
# Using Chocolatey
choco install ngrok

# Or download from ngrok.com and add to PATH
```

**Linux:**
```bash
# Download and install
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

### Verify Installation
```bash
ngrok version
```

---

## STEP 2: Configure ngrok

1. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
2. Add authtoken:
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

---

## STEP 3: Update Environment Variables

Your `.env` file already has:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BOT_USERNAME=your_bot_username
BOT_TOKEN=8250936740:AAHAz-E9FQFf246fYl12mHOHMg0qwPjNydQ
```

**If you have a backend running locally:**
- Keep `REACT_APP_API_URL=http://localhost:8000`

**If you have a deployed backend:**
- Update to: `REACT_APP_API_URL=https://your-backend-url.com`

**Update bot username:**
```env
REACT_APP_BOT_USERNAME=your_actual_bot_username
```

---

## STEP 4: Start Your Backend (if local)

**If using local backend:**

```bash
# In your backend directory
cd /path/to/your/backend
npm start
# or
python manage.py runserver
# Should run on http://localhost:8000
```

**If using deployed backend:**
- Skip this step, just make sure REACT_APP_API_URL points to it

---

## STEP 5: Start Frontend Locally

Open a **NEW terminal** in your frontend directory:

```bash
cd /Users/muhammad/Documents/Sultan/hedg-bot-frontend

# Install dependencies (if not done)
npm install

# Start development server
npm start
```

This will start on `http://localhost:3000`

**✅ Verify:** Open browser to http://localhost:3000 - you should see your app in demo mode

---

## STEP 6: Expose with ngrok

Open **ANOTHER new terminal**:

```bash
# Expose port 3000 (where React runs)
ngrok http 3000
```

You'll see output like:
```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

**⚠️ IMPORTANT: Copy the HTTPS URL:** `https://abc123.ngrok-free.app`

**Keep this terminal running!** If you close it, the tunnel stops.

---

## STEP 7: Connect to Telegram Bot

### Option A: Set as Menu Button

1. Open Telegram, search for `@BotFather`
2. Send: `/mybots`
3. Select your bot
4. Click **Bot Settings**
5. Click **Menu Button**
6. Click **Configure menu button**
7. Enter button text: `Start App`
8. Enter URL: `https://abc123.ngrok-free.app` (your ngrok URL)
9. Done!

### Option B: Create Web App

1. Send to @BotFather: `/newapp`
2. Select your bot
3. Upload image (any 640x360 image)
4. Title: `HEDG Test`
5. Description: `Testing locally`
6. Web App URL: `https://abc123.ngrok-free.app`
7. Short name: `test`

Your app will be at: `https://t.me/your_bot_username/test`

---

## STEP 8: Test in Telegram

1. **On your phone:** Open Telegram app
2. Search for your bot: `@your_bot_username`
3. Click **Start** or tap **Menu button**
4. Your local app should open in Telegram!

**You can now:**
- See changes in real-time
- Debug with browser DevTools
- Test the full flow
- See console logs

---

## 🔄 Development Workflow

### Terminal Layout:
```
Terminal 1: Backend (if local)
→ cd /path/to/backend
→ npm start

Terminal 2: Frontend
→ cd /Users/muhammad/Documents/Sultan/hedg-bot-frontend
→ npm start

Terminal 3: ngrok
→ ngrok http 3000
```

### Making Changes:
1. Edit code in your editor
2. Save file
3. React hot-reloads automatically
4. Refresh Telegram Mini App to see changes
5. Check Terminal 2 for errors

### Debugging:
- **Frontend logs:** Check Terminal 2
- **Backend logs:** Check Terminal 1
- **Browser console:** Use Telegram Desktop → Right-click Mini App → Inspect Element
- **Network calls:** Check Network tab in DevTools

---

## 🐛 Troubleshooting

### ngrok URL shows "Invalid Host Header"

**Solution:** Create `ngrok.yml` config:
```bash
# Find config location
ngrok config edit
```

Add:
```yaml
version: "2"
authtoken: YOUR_TOKEN
tunnels:
  frontend:
    proto: http
    addr: 3000
    inspect: true
```

Or use this command instead:
```bash
ngrok http 3000 --host-header="localhost:3000"
```

### ngrok shows warning page

ngrok free tier shows a warning page before loading your app. Click **Visit Site** to continue.

**To remove warning (requires paid plan):**
```bash
ngrok http 3000 --domain=your-static-domain.ngrok-free.app
```

### Telegram shows "Failed to fetch"

**Check:**
1. ngrok is still running (check Terminal 3)
2. Frontend is running (check Terminal 2)
3. Backend is running (check Terminal 1, if local)
4. ngrok URL in BotFather is correct
5. Try refreshing Mini App in Telegram

### Can't see user data

**Solution:**
- Test in actual Telegram app (not browser)
- Check `WebApp.initDataUnsafe` in console
- Ensure you opened via bot, not direct browser

---

## 🚀 Quick Start Script

I'll create an automated script for you!

---

## 📱 Testing Tips

### Use Telegram Desktop for DevTools:
1. Download Telegram Desktop
2. Open your bot
3. Right-click on Mini App → **Inspect Element**
4. Full Chrome DevTools available!

### Test User Flow:
1. Clear data: Close and reopen bot
2. Test as new user
3. Check all screens: Splash → Wheel → Reward → Form → Success
4. Verify API calls in Network tab

### Test Different Users:
- Ask friend to test with their Telegram
- Or create test Telegram account

---

## ⚡ Pro Tips

1. **Keep ngrok running** - Don't close Terminal 3
2. **Use Telegram Desktop** for easier debugging
3. **Watch Terminal 2** for React errors
4. **Check Network tab** for API failures
5. **ngrok URL changes** each time you restart ngrok (free tier)
   - Update BotFather each time you restart ngrok
   - Or get a static domain (paid)

---

## 🔄 Restart Everything

If things break:

```bash
# Stop all (Ctrl+C in each terminal)

# Terminal 1: Restart backend
npm start

# Terminal 2: Restart frontend
npm start

# Terminal 3: Restart ngrok
ngrok http 3000

# Update BotFather with new ngrok URL if it changed
```

---

## ✅ Success Checklist

- [ ] ngrok installed and configured
- [ ] Backend running (Terminal 1)
- [ ] Frontend running (Terminal 2)
- [ ] ngrok tunnel active (Terminal 3)
- [ ] ngrok HTTPS URL copied
- [ ] BotFather updated with ngrok URL
- [ ] Tested in Telegram mobile app
- [ ] Can see app in Telegram
- [ ] Can interact with app
- [ ] Can see console logs
- [ ] API calls working

---

## Next: Go to Telegram and test! 🎉

Your bot: `@your_bot_username`
Or direct link: `https://t.me/your_bot_username/test`
