import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthPages = () => {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'signup'
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    photoUrl: '',
    skills: ''
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         credentials: "include",
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Login successful!');
        // Handle successful login (redirect, update state, etc.)
      } else {
        alert(result.msg || 'Login failed');
      }
    } catch (error) {
      alert('Error during login');
    }
  };

  const handleSignupSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Signup successful!');
        setCurrentPage('login'); // Redirect to login page
      } else {
        alert(result.msg || 'Signup failed');
      }
    } catch (error) {
      alert('Error during signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172b] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md md:max-w-lg">
        {/* Page Toggle Buttons */}
        <div className="flex mb-8 bg-[#1f2937] rounded-3xl p-2 shadow-lg">
          <button
            onClick={() => setCurrentPage('login')}
            className={`flex-1 py-4 px-6 rounded-2xl font-medium transition duration-300 ${
              currentPage === 'login'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'text-purple-300 hover:text-purple-200 hover:bg-[#374151]/30'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentPage('signup')}
            className={`flex-1 py-4 px-6 rounded-2xl font-medium transition duration-300 ${
              currentPage === 'signup'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'text-purple-300 hover:text-purple-200 hover:bg-[#374151]/30'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {currentPage === 'login' && (
          <div className="bg-[#1f2937] rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-purple-600/20 transition duration-300">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-3">
                Welcome Back!
              </h1>
              <p className="text-purple-200 text-lg">Sign in to your DevTinder account</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-5 py-4 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full px-5 py-4 pr-12 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition duration-300"
                  >
                    {showLoginPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLoginSubmit}
                className="w-full py-4 px-6 rounded-2xl font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-lg hover:shadow-purple-600/50 text-lg mt-8"
              >
                Sign In
              </button>
            </div>

            <p className="text-center text-purple-200 mt-8 text-base">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-purple-400 hover:text-purple-300 font-medium transition duration-300"
              >
                Sign up here
              </button>
            </p>
          </div>
        )}

        {/* Signup Form */}
        {currentPage === 'signup' && (
          <div className="bg-[#1f2937] rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-purple-600/20 transition duration-300">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-3">
                Join DevTinder!
              </h1>
              <p className="text-purple-200 text-lg">Create your developer profile</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    className="w-full px-5 py-4 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    className="w-full px-5 py-4 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={signupData.age}
                    onChange={handleSignupChange}
                    className="w-full px-5 py-4 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                    placeholder="Age"
                    min="18"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="w-full px-5 py-4 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">Password</label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="w-full px-5 py-4 pr-12 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition duration-300"
                  >
                    {showSignupPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">Photo URL</label>
                <input
                  type="url"
                  name="photoUrl"
                  value={signupData.photoUrl}
                  onChange={handleSignupChange}
                  className="w-full px-5 py-4 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-3 text-sm md:text-base">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={signupData.skills}
                  onChange={handleSignupChange}
                  className="w-full px-5 py-4 bg-[#0f172b] border border-purple-500/20 rounded-2xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition duration-300 text-base"
                  placeholder="React, Node.js, Python, etc."
                />
              </div>

              <button
                onClick={handleSignupSubmit}
                className="w-full py-4 px-6 rounded-2xl font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-lg hover:shadow-purple-600/50 text-lg mt-8"
              >
                Create Account
              </button>
            </div>

            <p className="text-center text-purple-200 mt-8 text-base">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-purple-400 hover:text-purple-300 font-medium transition duration-300"
              >
                Sign in here
              </button>
            </p>
          </div>
        )}

        {/* Back to Landing Button */}
        <div className="text-center mt-8">
          <button className="text-purple-300 hover:text-purple-200 transition duration-300 text-base">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;