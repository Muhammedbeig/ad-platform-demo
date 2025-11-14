import React, { useState } from 'react';
// We no longer need `signIn` or `GoogleIcon`
import { XIcon } from './icons';

interface SignUpModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  onClose,
  onSwitchToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setSuccess('Account created! Please check your email to verify your account.');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        const errorMessage = await res.text();
        setError(errorMessage);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };
  
  // --- handleGoogleSignIn function removed ---

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
              <p className="text-slate-500 mt-1">Get started by creating your account.</p>
            </div>
            <button 
              onClick={onClose} 
              className="-mt-2 -mr-2 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
              disabled={isLoading}
            >
              <XIcon />
            </button>
          </div>
          
          {/* --- Google Sign Up Button Removed --- */}
          {/* --- "Or continue with" Separator Removed --- */}

          <form onSubmit={handleSignUp} className="mt-6">
            {success && (
              <div
                className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200"
                role="alert"
              >
                {success}
              </div>
            )}

            {error && (
              <div
                className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200"
                role="alert"
              >
                {error}
              </div>
            )}
            
            <fieldset className="space-y-4" disabled={isLoading || !!success}>
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="register-name" 
                  name="name" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input 
                  type="email" 
                  id="register-email" 
                  name="email" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input 
                  type="password" 
                  id="register-password" 
                  name="password" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Must be at least 6 characters.
                </p>
              </div>
            </fieldset>
            
            <div className="mt-6">
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                disabled={isLoading || !!success}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            
            <p className="mt-4 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={onSwitchToLogin} 
                className="font-medium text-indigo-600 hover:text-indigo-700"
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;