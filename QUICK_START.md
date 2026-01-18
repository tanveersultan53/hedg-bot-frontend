# Quick Start - Test Locally in Telegram

The fastest way to test your app in Telegram using ngrok.

---

## Prerequisites

1. **Install ngrok:**
   ```bash
   # Mac
   brew install ngrok/ngrok/ngrok

   # Windows (with Chocolatey)
   choco install ngrok

   # Or download from: https://ngrok.com/download
   ```

2. **Configure ngrok:**
   ```bash
   # Get token from: https://dashboard.ngrok.com/get-started/your-authtoken
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

---

## Option 1: Automated (Easy)

Run the automated script:

```bash
chmod +x start-local-telegram.sh
./start-local-telegram.sh
```

This will:
- Start your React app
- Start ngrok tunnel
- Give you the HTTPS URL
- Show you what to do next

---

## Option 2: Manual (Step by Step)

### Terminal 1 - Start Frontend:
```bash
npm start
```

### Terminal 2 - Start ngrok:
```bash
ngrok http 3000
```

Copy the HTTPS URL from ngrok output (e.g., `https://abc123.ngrok-free.app`)

---

## Connect to Telegram Bot

1. Open Telegram
2. Search for `@BotFather`
3. Send: `/mybots`
4. Select your bot
5. **Bot Settings** → **Menu Button** → **Configure menu button**
6. Paste your ngrok URL: `https://abc123.ngrok-free.app`

---

## Test It!

1. Open Telegram on your phone
2. Search for your bot: `@your_bot_username`
3. Click the menu button or send `/start`
4. Your local app should open! 🎉

---

## Debug with Telegram Desktop

For better debugging:

1. Download **Telegram Desktop**
2. Open your bot
3. **Right-click on the Mini App** → **Inspect Element**
4. Use Chrome DevTools to debug!

---

## Important Notes

- **Keep terminals open** - Closing them stops the app
- **ngrok URL changes** - Each time you restart ngrok, the URL changes
  - Update BotFather with the new URL
  - Or get a static domain (ngrok paid plan)
- **Test in Telegram app** - Not in browser directly

---

## Making Changes

1. Edit your code
2. Save
3. React hot-reloads automatically
4. Refresh Mini App in Telegram to see changes

---

## Troubleshooting

**"Invalid Host Header" error:**
```bash
ngrok http 3000 --host-header="localhost:3000"
```

**"Failed to fetch" error:**
- Check ngrok is still running
- Check React is still running
- Update ngrok URL in BotFather if it changed

**Can't see Telegram user data:**
- Must test in actual Telegram app (not browser)
- Open via bot, not by typing URL in browser

---

## Stop Everything

Press `Ctrl+C` in both terminals

Or if using the script, just press `Ctrl+C` once

---

## Full Documentation

See detailed guides:
- **LOCAL_TESTING_GUIDE.md** - Complete local testing guide
- **TELEGRAM_SETUP_GUIDE.md** - Full production deployment
- **SETUP_CHECKLIST.md** - Step-by-step checklist

---

## Quick Commands Reference

```bash
# Start everything (automated)
./start-local-telegram.sh

# Manual start
npm start                 # Terminal 1
ngrok http 3000          # Terminal 2

# Check if ngrok is working
curl http://localhost:4040/api/tunnels

# View ngrok dashboard
open http://localhost:4040

# Update bot in Telegram
# @BotFather → /mybots → your bot → Menu Button
```

---

**Ready? Let's go! 🚀**

Run: `./start-local-telegram.sh`
