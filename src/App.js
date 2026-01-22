import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';

import SplashScreen from './pages/SplashScreen';
import WheelPrompt from './pages/WheelPrompt';
import SpinningWheel from './pages/SpinningWheel';
import RewardForm from './pages/RewardForm';
import SuccessScreen from './pages/SuccessScreen';

import { onboardingAPI } from './services/api';
import authService from './services/authService';

function App() {
  console.log('🎬 App component loaded');

  const [currentFrame, setCurrentFrame] = useState('loading'); // loading, splash, wheelPrompt, spinning, rewardForm, success
  const [reward, setReward] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [telegramUserData, setTelegramUserData] = useState(null);

  useEffect(() => {
    console.log('🎯 App mounted - Initializing Telegram WebApp...');

    // Initialize Telegram WebApp
    WebApp.ready();
    WebApp.expand();

    console.log('✅ WebApp.ready() and WebApp.expand() called');
    console.log('🌐 Current URL:', window.location.href);

    // SIMPLIFIED: Just initialize onboarding directly (Telegram data IS the authentication)
    initializeOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeOnboarding = async () => {
    try {
      console.log('🚀 Initializing onboarding...');
      console.log('📱 Telegram WebApp Object:', WebApp);
      console.log('📊 WebApp.initDataUnsafe:', WebApp.initDataUnsafe);

      const telegramUser = WebApp.initDataUnsafe?.user;

      console.log('👤 Telegram User Data:', telegramUser);

      if (!telegramUser) {
        // Fallback for testing outside Telegram - DEMO MODE
        console.log('🎮 Demo Mode: Running without Telegram');
        console.log('📝 No API calls will be made');
        console.log('✅ Full flow will work with mock data');
        // Show splash screen for demo mode
        setCurrentFrame('splash');
        return;
      }

      console.log('✅ Telegram user found!');
      console.log('   ID:', telegramUser.id);
      console.log('   Username:', telegramUser.username);
      console.log('   First Name:', telegramUser.first_name);
      console.log('   Last Name:', telegramUser.last_name);

      // Store Telegram user data in state
      setTelegramUserData({
        telegram_id: telegramUser.id,
        telegram_username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        language_code: telegramUser.language_code,
        photo_url: telegramUser.photo_url,
      });

      // SIMPLIFIED: Just check if user exists (backend auto-authenticates based on telegram_id)
      console.log('📤 Checking if user exists...');
      const response = await onboardingAPI.checkUser(telegramUser.id);

      console.log('📥 API Response:', response.data);

      if (response.data.status === 'existing_user') {
        // Existing user - establish session with Web Trader
        console.log('🔄 Existing user detected - establishing session...');

        try {
          // Call telegram-autologin to get fresh session and cookies
          console.log('🔐 Calling telegram-autologin for session...');
          await authService.telegramAutologin(telegramUser.id);
          console.log('✅ Session established successfully');
        } catch (autologinErr) {
          console.warn('⚠️ Telegram autologin failed, continuing with redirect:', autologinErr);
          // Continue even if autologin fails - check-user already returned valid data
        }

        // Redirect to platform
        console.log('🔗 Redirect URL:', response.data.redirect_url);
        window.location.href = response.data.redirect_url;
      } else {
        // New user - start onboarding (show splash screen)
        console.log('🆕 New user detected - starting onboarding flow');
        setCurrentFrame('splash');
      }
    } catch (err) {
      console.error('❌ Error initializing onboarding:', err);
      console.error('   Error message:', err.message);
      console.error('   Error response:', err.response?.data);

      // If there's an API error, show error to user instead of continuing
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Unable to connect to server. Please try again.');
      }

      console.log('⚠️ API Error - Showing splash screen for retry');
      setCurrentFrame('splash');
    }
  };

  const handleSplashComplete = async () => {
    console.log('✅ Splash complete - moving to wheel prompt');
    setCurrentFrame('wheelPrompt');
  };

  const handleSpin = async () => {
    console.log('🎡 Spinning wheel...');
    setCurrentFrame('spinning');

    // Always set reward to "Welcome Bonus" since spinner always stops there
    const welcomeReward = { name: 'Welcome Bonus', description: '$50 bonus' };
    console.log('🎁 Reward selected:', welcomeReward);
    setReward(welcomeReward);
  };

  const handleSpinComplete = async () => {
    console.log('✅ Spin complete - moving to form');
    setCurrentFrame('rewardForm');
  };

  const handleFormSubmit = async (formData) => {
    console.log('📝 Form submission started...');
    console.log('   Form data:', formData);
    console.log('   Telegram user data:', telegramUserData);
    console.log('   Reward:', reward);
    setLoading(true);
    setError(null);

    // SIMPLIFIED: Combine ALL data for one signup call
    const completeData = {
      ...formData,
      ...(telegramUserData || {}), // Telegram data
      reward: reward, // Include reward
    };

    console.log('📦 Complete signup data:', completeData);

    try {
      if (telegramUserData) {
        // Call simplified signup endpoint
        console.log('📤 Calling signup API...');
        const response = await onboardingAPI.signup(completeData);

        console.log('📥 Signup response:', response.data);
        console.log('🔗 Redirect URL:', response.data.redirect_url);
        setRedirectUrl(response.data.redirect_url);
      } else {
        // Demo mode - use mock redirect URL
        console.log('🎮 Demo mode: Signup with complete data:', completeData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUrl = 'https://hedg.com/platform';
        console.log('🔗 Mock redirect URL:', mockUrl);
        setRedirectUrl(mockUrl);
      }

      console.log('✅ Moving to success screen');
      setCurrentFrame('success');
    } catch (err) {
      console.error('❌ Error during signup:', err);
      console.error('   Error message:', err.message);
      console.error('   Error response:', err.response?.data);

      // Set error message to display to user
      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          'Unable to complete signup. Please try again.';
      setError(errorMessage);

      // Stay on the form page - do NOT navigate to success screen
      console.log('⚠️ Staying on form due to signup error');
    } finally {
      setLoading(false);
    }
  };

  const renderFrame = () => {
    console.log('🖼️ Rendering frame:', currentFrame);
    switch (currentFrame) {
      case 'loading':
        return (
          <div className="loading-screen" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#000',
            color: '#fff'
          }}>
            <div className="spinner" style={{
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTop: '4px solid #fff',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '20px', fontSize: '16px' }}>Loading...</p>
          </div>
        );

      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;

      case 'wheelPrompt':
        return <WheelPrompt onSpin={handleSpin} />;

      case 'spinning':
        return <SpinningWheel onSpinComplete={handleSpinComplete} reward={reward} />;

      case 'rewardForm':
        return <RewardForm reward={reward} onSubmit={handleFormSubmit} loading={loading} error={error} telegramUserData={telegramUserData} />;

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
