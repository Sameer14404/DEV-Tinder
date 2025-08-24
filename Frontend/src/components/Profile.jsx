import React, { useState, useEffect } from 'react';
import { User, Camera, MapPin, Briefcase, Mail, Globe, Calendar, Code, Save, Eye, Heart, Clock } from 'lucide-react';

const ProfileUpdate = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    photoUrl: '',
    gender: '',
    skills: [],
    about: '',
    location: '',
    profession: '',
    interests: [],
    experienceLevel: 'beginner',
    availability: 'full-time',
    languages: []
  });


  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Input states for array fields
  const [skillsInput, setSkillsInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5001/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const result = await response.json();
          const userData = result.user; // Access user from the response
          console.log('Fetched user data:', userData);
          
          setProfileData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email,
            age: userData.age || '',
            photoUrl: userData.photoUrl || '',
            gender: userData.gender || '',
            skills: userData.skills || [],
            about: userData.about || '',
            location: userData.location || '',
            profession: userData.profession || '',
            interests: userData.interests || [],
            experienceLevel: userData.experienceLevel || 'beginner',
            availability: userData.availability || 'full-time',
            languages: userData.languages || []
          });
          
          // Set array inputs as comma-separated strings
          setSkillsInput(userData.skills?.join(', ') || '');
          setInterestsInput(userData.interests?.join(', ') || '');
          setLanguagesInput(userData.languages?.join(', ') || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      setIsLoadingProfile(false);
    };

    fetchProfile();
  }, []);

  // Calculate profile completion percentage
  useEffect(() => {
    const requiredFields = ['firstName', 'lastName',  'about', 'gender'];
    const importantFields = ['age', 'skills', 'profession', 'location', 'experienceLevel'];
    const optionalFields = ['photoUrl', 'interests', 'availability', 'languages'];
    
    const requiredFilledCount = requiredFields.filter(field => {
      if (field === 'skills') return profileData[field].length > 0;
      return profileData[field]?.toString().trim();
    }).length;
    
    const importantFilledCount = importantFields.filter(field => {
      if (field === 'skills') return profileData[field].length > 0;
      return profileData[field]?.toString().trim();
    }).length;
    
    const optionalFilledCount = optionalFields.filter(field => {
      if (['interests', 'languages'].includes(field)) return profileData[field].length > 0;
      return profileData[field]?.toString().trim();
    }).length;
    
    // Required fields: 50%, Important: 35%, Optional: 15%
    const requiredPercentage = (requiredFilledCount / requiredFields.length) * 50;
    const importantPercentage = (importantFilledCount / importantFields.length) * 35;
    const optionalPercentage = (optionalFilledCount / optionalFields.length) * 15;
    
    setCompletionPercentage(Math.round(requiredPercentage + importantPercentage + optionalPercentage));
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, inputValue, setInputFunction) => {
    setInputFunction(inputValue);
    const arrayValue = inputValue
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    handleInputChange(field, arrayValue);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        alert(result.msg || 'Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    }
    setIsLoading(false);
  };

  const getProgressColor = () => {
    if (completionPercentage >= 80) return 'from-green-500 to-green-600';
    if (completionPercentage >= 60) return 'from-yellow-500 to-orange-500';
    if (completionPercentage >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-600';
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#0f172b] flex items-center justify-center">
        <div className="text-purple-300 text-xl">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172b] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Progress Bar */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-center mb-6">
            Complete Your Profile
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-300 font-medium">Profile Completion</span>
              <span className="text-purple-300 font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-[#1f2937] rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-purple-200 text-sm text-center mt-2">
              {completionPercentage < 60 ? 'Add more details to improve your profile visibility' : 
               completionPercentage < 80 ? 'Great progress! Add a few more details' : 
               'Excellent! Your profile looks amazing'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-[#1f2937] rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">Edit Profile</h2>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition"
                    placeholder="First name (4-12 chars)"
                    minLength={4}
                    maxLength={12}
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition"
                    placeholder="Last name (4-12 chars)"
                    minLength={4}
                    maxLength={12}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
                <div>
                  <label className="block text-purple-300 font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition"
                    placeholder="Age (18-75)"
                    min={18}
                    max={75}
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-purple-300 font-medium mb-3">Gender *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'others'].map((genderOption) => (
                    <button
                      key={genderOption}
                      type="button"
                      onClick={() => handleInputChange('gender', genderOption)}
                      className={`px-4 py-3 rounded-xl font-medium transition duration-300 ${
                        profileData.gender === genderOption
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-[#0f172b] text-purple-300 hover:text-purple-200 border border-purple-500/20'
                      }`}
                    >
                      {genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-2">Photo URL</label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                  <input
                    type="url"
                    value={profileData.photoUrl}
                    onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <p className="text-purple-400/60 text-xs mt-1">Auto-set based on gender if left empty</p>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-2">About *</label>
                <textarea
                  value={profileData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition resize-none"
                  placeholder="Tell us about yourself... (10-200 chars)"
                  minLength={10}
                  maxLength={200}
                />
                <div className="text-right text-xs text-purple-400/60 mt-1">
                  {profileData.about.length}/200
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-2">Skills * (up to 10)</label>
                <div className="relative">
                  <Code className="absolute left-3 top-3 text-purple-400" size={18} />
                  <textarea
                    value={skillsInput}
                    onChange={(e) => handleArrayInputChange('skills', e.target.value, setSkillsInput)}
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition resize-none"
                    placeholder="React, Node.js, Python (comma separated)"
                  />
                </div>
                <div className="text-right text-xs text-purple-400/60 mt-1">
                  {profileData.skills.length}/10 skills
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 font-medium mb-2">Profession</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                    <input
                      type="text"
                      value={profileData.profession}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition"
                      placeholder="Full Stack Developer"
                      maxLength={50}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-purple-300 font-medium mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition"
                      placeholder="San Francisco, CA"
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 font-medium mb-2">Experience Level</label>
                  <select
                    value={profileData.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 font-medium mb-2">Availability</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                    <select
                      value={profileData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition appearance-none"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="freelance">Freelance</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-2">Interests (up to 10)</label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3 text-purple-400" size={18} />
                  <textarea
                    value={interestsInput}
                    onChange={(e) => handleArrayInputChange('interests', e.target.value, setInterestsInput)}
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition resize-none"
                    placeholder="Machine Learning, Open Source, Startups (comma separated)"
                  />
                </div>
                <div className="text-right text-xs text-purple-400/60 mt-1">
                  {profileData.interests.length}/10 interests
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-2">Languages</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-purple-400" size={18} />
                  <textarea
                    value={languagesInput}
                    onChange={(e) => handleArrayInputChange('languages', e.target.value, setLanguagesInput)}
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172b] border border-purple-500/20 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition resize-none"
                    placeholder="English, Spanish, French (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isLoading ? 'Updating...' : 'Save Profile'}
            </button>
          </div>

          {/* Preview Section */}
          <div className="bg-[#1f2937] rounded-3xl p-6 md:p-8 shadow-lg sticky top-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
              <Eye size={24} />
              Live Preview
            </h2>
            
            <div className="bg-[#0f172b] rounded-2xl p-6 border border-purple-500/20">
              {/* Profile Photo */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-purple-500/30">
                  {profileData.photoUrl ? (
                    <img
                      src={profileData.photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User size={40} className="text-white" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">
                  {profileData.firstName || 'First'} {profileData.lastName || 'Last'}
                </h3>
                
                {profileData.profession && (
                  <p className="text-purple-300 text-sm mb-2">{profileData.profession}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-purple-200 flex-wrap justify-center">
                  {profileData.age && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {profileData.age}
                    </span>
                  )}
                  {profileData.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {profileData.location}
                    </span>
                  )}
                  {profileData.experienceLevel && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                      {profileData.experienceLevel}
                    </span>
                  )}
                  {profileData.availability && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                      {profileData.availability}
                    </span>
                  )}
                </div>
              </div>

              {/* About */}
              {profileData.about && (
                <div className="mb-4">
                  <h4 className="text-purple-300 font-medium mb-2 text-sm">About</h4>
                  <p className="text-purple-200 text-sm leading-relaxed">{profileData.about}</p>
                </div>
              )}

              {/* Skills */}
              {profileData.skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-purple-300 font-medium mb-2 text-sm">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {profileData.interests.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-purple-300 font-medium mb-2 text-sm">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-lg border border-pink-500/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {profileData.languages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-purple-300 font-medium mb-2 text-sm">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg border border-blue-500/30"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="pt-4 border-t border-purple-500/20">
                {profileData.email && (
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <Mail size={14} />
                    <span className="truncate">{profileData.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;