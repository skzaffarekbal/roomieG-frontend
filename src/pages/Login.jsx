import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/userSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginApi, registerApi } from '../api/authApi';

function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') !== 'register';
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setAuthMode = (mode) => {
    setSearchParams({ mode });
    setError('');
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const login = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await loginApi({
        emailId: email,
        password,
      });
      dispatch(addUser(data.user));
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error?.response?.data?.error || 'Something Went Wrong...');
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await registerApi({
        firstName,
        lastName,
        emailId: email,
        password,
      });
      dispatch(addUser(data.user));
      setLoading(false);
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error?.response?.data?.error || 'Something Went Wrong...');
    }
  };

  return (
    <div className='flex-1 flex items-center justify-center p-4 sm:p-6 my-6'>
      <div className='card bg-base-100 border border-base-300 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden'>
        {/* Card Header with Tab Switcher */}
        <div className='p-6 pb-2 text-center space-y-2'>
          <div className='inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary text-2xl mx-auto'>
            🏡
          </div>
          <h2 className='text-2xl font-black text-base-content'>
            {isLogin ? 'Welcome Back!' : 'Join RoomieG'}
          </h2>
          <p className='text-xs opacity-70'>
            {isLogin
              ? 'Enter your credentials to continue discovery'
              : 'Sign up to find compatible roommates in your city'}
          </p>

          {/* Segmented Switcher */}
          <div className='grid grid-cols-2 gap-1 p-1 bg-base-200 rounded-2xl mt-4'>
            <button
              type='button'
              onClick={() => setAuthMode('login')}
              className={`btn btn-sm rounded-xl font-bold transition-all ${
                isLogin ? 'btn-primary shadow-sm' : 'btn-ghost text-base-content opacity-70'
              }`}
            >
              Log In
            </button>
            <button
              type='button'
              onClick={() => setAuthMode('register')}
              className={`btn btn-sm rounded-xl font-bold transition-all ${
                !isLogin ? 'btn-primary shadow-sm' : 'btn-ghost text-base-content opacity-70'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={isLogin ? login : register} className='card-body p-6 pt-2 space-y-3.5'>
          {error && (
            <div className='alert alert-error text-white text-xs font-semibold rounded-2xl p-3 shadow-sm'>
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className='grid grid-cols-2 gap-3'>
              <div className='form-control'>
                <label className='label py-1 text-xs font-semibold' htmlFor='firstName'>
                  First Name
                </label>
                <input
                  type='text'
                  className='input input-bordered input-sm rounded-xl bg-base-200/50'
                  id='firstName'
                  placeholder='John'
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className='form-control'>
                <label className='label py-1 text-xs font-semibold' htmlFor='lastName'>
                  Last Name
                </label>
                <input
                  type='text'
                  className='input input-bordered input-sm rounded-xl bg-base-200/50'
                  id='lastName'
                  placeholder='Doe'
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className='form-control'>
            <label className='label py-1 text-xs font-semibold' htmlFor='email'>
              Email Address
            </label>
            <input
              type='email'
              className='input input-bordered rounded-xl bg-base-200/50 text-sm w-full'
              id='email'
              placeholder='you@example.com'
              required
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='form-control'>
            <label className='label py-1 text-xs font-semibold' htmlFor='password'>
              Password
            </label>
            <div className='relative w-full'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='input input-bordered rounded-xl bg-base-200/50 text-sm w-full pr-14'
                id='password'
                placeholder='••••••••'
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-75'
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className='pt-2'>
            <button
              type='submit'
              className='btn btn-primary btn-block rounded-2xl font-bold shadow-lg shadow-primary/20'
              disabled={loading}
            >
              {loading ? (
                <span className='loading loading-spinner loading-sm'></span>
              ) : isLogin ? (
                'Log In 🚀'
              ) : (
                'Create Account 🎉'
              )}
            </button>
          </div>

          <div className='text-center pt-2 text-xs opacity-70'>
            {isLogin ? "Don't have an account? " : 'Already registered? '}
            <button
              type='button'
              onClick={() => setAuthMode(isLogin ? 'register' : 'login')}
              className='link link-primary font-bold'
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
