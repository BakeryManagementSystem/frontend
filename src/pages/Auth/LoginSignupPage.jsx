// pages/Auth/LoginSignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext provides setUser or similar
import '../Auth/LoginSignupPage.css'; // Adjust path if needed

const LoginSignupPage = () => {
    const [isActive, setIsActive] = useState(false); // For toggling between sign-in and sign-up
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        user_type: '',
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({}); // For validation errors
    const navigate = useNavigate();
    const { setUser } = useAuth(); // Assuming AuthContext has setUser to store authenticated user

    const togglePanel = () => {
        setIsActive(!isActive);
        setErrors({}); // Clear errors on toggle
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleUserTypeSelect = (type) => {
        setSignupData({ ...signupData, user_type: type });
    };

    const validateSignup = () => {
        const newErrors = {};
        if (!signupData.name) newErrors.name = 'Name is required';
        if (!signupData.email) newErrors.email = 'Email is required';
        if (!signupData.password || signupData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!signupData.user_type) newErrors.user_type = 'User type is required';
        return newErrors;
    };

    const validateLogin = () => {
        const newErrors = {};
        if (!loginData.email) newErrors.email = 'Email is required';
        if (!loginData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const validationErrors = validateSignup();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors({ general: errorData.message || 'Registration failed' });
                return;
            }

            alert('User Registered Successfully'); // Pop-up message
            togglePanel(); // Switch to login panel
        } catch (error) {
            setErrors({ general: 'An error occurred during registration' });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validateLogin();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors({ general: errorData.message || 'Invalid credentials' });
                return;
            }

            const { user } = await response.json();
            setUser(user); // Store user in context
            // Optionally store in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(user));

            // Route based on user_type
            if (user.user_type === 'customer') {
                navigate('/BuyerPage');
            } else {
                navigate('/OwnerPage');
            }
        } catch (error) {
            setErrors({ general: 'An error occurred during login' });
        }
    };

    return (
        <div className="auth-page-background">
            <h1 className="main-heading">Bakery App</h1>
            <div className={`container ${isActive ? 'active' : ''}`}>
                {/* Sign Up Form */}
                <div className="form-container sign-up">
                    <form onSubmit={handleSignup}>
                        <h1>Create Account</h1>
                        <div className="social-icons">
                            {/* Add social links if needed */}
                        </div>
                        <span>or use your email for registration</span>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={signupData.name}
                            onChange={handleSignupChange}
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <p className="field-error">{errors.name}</p>}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={signupData.email}
                            onChange={handleSignupChange}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <p className="field-error">{errors.email}</p>}
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={handleSignupChange}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <p className="field-error">{errors.password}</p>}

                        <div className="user-type-selector">
                            <span className="type-label">Select User Type</span>
                            <div className="type-options">
                                <label className={`type-option ${signupData.user_type === 'customer' ? 'selected' : ''}`}>
                                    <input type="radio" name="user_type" onChange={() => handleUserTypeSelect('customer')} />
                                    <span className="option-text">Customer</span>
                                </label>
                                <label className={`type-option ${signupData.user_type === 'admin' ? 'selected' : ''}`}>
                                    <input type="radio" name="user_type" onChange={() => handleUserTypeSelect('admin')} />
                                    <span className="option-text">Admin</span>
                                </label>
                                <label className={`type-option ${signupData.user_type === 'staff' ? 'selected' : ''}`}>
                                    <input type="radio" name="user_type" onChange={() => handleUserTypeSelect('staff')} />
                                    <span className="option-text">Staff</span>
                                </label>
                            </div>
                            {errors.user_type && <p className="user-type-error field-error">{errors.user_type}</p>}
                        </div>

                        <button type="submit">Sign Up</button>
                        {errors.general && <p className="field-error">{errors.general}</p>}
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in">
                    <form onSubmit={handleLogin}>
                        <h1>Sign In</h1>
                        <div className="social-icons">
                            {/* Add social links if needed */}
                        </div>
                        <span>or use your email password</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <p className="field-error">{errors.email}</p>}
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <p className="field-error">{errors.password}</p>}
                        <a href="#">Forget Your Password?</a>
                        <button type="submit">Sign In</button>
                        {errors.general && <p className="field-error">{errors.general}</p>}
                    </form>
                </div>

                {/* Toggle Panels */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button className="hidden" onClick={togglePanel}>Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <button className="hidden" onClick={togglePanel}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignupPage;