import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './RewardForm.css';

const RewardForm = ({ reward, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    country: '',
    country_code: '',
  });

  const [errors, setErrors] = useState({});

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
    setFormData(prev => ({
      ...prev,
      phone_number: value.slice(country.dialCode.length),
      country_code: `+${country.dialCode}`,
      country: country.countryCode.toUpperCase()
    }));
    if (errors.phone_number) {
      setErrors(prev => ({ ...prev, phone_number: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
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
            <label htmlFor="full_name">Full name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full name"
              className={errors.full_name ? 'error' : ''}
            />
            {errors.full_name && (
              <span className="error-message">{errors.full_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <PhoneInput
              country={'us'}
              value={formData.country_code + formData.phone_number}
              onChange={handlePhoneChange}
              inputClass={errors.phone_number ? 'error' : ''}
              containerClass="phone-input-container"
              buttonClass="phone-dropdown"
              enableSearch={true}
              searchPlaceholder="Search country..."
            />
            {errors.phone_number && (
              <span className="error-message">{errors.phone_number}</span>
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
