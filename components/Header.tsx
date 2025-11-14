'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
// --- Import new modal ---
import CreateAdModal from './CreateAdModal';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  // --- Add state for new modal ---
  const [showCreateAd, setShowCreateAd] = useState(false);

  const switchToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const switchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const isLoading = status === 'loading';

  return (
    <>
      <nav className="bg-white shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                AdPlatform
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              {isLoading && (
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
              )}

              {/* 2. Logged Out State */}
              {!isLoading && !session && (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign Up
                  </button>
                </>
              )}

              {/* 3. Logged In State */}
              {!isLoading && session && (
                <>
                  {/* --- Add "Post Ad" button --- */}
                  <button
                    onClick={() => setShowCreateAd(true)}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Post Ad
                  </button>

                  <span className="text-sm text-gray-700 hidden sm:inline">
                    Hi, {session.user?.name}
                  </span>
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="User"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={switchToSignUp}
        />
      )}
      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
          onSwitchToLogin={switchToLogin}
        />
      )}

      {/* --- Render new ad modal --- */}
      {showCreateAd && (
        <CreateAdModal onClose={() => setShowCreateAd(false)} />
      )}
    </>
  );
};

export default Header;