import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './RewardForm.css';

const RewardForm = ({ reward, onSubmit, loading, error, telegramUserData }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country_id: '',
    country_code: '',
  });

  const [fullPhoneNumber, setFullPhoneNumber] = useState(''); // Store full number with country code for input
  const [errors, setErrors] = useState({});
  const [detectedCountry, setDetectedCountry] = useState('us');

  // Auto-populate first_name, last_name, and phone from Telegram if available
  useEffect(() => {
    if (telegramUserData) {
      const phoneNumber = telegramUserData.phone_number || '';
      setFullPhoneNumber(phoneNumber);
      setFormData(prev => ({
        ...prev,
        first_name: telegramUserData.first_name || '',
        last_name: telegramUserData.last_name || '',
        phone: phoneNumber,
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
    // Store the full phone number for the input display
    setFullPhoneNumber(value);

    // Remove the country code from the phone number for submission
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
      newErrors.first_name = 'REWARD_FORM_FIRST_NAME_ERROR';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'REWARD_FORM_LAST_NAME_ERROR';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'REWARD_FORM_EMAIL_ERROR_REQUIRED';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'REWARD_FORM_EMAIL_ERROR_INVALID';
    }

    if (!formData.phone) {
      newErrors.phone = 'REWARD_FORM_PHONE_ERROR';
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
      <h1 className="page-title">{t('REWARD_FORM_TITLE')}</h1>

      {/* Subtitle */}
      <p className="page-subtitle">{t('REWARD_FORM_SUBTITLE')}</p>

      {/* Form container */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="reward-form">
          <div className="form-group">
            <label htmlFor="first_name">{t('REWARD_FORM_FIRST_NAME_LABEL')}</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder={t('REWARD_FORM_FIRST_NAME_PLACEHOLDER')}
              className={errors.first_name ? 'error' : ''}
            />
            {errors.first_name && (
              <span className="error-message">{t(errors.first_name)}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">{t('REWARD_FORM_LAST_NAME_LABEL')}</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder={t('REWARD_FORM_LAST_NAME_PLACEHOLDER')}
              className={errors.last_name ? 'error' : ''}
            />
            {errors.last_name && (
              <span className="error-message">{t(errors.last_name)}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t('REWARD_FORM_PHONE_LABEL')}</label>
            <PhoneInput
              country={detectedCountry}
              value={fullPhoneNumber}
              onChange={handlePhoneChange}
              inputClass={errors.phone ? 'error' : ''}
              containerClass="phone-input-container"
              buttonClass="phone-dropdown"
              enableSearch={true}
              searchPlaceholder={t('REWARD_FORM_PHONE_SEARCH_PLACEHOLDER')}
              autoFormat={true}
              preferredCountries={['us', 'gb', 'ca', 'au']}
            />
            {errors.phone && (
              <span className="error-message">{t(errors.phone)}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('REWARD_FORM_EMAIL_LABEL')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('REWARD_FORM_EMAIL_PLACEHOLDER')}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{t(errors.email)}</span>
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
              <span className="loading-spinner">⏳ {t('REWARD_FORM_SUBMIT_LOADING')}</span>
            ) : (
              t('REWARD_FORM_SUBMIT_BUTTON')
            )}
          </button>

          <p className="security-note">{t('REWARD_FORM_SECURITY_NOTE')}</p>
        </form>
      </div>
    </div>
  );
};

export default RewardForm;
