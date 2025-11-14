import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { XIcon, GoogleIcon } from './icons';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onSwitchToSignUp,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const checkResponse = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        setError(checkData.error || 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.refresh();
        onClose();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google');
  };

  return (
    <div 
      // --- FIXED OPACITY ---
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
              <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
              <p className="text-slate-500 mt-1">Welcome back! Sign in to continue.</p>
            </div>
            <button 
              onClick={onClose} 
              className="-mt-2 -mr-2 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
              disabled={isLoading}
            >
              <XIcon />
            </button>
          </div>
          
          <div className="mt-6">
            <button 
              onClick={handleGoogleSignIn} 
              className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition shadow-sm"
              disabled={isLoading}
            >
              <GoogleIcon />
              Sign in with Google
            </button>
          </div>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="mx-4 flex-shrink text-slate-400 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-slate-300"></div>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div
                className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200"
                role="alert"
              >
                <p className="font-medium">⚠️ {error}</p>
              </div>
            )}
            
            <fieldset className="space-y-4" disabled={isLoading}>
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input 
                  type="email" 
                  id="login-email" 
                  name="email" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input 
                  type="password" 
                  id="login-password" 
                  name="password" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </fieldset>
            
            <div className="mt-6">
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
            
            <p className="mt-4 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={onSwitchToSignUp} 
                className="font-medium text-indigo-600 hover:text-indigo-700"
                disabled={isLoading}
              >
                Register
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;