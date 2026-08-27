import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constant';

function Login() {
  // TODO: Convert this part into react v19 new feature.
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const login = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        BASE_URL + '/login',
        {
          emailId: email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.user));
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
      const res = await axios.post(
        BASE_URL + '/register',
        {
          firstName,
          lastName,
          emailId: email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.user));
      setLoading(false);
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error?.response?.data?.error || 'Something Went Wrong...');
    }
  };

  return (
    <div className='flex grow items-center justify-center'>
      <form onSubmit={isLogin ? login : register} className='w-full max-w-xs'>
        <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4'>
          <legend className='fieldset-legend'>{isLogin ? 'Login' : 'Register'}</legend>

          {!isLogin ? (
            <>
              <label className='label' htmlFor='firstName'>
                First Name
              </label>
              <input
                type='text'
                className='input'
                id='firstName'
                placeholder='John'
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <label className='label' htmlFor='lastName'>
                Last Name
              </label>
              <input
                type='text'
                className='input'
                id='lastName'
                placeholder='Doe'
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          ) : (
            ''
          )}

          <label className='label' htmlFor='email'>
            Email
          </label>
          <input
            type='email'
            className='input'
            id='email'
            placeholder='johndoe@example.com'
            required
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className='label' htmlFor='password'>
            Password
          </label>
          <div className='relative w-full'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='input'
              id='password'
              placeholder='Password'
              required
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2 text-xs'
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {isLogin ? (
            <label className='label mt-1'>
              <a href='#' className='label-text-alt link link-hover'>
                Forgot password?
              </a>
            </label>
          ) : (
            ''
          )}

          <div className='mt-4'>
            {error ? <p className='text-red-400 font-bold mb-1'>{error}</p> : ''}
            <button type='submit' className='btn btn-neutral w-full' disabled={loading}>
              {loading ? 'Logging...' : isLogin ? 'Login' : 'Register'}
            </button>
          </div>
          <div className='text-center mt-4'>
            <span className='text-sm opacity-70'>
              {isLogin ? "Don't have an account? " : 'Already have an account. '}
            </span>
            <a
              onClick={() => setIsLogin(!isLogin)}
              className='text-sm link link-primary font-semibold'
            >
              {isLogin ? 'Register' : 'Login'}
            </a>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default Login;
