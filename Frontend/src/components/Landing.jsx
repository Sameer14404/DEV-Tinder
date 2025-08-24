import React from "react";
import logo from "../assets/logo.png";
import aiImg from "../assets/ai.png";
import collabImg from "../assets/collab.png";
import communityImg from "../assets/community.png";
import futureImg from "../assets/trusted.png";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[#0f172b] flex flex-col items-center text-center px-6 pt-5">
      {/* Get Started Button */}
      <button className=" w-80 absolute top-6 right-6 px-4 py-2 md:px-6 md:py-3 rounded-2xl text-sm md:text-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition">
        Get Started
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
        <img src={logo} alt="DevTinder Logo" className="w-32 h-32 md:w-40 md:h-40 rounded-2xl" />
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Welcome to DevTinder
          </h1>
          <p className="mt-4 text-base md:text-xl text-purple-200 max-w-xl">
            Where developers connect, collaborate, and spark ideas. Find your coding match and start building something amazing together!
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-6xl w-full">
        <div className="bg-[#1f2937] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center text-white shadow-lg hover:shadow-purple-600 transition duration-300">
          <img src={aiImg} alt="AI Assistant" className="w-32 h-32 md:w-42 md:h-42 rounded-xl mb-4 md:mb-0 md:mr-6" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-purple-300">AI Assistant</h2>
            <p className="mt-2 md:mt-4 text-purple-200 text-sm md:text-base">Smart code partner to boost productivity and enhance your workflow.</p>
          </div>
        </div>

        <div className="bg-[#1f2937] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center text-white shadow-lg hover:shadow-purple-600 transition duration-300">
          <img src={collabImg} alt="Developer Collaboration" className="w-32 h-32 md:w-42 md:h-42 rounded-xl mb-4 md:mb-0 md:mr-6" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-purple-300">Collab with Devs</h2>
            <p className="mt-2 md:mt-4 text-purple-200 text-sm md:text-base">Pair up with like-minded coders and build innovative projects together.</p>
          </div>
        </div>

        <div className="bg-[#1f2937] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center text-white shadow-lg hover:shadow-purple-600 transition duration-300">
          <img src={communityImg} alt="Community" className="w-32 h-32 md:w-42 md:h-42 rounded-xl mb-4 md:mb-0 md:mr-6" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-purple-300">Join the Community</h2>
            <p className="mt-2 md:mt-4 text-purple-200 text-sm md:text-base">Be part of a trusted, vibrant, and passionate developer circle.</p>
          </div>
        </div>

        <div className="bg-[#1f2937] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center text-white shadow-lg hover:shadow-purple-600 transition duration-300">
          <img src={futureImg} alt="Futuristic Platform" className="w-32 h-32 md:w-42 md:h-42 rounded-xl mb-4 md:mb-0 md:mr-6" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-purple-300">Futuristic Platform</h2>
            <p className="mt-2 md:mt-4 text-purple-200 text-sm md:text-base">Experience next-gen tools designed for modern developers.</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mt-8 max-w-6xl w-full flex flex-col md:flex-row items-center justify-around bg-[#1f2937] rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-300">10k+ Active Users</h2>
          <p className="mt-2 text-purple-200 text-sm md:text-base">Join a thriving community of developers worldwide.</p>
        </div>
        <div className="text-center mt-6 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-300">95% Match Rate</h2>
          <p className="mt-2 text-purple-200 text-sm md:text-base">Top-rated platform for developer collaboration.</p>
        </div>
      </div>
    </div>
  );
}