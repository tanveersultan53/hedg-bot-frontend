import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './RewardForm.css';

const RewardForm = ({ reward, onSubmit, loading, error, telegramUserData }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country_id: '',
    country_code: '',
  });

  const [errors, setErrors] = useState({});
  const [detectedCountry, setDetectedCountry] = useState('us');

  // Auto-populate first_name, last_name, and phone from Telegram if available
  useEffect(() => {
    if (telegramUserData) {
      console.log('📝 Auto-populating form with Telegram data:', telegramUserData);
      setFormData(prev => ({
        ...prev,
        first_name: telegramUserData.first_name || '',
        last_name: telegramUserData.last_name || '',
        phone: telegramUserData.phone_number || '',
      }));
    }
  }, [telegramUserData]);

  // Auto-detect user's country on component mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Using ipapi.co for geolocation (free tier available)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          setDetectedCountry(data.country_code.toLowerCase());
        }
      } catch (error) {
        console.log('Could not detect country, using default (US)');
        // Fallback to US if detection fails
        setDetectedCountry('us');
      }
    };

    detectCountry();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value, country) => {
    // Remove the country code from the phone number
    const phoneWithoutCountryCode = value.replace(country.dialCode, '');

    setFormData(prev => ({
      ...prev,
      phone: phoneWithoutCountryCode,
      country_code: `+${country.dialCode}`,
      country_id: country.countryCode.toUpperCase()
    }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="reward-form-container">
      {/* Background ellipses */}
      <div className="ellipse-cyan"></div>
      <div className="ellipse-orange-bottom"></div>
      <div className="ellipse-orange-top"></div>

      {/* Main title */}
      <h1 className="page-title">Claim Your Exclusive Reward Now</h1>

      {/* Subtitle */}
      <p className="page-subtitle">Fill your details to claim your reward</p>

      {/* Form container */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="reward-form">
          <div className="form-group">
            <label htmlFor="first_name">First name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First name"
              className={errors.first_name ? 'error' : ''}
            />
            {errors.first_name && (
              <span className="error-message">{errors.first_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last name"
              className={errors.last_name ? 'error' : ''}
            />
            {errors.last_name && (
              <span className="error-message">{errors.last_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <PhoneInput
              country={detectedCountry}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputClass={errors.phone ? 'error' : ''}
              containerClass="phone-input-container"
              buttonClass="phone-dropdown"
              enableSearch={true}
              searchPlaceholder="Search country..."
              autoFormat={true}
              preferredCountries={['us', 'gb', 'ca', 'au']}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="linda@framcreative.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {error && (
            <div className="api-error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">⏳ Processing...</span>
            ) : (
              'Submit & Continue'
            )}
          </button>

          <p className="security-note">Your information is kept secure and confidential.</p>
        </form>
      </div>
    </div>
  );
};

export default RewardForm;
