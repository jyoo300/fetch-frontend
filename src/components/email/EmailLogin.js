import React, { useState } from 'react';
import './EmailLogin.css';

const EmailLogin = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation for email and name
    if (!email || !name) {
      setErrorMessage('Please enter name and email.');
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
  
    setErrorMessage('');
  
    // Set up the request body
    const body = {
      name,
      email,
    };
  
    try {
      // Make the POST request to the API endpoint with credentials included
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include', // Include credentials (cookies) with the request
      });
  
      // If the response is not JSON, try to handle it as text
      if (response.ok) {
        // Extract the auth token from the Set-Cookie header
        // const authToken = response.headers.get('set-cookie'); // This is where you'd look for the fetch-access-token cookie
  
        // if (authToken) {
        //   console.log('Auth Token:', authToken);
        //   // Optionally, save it to localStorage for future use (if required)
        //   // localStorage.setItem('authToken', authToken);
        // } else {
        //   console.error('Auth token not found in response headers');
        // }
        setLoggedIn(true);
        alert('Login successful!');
      } else {
        // Handle non-200 responses
        const errorText = await response.text(); // Read the response as text
        setErrorMessage(`Login failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            />
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    );
  };
  
  export default EmailLogin;