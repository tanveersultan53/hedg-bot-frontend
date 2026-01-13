import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';

import SplashScreen from './pages/SplashScreen';
import WheelPrompt from './pages/WheelPrompt';
import SpinningWheel from './pages/SpinningWheel';
import RewardForm from './pages/RewardForm';
import SuccessScreen from './pages/SuccessScreen';

import { onboardingAPI } from './services/api';

function App() {
  const [currentFrame, setCurrentFrame] = useState('splash'); // splash, wheelPrompt, spinning, rewardForm, success
  const [sessionToken, setSessionToken] = useState(null);
  const [reward, setReward] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    WebApp.expand();

    // Get session token from URL or start onboarding
    const urlParams = new URLSearchParams(window.location.search);
    const sessionFromUrl = urlParams.get('session');

    if (sessionFromUrl) {
      setSessionToken(sessionFromUrl);
      setCurrentFrame('wheelPrompt');
    } else {
      initializeOnboarding();
    }
  }, []);

  const initializeOnboarding = async () => {
    try {
      const telegramUser = WebApp.initDataUnsafe?.user;

      if (!telegramUser) {
        // Fallback for testing outside Telegram - DEMO MODE
        console.log('🎮 Demo Mode: Running without Telegram');
        console.log('📝 No API calls will be made');
        console.log('✅ Full flow will work with mock data');
        // Stay on splash screen - it will auto-advance
        return;
      }

      const response = await onboardingAPI.startOnboarding({
        telegram_id: telegramUser.id,
        telegram_username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
      });

      if (response.data.status === 'returning_user') {
        // Redirect returning user immediately
        window.location.href = response.data.redirect_url;
      } else {
        // New user - start onboarding
        setSessionToken(response.data.session.session_token);
        // Splash screen will auto-advance
      }
    } catch (err) {
      console.error('Error initializing onboarding:', err);
      console.log('⚠️ API Error - Continuing in demo mode');
      // Continue to splash screen anyway for demo purposes
    }
  };

  const handleSplashComplete = async () => {
    try {
      if (sessionToken) {
        await onboardingAPI.updateStatus(sessionToken, 'splash_shown');
      }
    } catch (err) {
      console.log('API error, continuing in demo mode');
    }
    setCurrentFrame('wheelPrompt');
  };

  const handleSpin = async () => {
    setCurrentFrame('spinning');

    try {
      if (sessionToken) {
        await onboardingAPI.updateStatus(sessionToken, 'spinning');
        // Call spin API
        const response = await onboardingAPI.spinWheel(sessionToken);
        setReward(response.data.reward);
      } else {
        // Demo mode - use mock reward
        console.log('Demo mode: Using mock reward data');
        const mockRewards = [
          { name: 'Risk-free credit', description: '100 units' },
          { name: 'VIP onboarding', description: 'Premium access' },
          { name: 'fee discounts', description: '50% off trading fees' },
          { name: 'welcome bonus', description: '$50 bonus' },
        ];
        const randomReward = mockRewards[Math.floor(Math.random() * mockRewards.length)];
        setReward(randomReward);
      }
    } catch (err) {
      console.error('Error spinning wheel:', err);
      // Fallback to mock data even on error
      setReward({ name: 'Risk-free credit', description: '100 units' });
    }
  };

  const handleSpinComplete = async () => {
    try {
      if (sessionToken) {
        await onboardingAPI.updateStatus(sessionToken, 'reward_shown');
      }
    } catch (err) {
      console.log('API error, continuing in demo mode');
    }
    setCurrentFrame('rewardForm');
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      if (sessionToken) {
        const response = await onboardingAPI.submitForm({
          session_token: sessionToken,
          ...formData,
        });
        setRedirectUrl(response.data.redirect_url);
      } else {
        // Demo mode - use mock redirect URL
        console.log('Demo mode: Form submitted', formData);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRedirectUrl('https://hedg.com/platform');
      }
      setCurrentFrame('success');
    } catch (err) {
      console.error('Error submitting form:', err);
      // Fallback to mock redirect even on error
      setRedirectUrl('https://hedg.com/platform');
      setCurrentFrame('success');
    } finally {
      setLoading(false);
    }
  };

  const renderFrame = () => {
    switch (currentFrame) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;

      case 'wheelPrompt':
        return <WheelPrompt onSpin={handleSpin} />;

      case 'spinning':
        return <SpinningWheel onSpinComplete={handleSpinComplete} reward={reward} />;

      case 'rewardForm':
        return <RewardForm reward={reward} onSubmit={handleFormSubmit} loading={loading} />;

      case 'success':
        return <SuccessScreen redirectUrl={redirectUrl} autoRedirectSeconds={3} />;

      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="App">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
      {renderFrame()}
    </div>
  );
}

export default App;
