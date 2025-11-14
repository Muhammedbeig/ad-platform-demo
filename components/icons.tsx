import React from 'react';

// XIcon is correct
export const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

// --- UPDATED GoogleIcon ---
// This now uses the full-color, 4-path SVG
export const GoogleIcon = () => (
  <svg className="h-5 w-5 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.35 12.24C21.35 11.53 21.29 10.84 21.17 10.16H12V14.28H17.2C17 15.64 16.2 16.8 15.08 17.62V20.28H18.39C20.21 18.63 21.35 15.7 21.35 12.24Z" fill="#4285F4"/>
    <path d="M12 22C14.7 22 17.01 21.1 18.39 19.68L15.08 17.02C14.04 17.7 12.8 18.12 12 18.12C9.56 18.12 7.42 16.5 6.64 14.18H3.29V16.92C4.7 19.98 8.04 22 12 22Z" fill="#34A853"/>
    <path d="M6.64 13.58C6.46 13.06 6.36 12.53 6.36 12C6.36 11.47 6.46 10.94 6.64 10.42V7.68H3.29C2.49 9.22 2 10.56 2 12C2 13.44 2.49 14.78 3.29 16.32L6.64 13.58Z" fill="#FBBC05"/>
    <path d="M12 5.88C13.25 5.88 14.36 6.3 15.22 7.1L18.47 3.86C17.01 2.5 14.7 1.8 12 1.8C8.04 1.8 4.7 4.02 3.29 7.08L6.64 9.82C7.42 7.5 9.56 5.88 12 5.88Z" fill="#EA4335"/>
  </svg>
);