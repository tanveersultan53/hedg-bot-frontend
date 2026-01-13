# 🎮 Demo Mode - Complete Flow Without Token

Your HEDG Bot now works **completely without a token** for testing and demo purposes!

## ✅ What Works in Demo Mode

All 5 screens work perfectly without any API or token:

1. ✅ **Splash Screen** - Loads and auto-advances (3 seconds)
2. ✅ **Wheel Prompt** - Shows "Spin" button
3. ✅ **Spinning Wheel** - Spins and shows random reward
4. ✅ **Reward Form** - Collects user data
5. ✅ **Success Screen** - Shows success + mock redirect

## 🚀 How to Test Complete Flow

### Step 1: Start the App
```bash
npm start
```

### Step 2: Open in Browser
```
http://localhost:3000
```

### Step 3: Experience the Full Journey

**You'll see this automatic flow:**

```
1. 🎬 Splash Screen (3s)
      ↓ Auto-advance

2. 🎡 Wheel Prompt
      ↓ Click "Spin"

3. ⚡ Spinning Wheel (5s)
      ↓ Auto-advance with random reward

4. 📝 Reward Form
      ↓ Fill form & Submit

5. ✅ Success Screen
      ↓ Redirects after 3s
```

## 🎁 Mock Rewards (Random Selection)

The app will randomly pick one of these rewards:

- 💰 **Risk-free credit** - 100 units
- ⭐ **VIP onboarding** - Premium access
- 💳 **fee discounts** - 50% off trading fees
- 🎁 **welcome bonus** - $50 bonus

## 📝 Form Testing

Fill in any test data:
- **Name:** John Doe
- **Phone:** +1 555-0123
- **Email:** test@example.com

The form will submit successfully and advance to success screen.

## 🔍 Console Messages

When running in demo mode, you'll see:

```
🎮 Demo Mode: Running without Telegram
📝 No API calls will be made
✅ Full flow will work with mock data
Demo mode: Using mock reward data
Demo mode: Form submitted {name: "...", email: "..."}
```

## ⚙️ How It Works

### Without Token:
- ✅ No API calls are made
- ✅ Mock data is used instead
- ✅ All screens still transition properly
- ✅ Form validation still works
- ✅ Complete user experience preserved

### With Token (Production):
- ✅ Real API calls
- ✅ Real reward from backend
- ✅ Real form submission
- ✅ Real redirect URL

## 🔄 Flow Comparison

| Action | Demo Mode | Production Mode |
|--------|-----------|-----------------|
| Splash Screen | ✅ Shows | ✅ Shows + API call |
| Spin Wheel | ✅ Mock reward | ✅ Real API reward |
| Form Submit | ✅ Mock success | ✅ Real submission |
| Redirect | ✅ Mock URL | ✅ Real platform URL |

## 🎯 Perfect For:

- ✅ Development & Testing
- ✅ UI/UX Review
- ✅ Demos & Presentations
- ✅ Frontend Development (no backend needed)
- ✅ Design Reviews

## 🔗 With Token (Production)

To use with real API:
```
http://localhost:3000/?session=YOUR_SESSION_TOKEN
```

Or deploy to Telegram WebApp for full integration.

---

**Your complete flow works perfectly without any backend! 🎉**
