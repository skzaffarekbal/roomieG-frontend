import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constant.js';
import { addUser } from '../utils/userSlice.js';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + '/profile/view', { withCredentials: true });
      dispatch(addUser(res.data.data));
    } catch (error) {
      console.error(error);
      if (error.status === 401) navigate('/login');
    }
  };

  useEffect(() => {
    let token = Cookies.get('token');
    if (token) fetchUser();
    else navigate('/login');
  }, []);

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Body;
