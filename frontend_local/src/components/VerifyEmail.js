// In Intellicam/frontend/src/components/VerifyEmail.js

import React, { useState } from 'react';
import api from '../services/api'; // Your API service

/**
 * @param {string} email - The email of the user to verify.
 * @param {function} onVerificationSuccess - Function to call when verification is successful.
 * @param {function} onSwitchToLogin - Function to switch the view back to login.
 */
function VerifyEmail({ email, onVerificationSuccess, onSwitchToLogin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResendMessage(null);

    try {
      // Use the verifyEmail method from your api.js service
      //
      await api.verifyEmail(code, email); // Pass the email
      setLoading(false);
      onVerificationSuccess(); // Tell the parent component it worked
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Invalid or expired code.');
    }
  };

  const handleResend = async () => {
    setError(null);
    setResendMessage(null);
    try {
      // Use the resendVerificationCode method from api.js
      //
      await api.resendVerificationCode(email);
      setResendMessage('A new code has been sent.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend code.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-white">
        Verify Your Email
      </h2>
      <p className="text-center text-gray-300">
        A verification code was sent to <strong>{email}</strong>.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="code" 
            className="block text-sm font-medium text-gray-300"
          >
            Verification Code (OTP)
          </label>
          <input
            id="code"
            name="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {resendMessage && <p className="text-sm text-green-400">{resendMessage}</p>}

        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>

      <div className="text-sm text-center">
        <button
          onClick={handleResend}
          className="font-medium text-blue-400 hover:text-blue-300"
        >
          Didn't receive the code? Resend
        </button>
      </div>
      <div className="text-sm text-center">
        <button
          onClick={onSwitchToLogin}
          className="font-medium text-gray-400 hover:text-gray-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;