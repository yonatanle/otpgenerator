import React, { useState } from 'react';

const MyForm = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle email submission
  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    try {
      setMessage("Sending OTP...");
      // Send request to server to generate OTP
      const response = await fetch('http://localhost:5000/api/otp/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send OTP. Please try again later.');
    }
  };
 // Function to handle password submission
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    console.log('Password submitted:', email, password);
    
    try {
      // Send request to server to check OTP validity
      const response = await fetch('http://localhost:5000/api/otp/check-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error sending password:', error);
      setMessage('Failed to send password. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ fontFamily: 'Arial, sans-serif', color: '#007bff' }}>OTP Generator</h1>
      <form>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc', width: '100%' }}
        />
        <br />
        <button
          type="button"
          onClick={handleEmailSubmit}
          style={{ marginTop: '10px', padding: '10px', borderRadius: '3px', backgroundColor: '#007bff', color: '#fff', border: 'none', width: '100%' }}
        >
          Submit Email
        </button>
        <br />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginTop: '10px', marginBottom: '10px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc', width: '100%' }}
        />
        <br />
        <button
          type="button"
          onClick={handlePasswordSubmit}
          style={{ marginTop: '10px', padding: '10px', borderRadius: '3px', backgroundColor: '#007bff', color: '#fff', border: 'none', width: '100%' }}
        >
          Submit Password
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default MyForm;