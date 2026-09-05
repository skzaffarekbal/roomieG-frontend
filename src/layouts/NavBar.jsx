import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/userSlice';
import { logoutApi } from '../api/authApi';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import SunIcon from '../assets/icon/SunIcon';
import MoonIcon from '../assets/icon/MoonIcon';
import SettingIcon from '../assets/icon/SettingIcon';
import ChatIcon from '../assets/icon/ChatIcon';

function NavBar() {
  const [token, setToken] = useState(Cookies.get('token'));
  const user = useSelector((store) => store.user);
  const unreadCount = useSelector((store) => store.unreadCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme, openSettings } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutApi();
      setTimeout(() => {
        dispatch(logoutUser());
        setToken(null);
        navigate('/login');
      }, 100);
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = () => {
    if (!user?.firstName) return 'U';
    return (user.firstName[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase();
  };

  const expiresAt = user?.subscription?.expiresAt
    ? new Date(user?.subscription?.expiresAt).getTime()
    : null;
  const currentTime = new Date().getTime();
  const plan = user?.subscription?.plan;
  const isPremium = expiresAt > currentTime && plan !== 'free';

  const daysLeft = Math.floor((expiresAt - currentTime) / (24 * 60 * 60 * 1000));

  return (
    <header className='sticky top-0 z-40 backdrop-blur-md bg-base-100/90 border-b border-base-300 shadow-xs'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='navbar px-0 min-h-16 justify-between'>
          {/* Brand Logo */}
          <div className='flex items-center gap-2'>
            <Link
              to='/'
              className='btn btn-ghost text-xl font-extrabold tracking-tight px-2 hover:bg-base-200'
            >
              <span className='text-2xl'>🏡</span>
              <span className='bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent'>
                RoomieG
              </span>
            </Link>
          </div>

          {/* Right Action Icons & User Dropdown */}
          <div className='flex items-center gap-2 sm:gap-3'>
            {/* Quick Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className='btn btn-ghost btn-circle btn-sm sm:btn-md'
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label='Toggle theme'
            >
              {isDark ? (
                <SunIcon className='h-5 w-5 fill-current text-amber-400' />
              ) : (
                <MoonIcon className='h-5 w-5 fill-current text-slate-700' />
              )}
            </button>

            {/* Quick Settings Icon Button */}
            <button
              onClick={openSettings}
              className='btn btn-ghost btn-circle btn-sm sm:btn-md'
              title='Settings & Themes'
              aria-label='Settings & Themes'
            >
              <SettingIcon className='w-5 h-5 fill-none stroke-current' />
            </button>

            {user || token ? (
              <>
                {/* Chat / Connections Indicator Button */}
                <button
                  className='btn btn-ghost btn-circle btn-sm sm:btn-md'
                  onClick={() => navigate('/connections')}
                  title='Connections & Chats'
                  aria-label='Connections & Chats'
                >
                  <div className='indicator'>
                    <ChatIcon className='w-5 h-5' />
                    {unreadCount?.totalUnreadCount > 0 && (
                      <span className='badge badge-xs badge-error indicator-item text-white font-bold animate-pulse'>
                        {unreadCount?.totalUnreadCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* User Avatar Dropdown */}
                <div className='dropdown dropdown-end'>
                  <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
                    <div className='w-9 sm:w-10 rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-base-100 overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold'>
                      {user?.photo?.exactPhoto ? (
                        <img
                          alt={user?.firstName || 'User'}
                          src={user.photo.exactPhoto}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <span>{getInitials()}</span>
                      )}
                    </div>
                  </div>
                  <ul
                    tabIndex='-1'
                    className='menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-56 p-2 shadow-2xl border border-base-300'
                  >
                    <li className='menu-title px-3 py-1.5 border-b border-base-200 mb-1'>
                      <div className='text-xs font-bold text-base-content'>
                        {user?.firstName
                          ? `${user.firstName} ${user.lastName || ''}`
                          : 'My Account'}
                      </div>
                      <div className='text-[10px] opacity-70 truncate'>{user?.emailId}</div>
                    </li>
                    <li>
                      <Link to='/profile' className='py-2'>
                        👤 Profile
                      </Link>
                    </li>
                    <li>
                      <Link to='/connections' className='py-2 flex justify-between'>
                        <span>👥 Connections</span>
                        {unreadCount?.totalUnreadCount > 0 && (
                          <span className='badge badge-xs badge-error text-white'>
                            {unreadCount.totalUnreadCount}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link to='/requests' className='py-2'>
                        📬 Requests
                      </Link>
                    </li>
                    <li>
                      <Link to='/premium' className='py-2 flex justify-between items-center'>
                        <span>👑 Membership</span>
                        <span
                          className={`badge badge-xs font-semibold ${
                            isPremium
                              ? plan === 'gold'
                                ? 'badge-warning text-white'
                                : 'bg-slate-400 text-white'
                              : 'badge-ghost'
                          }`}
                        >
                          {isPremium
                            ? plan === 'gold'
                              ? `${daysLeft > 5 ? daysLeft + ' Days Gold' : 'Renew Gold'}`
                              : `${daysLeft > 5 ? daysLeft + ' Days Silver' : 'Renew Silver'}`
                            : 'Free'}
                        </span>
                      </Link>
                    </li>
                    <div className='divider my-1'></div>
                    <li>
                      <button onClick={openSettings} className='py-2'>
                        ⚙️ Settings & Theme
                      </button>
                    </li>
                    <li>
                      <button onClick={handleLogout} className='py-2 text-error font-semibold'>
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className='flex items-center gap-2'>
                <Link
                  to='/login?mode=login'
                  className='btn btn-ghost btn-sm sm:btn-md text-xs sm:text-sm font-semibold'
                >
                  Log In
                </Link>
                <Link
                  to='/login?mode=register'
                  className='btn btn-primary btn-sm sm:btn-md text-xs sm:text-sm font-bold shadow-md'
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
