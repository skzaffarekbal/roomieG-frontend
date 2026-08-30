import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Footer() {
  const { openSettings } = useTheme();

  return (
    <footer className='border-t border-base-300 bg-base-200/80 text-base-content'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* Brand Info */}
          <div className='space-y-3 md:col-span-2'>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>🏡</span>
              <span className='font-extrabold text-xl bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent'>
                RoomieG
              </span>
            </div>
            <p className='text-xs opacity-75 max-w-sm leading-relaxed'>
              Find the right roommate, not just an empty room. Matches people based on daily living
              habits, lifestyle compatibility, work routines, and privacy.
            </p>
            <div className='pt-2 flex items-center gap-3'>
              <button onClick={openSettings} className='btn btn-xs btn-outline rounded-lg gap-1.5'>
                <span>🎨</span> Change Theme
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className='space-y-2'>
            <div className='text-xs font-bold uppercase tracking-wider opacity-60'>Product</div>
            <ul className='space-y-1.5 text-xs opacity-80'>
              <li>
                <Link to='/' className='link link-hover'>
                  Discover Feed
                </Link>
              </li>
              <li>
                <Link to='/landing' className='link link-hover'>
                  How It Works
                </Link>
              </li>
              <li>
                <Link to='/premium' className='link link-hover'>
                  Premium Plans
                </Link>
              </li>
              <li>
                <Link to='/connections' className='link link-hover'>
                  Connections & Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Legal */}
          <div className='space-y-2'>
            <div className='text-xs font-bold uppercase tracking-wider opacity-60'>
              Trust & Safety
            </div>
            <ul className='space-y-1.5 text-xs opacity-80'>
              <li>
                <a className='link link-hover'>Community Guidelines</a>
              </li>
              <li>
                <a className='link link-hover'>Privacy Policy</a>
              </li>
              <li>
                <a className='link link-hover'>Terms of Service</a>
              </li>
              <li>
                <a className='link link-hover'>Safety Tips</a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-base-300 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-70'>
          <p>© {new Date().getFullYear()} RoomieG.in — All rights reserved.</p>
          <div className='flex items-center gap-4'>
            <span>Made with ❤️ for smart living</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
