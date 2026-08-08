import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constant';
import { logoutUser } from '../utils/userSlice';
import Cookies from 'js-cookie';

function NavBar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      axios.post(BASE_URL + '/logout', {}, { withCredentials: true });
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };
  const token = Cookies.get('token');
  return (
    <div className='sticky top-0'>
      <div className='navbar bg-base-200 shadow-sm'>
        <div className='flex-1'>
          <Link to={'/'} className='btn btn-ghost text-xl'>
            🏡 Roomie
          </Link>
        </div>
        {user || token ? (
          <div className='flex gap-4 mx-6'>
            <button className='btn btn-ghost btn-circle'>
              <div className='indicator'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  {' '}
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M20 12C20 16.4183 16.4183 20 12 20C10.5937 20 9.27223 19.6372 8.12398 19C7.53267 18.6719 4.48731 20.4615 3.99998 20C3.44096 19.4706 5.4583 16.6708 5.07024 16C4.38956 14.8233 3.99999 13.4571 3.99999 12C3.99999 7.58172 7.58171 4 12 4C16.4183 4 20 7.58172 20 12Z'
                  />{' '}
                </svg>
                <span className='badge badge-xs badge-primary indicator-item'>0</span>
              </div>
            </button>
            <div className='dropdown dropdown-end'>
              <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
                <div className='w-10 rounded-full'>
                  <img alt='Tailwind CSS Navbar component' src={user?.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex='-1'
                className='menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-auto p-2 shadow'
              >
                <li>
                  <Link to={'/profile'}>Profile</Link>
                </li>
                <li>
                  <Link to={'/connections'}>Connections</Link>
                </li>
                <li>
                  <Link to={'/requests'}>Requests</Link>
                </li>
                <li>
                  <a>Premium</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className='navbar-end gap-2'>
            {/* <a className='btn btn-primary'>Sign Up</a> */}
            <a className='btn btn-ghost'>Log In</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
