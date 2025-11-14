'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          const res = await fetch('/api/verify-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (res.ok) {
            const data = await res.json();
            setStatus('success');
            setMessage(data.message || 'Email verified successfully!');
          } else {
            const data = await res.json();
            setStatus('error');
            setMessage(data.message || 'Verification failed. Invalid or expired token.');
          }
        } catch (error) {
          setStatus('error');
          setMessage('An unexpected error occurred.');
        }
      };

      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900">{message}</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* Checkmark Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Email Verified!</h1>
            <p className="text-gray-600 mt-2">{message}</p>
            <p className="text-gray-600 mt-2">You can now log in to your account.</p>
            <Link href="/" className="mt-4 inline-block text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5">
              Go to Homepage
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* X Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Verification Failed</h1>
            <p className="text-gray-600 mt-2">{message}</p>
            <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
              Go to Homepage
            </Link>
          </>
        )}
      </div>
    </div>
  );
}