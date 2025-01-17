import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SplitText from "./SplitText";


const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    password: "",
    confirmPassword: "",
    loginUserId: "",
    loginPassword: "",
  });

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const API_BASE_URL = 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignUp ? `${API_BASE_URL}/signup` : `${API_BASE_URL}/login`;
    const data = isSignUp
      ? { name: formData.name, userId: formData.userId, password: formData.password }
      : { userId: formData.loginUserId, password: formData.loginPassword };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        if (!isSignUp) {
          onLogin(result.user); // Pass user details to the parent component
          navigate('/daynote'); // Redirect to DayNote page after successful login
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const styles = {
    container: {
      margin: 0,
      fontFamily: '"Roboto", sans-serif', // Updated to a more professional font
      backgroundColor: '#f7f9fc',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#333',
      flexDirection: 'column', // Ensures that items stack vertically
      padding: '20px', // Adds padding to avoid edge-to-edge layout
    },
    box: {
      width: '400px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column', // Aligns form elements vertically
      alignItems: 'center', // Centers elements horizontally
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#007bff',
      textAlign: 'center',
    },
    label: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '5px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '10px',
      background: '#007bff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      color: 'white',
      cursor: 'pointer',
      marginTop: '10px',
    },
    toggleButton: {
      marginTop: '10px',
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    imageBox: {
      width: '80%',
      height: '250px', // Set a fixed height for the image box
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '10px',
      marginBottom: '20px',
    },
    font: {
      fontStyle: 'Georgia',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      background: 'linear-gradient(90deg, rgba(255, 102, 0, 1) 0%, rgba(255, 153, 0, 1) 100%)',
      color: '#fff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      transition: 'background-color 0.3s ease',
    },
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        {/* Image Box */}
        <div
          style={{
            ...styles.imageBox,
            backgroundImage: 'url("logo.jpg")', // Add your image URL here
          }}
        />
        <SplitText
          style={styles.font}
          text="Welcome..!"
          className="text-xl font- text-center"
          delay={150}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        />
        <h1 style={styles.title}>{isSignUp ? "Sign Up" : "Login"}</h1>
        <form onSubmit={handleSubmit}>
          {isSignUp ? (
            <>
              <label htmlFor="name" style={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                style={styles.input}
              />
              <label htmlFor="userId" style={styles.label}>User ID</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Enter a unique User ID"
                style={styles.input}
              />
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                style={styles.input}
              />
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                style={styles.input}
              />
            </>
          ) : (
            <>
              <label htmlFor="loginUserId" style={styles.label}>User ID</label>
              <input
                type="text"
                id="loginUserId"
                name="loginUserId"
                value={formData.loginUserId}
                onChange={handleChange}
                placeholder="Enter your User ID"
                style={styles.input}
              />
              <label htmlFor="loginPassword" style={styles.label}>Password</label>
              <input
                type="password"
                id="loginPassword"
                name="loginPassword"
                value={formData.loginPassword}
                onChange={handleChange}
                placeholder="Enter your password"
                style={styles.input}
              />
            </>
          )}
          <button type="submit" style={styles.button}>
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} style={styles.toggleButton}>
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
  
};

export default LoginPage;
