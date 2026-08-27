import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { addUser } from '../redux/userSlice.js';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { incrementUnreadCount, setUnreadCounts } from '../redux/unreadCountSlice.js';
import { createSocketConnection } from '../utils/socket.js';
import { viewProfileApi } from '../api/profileApi.js';
import { getUnreadChatsCountApi } from '../api/chatApi.js';

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = useCallback(async () => {
    if (userData) return;
    try {
      const data = await viewProfileApi();
      dispatch(addUser(data.data));
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401 || error?.status === 401) navigate('/login');
    }
  }, [dispatch, navigate, userData]);

  const fetchUnreadCounts = useCallback(async () => {
    try {
      const data = await getUnreadChatsCountApi();
      dispatch(setUnreadCounts(data.data));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    let token = Cookies.get('token');
    if (token) fetchUser();
    else navigate('/login');
  }, [fetchUser, navigate]);

  useEffect(() => {
    if (!userData) return;
    fetchUnreadCounts();

    const socket = createSocketConnection();
    socket.emit('chatNotification', { loginUserId: userData._id });

    socket.on('unreadCountUpdate', (data) => {
      dispatch(incrementUnreadCount(data.senderId));
      const audio = new Audio('/bell.mp3');
      audio.play().catch((err) => console.log(err));
    });

    return () => {
      socket.disconnect();
    };
  }, [userData, fetchUnreadCounts, dispatch]);

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Body;
