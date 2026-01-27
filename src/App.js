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
  // State management
  const [currentFrame, setCurrentFrame] = useState('loading');
  const [reward, setReward] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [telegramUserData, setTelegramUserData] = useState(null);

  // Initialize Telegram WebApp on mount
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    initializeOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: Parse error messages from API responses
  const parseErrorMessage = (err, defaultMessage) => {
    if (!err.response?.data) return defaultMessage;

    // Handle nested error structure (data.res contains actual error)
    const errorData = err.response.data.res || err.response.data;

    // If details is an object with a message property
    if (errorData.details && typeof errorData.details === 'object') {
      const detailsMessage = errorData.details.message || JSON.stringify(errorData.details);
      return errorData.message || detailsMessage;
    }

    // If details is a string
    if (errorData.error && errorData.details) {
      return `${errorData.error}: ${errorData.details}`;
    }

    return errorData.message || errorData.error || errorData.details || defaultMessage;
  };

  // Initialize onboarding flow
  const initializeOnboarding = async () => {
    try {
      console.log('🚀 Initializing onboarding...');
      console.log('WebApp object:', WebApp);
      console.log('WebApp.initDataUnsafe:', WebApp.initDataUnsafe);

      const telegramUser = WebApp.initDataUnsafe?.user;

      // Demo mode (no Telegram user)
      if (!telegramUser) {
        console.log('Demo Mode: Running without Telegram');
        setCurrentFrame('splash');
        return;
      }

      // Store Telegram user data
      setTelegramUserData({
        telegram_id: telegramUser.id,
        telegram_username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        language_code: telegramUser.language_code,
        photo_url: telegramUser.photo_url,
        phone_number: telegramUser.phone_number,
      });

      // Check if user exists
      console.log('Checking user with telegram_id:', telegramUser.id);
      const response = await authService.checkUser(telegramUser.id);
      console.log('Check user response:', response);

      if (response.status === 'existing_user') {
        // Existing user: session is already established by checkUser
        console.log('Existing user found, session established');
        if (response.redirect_url) {
          console.log('Redirecting to:', response.redirect_url);
          // Show redirecting message
          setCurrentFrame('loading');
          setRedirectUrl(response.redirect_url);
          // Small delay to show loading state
          await new Promise(resolve => setTimeout(resolve, 500));
          // Redirect within Telegram WebView
         for (const [name, value] of Object.entries(response.cookies)) {
          console.log(`Setting cookie ${name}=${value}`);
          
          // Create cookie string
          let cookieStr = `${name}=${value}; path=/; domain=hedg.com; max-age=${60*60*24*365}; Secure; SameSite=Lax`;
          
          // Set cookie in browser
          document.cookie = cookieStr;
      }
          return; // Stop further execution
        } else {
          console.warn('No redirect_url in response for existing user');
        }
      }

      setCurrentFrame('splash');
    } catch (err) {
      setError(parseErrorMessage(err, 'Unable to connect to server. Please try again.'));
      setCurrentFrame('splash');
    }
  };

  // Frame navigation handlers
  const handleSplashComplete = () => {
    setCurrentFrame('wheelPrompt');
  };

  const handleSpin = () => {
    setCurrentFrame('spinning');
    setReward({ name: 'Welcome Bonus', description: '$50 bonus' });
  };

  const handleSpinComplete = () => {
    setCurrentFrame('rewardForm');
  };

  // Form submission handler
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    const completeData = {
      ...(telegramUserData || {}),
      ...formData,
      reward: reward,
    };

    try {
      if (telegramUserData) {
        // Call backend API - it will handle Web Trader API internally
        console.log('Calling backend signup API with data:', completeData);
        const backendResponse = await onboardingAPI.signup(completeData);

        console.log('Signup successful:', backendResponse.data);

        if (backendResponse.data.redirect_url) {
          console.log('Redirecting to:', backendResponse.data.redirect_url);
          setRedirectUrl(backendResponse.data.redirect_url);
          // Small delay to show success state
          await new Promise(resolve => setTimeout(resolve, 500));
          // Redirect within Telegram WebView after successful signup
          console.log('Redirecting within Telegram...');
          window.location.href = backendResponse.data.redirect_url;
          return; // Stop further execution
        } else {
          console.warn('No redirect_url in signup response');
          setCurrentFrame('success');
        }
      } else {
        // Demo mode: mock signup
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRedirectUrl('https://hedg.com/platform');
        setCurrentFrame('success');
      }
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error details:', err.response?.data);
      setError(parseErrorMessage(err, 'Unable to complete signup. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Render current frame
  const renderFrame = () => {
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
            <p style={{ marginTop: '20px', fontSize: '16px' }}>
              {redirectUrl ? 'Redirecting to trading platform...' : 'Loading...'}
            </p>
          </div>
        );

      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;

      case 'wheelPrompt':
        return <WheelPrompt onSpin={handleSpin} />;

      case 'spinning':
        return <SpinningWheel onSpinComplete={handleSpinComplete} reward={reward} />;

      case 'rewardForm':
        return <RewardForm
          reward={reward}
          onSubmit={handleFormSubmit}
          loading={loading}
          error={error}
          telegramUserData={telegramUserData}
        />;

      case 'success':
        return <SuccessScreen redirectUrl={redirectUrl} />;

      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="App">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      {renderFrame()}
    </div>
  );
}

export default App;
