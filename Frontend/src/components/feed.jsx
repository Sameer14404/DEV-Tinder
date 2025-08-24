import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, RotateCcw, User } from 'lucide-react';

const TinderFeed = () => {433
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  // Fetch users from feed
  const fetchUsers = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/connections/feed?page=${pageNum}&limit=10`, {
        credentials: 'include'
      });
      const newUsers = await response.json();
      
      if (pageNum === 1) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setIsLoading(false);
  };

  // Send connection request
  const sendConnectionRequest = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:5001/request/send/${status}/${userId}`, {
        method: 'POST',
        credentials: 'include'
      });
      const result = await response.json();
      console.log(result.msg);
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  // Handle swipe actions
  const handleSwipe = (direction, userId) => {
    if (direction === 'right') {
      sendConnectionRequest(userId, 'interested');
    }
    // Move to next card
    setCurrentIndex(prev => prev + 1);
    
    // Load more users if needed
    if (currentIndex >= users.length - 3) {
      setPage(prev => prev + 1);
    }
  };

  // Mouse/Touch event handlers
  const handleDragStart = (clientX, clientY) => {
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (clientX, clientY) => {
    if (!dragStart || !isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    setDragPosition({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!dragStart || !isDragging) return;
    
    const currentUser = users[currentIndex];
    if (!currentUser) return;

    const threshold = 100;
    
    if (Math.abs(dragPosition.x) > threshold) {
      const direction = dragPosition.x > 0 ? 'right' : 'left';
      handleSwipe(direction, currentUser._id);
    }
    
    // Reset drag state
    setDragStart(null);
    setDragPosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Button handlers
  const handlePass = () => {
    const currentUser = users[currentIndex];
    if (currentUser) {
      handleSwipe('left', currentUser._id);
    }
  };

  const handleLike = () => {
    const currentUser = users[currentIndex];
    if (currentUser) {
      handleSwipe('right', currentUser._id);
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchUsers(page);
    }
  }, [page]);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const currentUser = users[currentIndex];
  const nextUser = users[currentIndex + 1];

  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172b] flex items-center justify-center">
        <div className="text-purple-300 text-xl">Loading amazing developers...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0f172b] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
            No More Developers!
          </h2>
          <p className="text-purple-200 mb-8">
            You've seen all available developers. Check back later for more matches!
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setPage(1);
              fetchUsers(1);
            }}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-purple-600 transition duration-300"
          >
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  const rotation = dragPosition.x * 0.1;
  const opacity = 1 - Math.abs(dragPosition.x) / 300;

  return (
    <div className="min-h-screen bg-[#0f172b] flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-center mb-2">
          Discover Developers
        </h1>
        <p className="text-purple-200 text-center">Find your perfect coding partner</p>
      </div>

      {/* Card Stack Container */}
      <div className="relative w-full max-w-md h-[600px] mb-8">
        {/* Next Card (Background) */}
        {nextUser && (
          <div className="absolute inset-0 bg-[#1f2937] rounded-3xl shadow-lg scale-95 opacity-50">
            <div className="h-full flex flex-col">
              <div className="flex-1 relative overflow-hidden rounded-t-3xl">
                {nextUser.photoUrl ? (
                  <img
                    src={nextUser.photoUrl}
                    alt={nextUser.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <User size={80} className="text-white opacity-50" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Card */}
        <div
          ref={cardRef}
          className="absolute inset-0 bg-[#1f2937] rounded-3xl shadow-lg cursor-grab active:cursor-grabbing select-none transition-opacity duration-200"
          style={{
            transform: `translateX(${dragPosition.x}px) translateY(${dragPosition.y}px) rotate(${rotation}deg)`,
            opacity: opacity,
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe Indicators */}
          {Math.abs(dragPosition.x) > 50 && (
            <>
              {dragPosition.x > 0 && (
                <div className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-xl transform rotate-12 z-10">
                  LIKE
                </div>
              )}
              {dragPosition.x < 0 && (
                <div className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-xl transform -rotate-12 z-10">
                  PASS
                </div>
              )}
            </>
          )}

          <div className="h-full flex flex-col">
            {/* Photo Section */}
            <div className="flex-1 relative overflow-hidden rounded-t-3xl">
              {currentUser.photoUrl ? (
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.firstName}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User size={120} className="text-white opacity-70" />
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Info Section */}
            <div className="p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">
                {currentUser.firstName} {currentUser.lastName}
              </h3>
              {currentUser.skills && (
                <p className="text-purple-200 text-sm">
                  Skills: {currentUser.skills}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6">
        <button
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className="w-14 h-14 bg-[#1f2937] rounded-full flex items-center justify-center text-purple-300 hover:text-purple-200 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <RotateCcw size={24} />
        </button>

        <button
          onClick={handlePass}
          className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white hover:from-red-600 hover:to-red-700 transition duration-300 shadow-lg"
        >
          <X size={28} />
        </button>

        <button
          onClick={handleLike}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg"
        >
          <Heart size={28} />
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 text-center">
        <p className="text-purple-300 text-sm">
          {currentIndex + 1} of {users.length} developers
        </p>
      </div>
    </div>
  );
};

export default TinderFeed;