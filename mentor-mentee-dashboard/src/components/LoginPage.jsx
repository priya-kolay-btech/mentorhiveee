// src/LoginPage.jsx
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Top Right Navbar */}
      <div className="absolute top-4 right-6 flex gap-6 text-sm font-medium text-gray-700">
        <a href="#" className="hover:text-sky-500">Help</a>
        <a href="#" className="hover:text-sky-500">Personalize</a>
        <a href="#" className="hover:text-sky-500">System News</a>
      </div>

      {/* Main container */}
      <div className="flex border-4 border-sky-400 bg-white shadow-lg rounded-none max-w-4xl w-full">
        
        {/* Left side - Image */}
        <div className="w-1/2 border-r-4 border-sky-400">
          <img
            src="https://www.kiit.ac.in/wp-content/uploads/2019/02/kiit-campus.jpg"
            alt="KIIT Campus"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          {/* Welcome Text */}
          <h1 className="text-2xl font-bold text-green-700 text-center mb-2">
            Welcome to KIIT World
          </h1>
          <p className="text-sm text-gray-700 text-center mb-6">
            INDIA's first university to implement SAP in all its schools and processes at a time
          </p>

          {/* Login Form */}
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium">User *</label>
              <input
                type="text"
                className="border border-gray-400 px-3 py-2 w-full focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password *</label>
              <input
                type="password"
                className="border border-gray-400 px-3 py-2 w-full focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-400 hover:bg-sky-500 text-white py-2 font-semibold"
            >
              Log On
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            Copyright © SAP AG. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}




