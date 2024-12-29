import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    role: "",
    password: "",
    confirmPassword: "",
    loginUserId: "",
    loginPassword: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
   const API_BASE_URL = 'https://notes-backend-ds62.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   const endpoint = isSignUp ? `${API_BASE_URL}/signup` : `${API_BASE_URL}/login`;
    const data = isSignUp
      ? { name: formData.name, userId: formData.userId, role: formData.role, password: formData.password }
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
          onLogin(result.user); // Pass the user details to the parent component
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
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      backgroundColor: '#fce4ec',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#333',
    },
    photo: {
      width: '100%',
      height: '300px',
      objectFit: 'cover',
      borderBottom: '2px solid #f48fb1',
    },
    box: {
      width: '400px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      textAlign: 'center',
    },
    sliderContainer: {
      display: 'flex',
      width: '180%',
    },
    slider: {
      width: '45%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      background: '#f8bbd0',
      zIndex: -1,
      transition: 'transform 0.6s ease-in-out',
    },
    formContainer: {
      width: '50%',
      padding: '20px',
      textAlign: 'left',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#f48fb1',
      textAlign: 'center',
    },
    label: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px',
      display: 'block',
    },
    input: {
      width: '90%',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '10px',
      background: '#f48fb1',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '10px',
    },
    buttonHover: {
      background: '#ec407a',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <img src="https://files.oaiusercontent.com/file-Hnx2zGgJV26pRpv7AVjJtA?se=2024-12-27T06%3A11%3A55Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Da6d2c2fe-5cea-4e32-a78d-7ad3a2e4cc72.webp&sig=83R0eajcOapHQ/lQraIP5%2BsuFnyR7glSdRFWV8Ypetc%3D" alt="Couple Icon" style={styles.photo} />
        <div style={styles.sliderContainer}>
          <div style={styles.slider}></div>
          <div style={styles.formContainer}>
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
                  <label htmlFor="role" style={styles.label}>Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="">Select Role</option>
                    <option value="gf">Girlfriend</option>
                    <option value="bf">Boyfriend</option>
                  </select>
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
            <button onClick={() => setIsSignUp(!isSignUp)} style={styles.button}>
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
