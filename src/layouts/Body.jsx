import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import SettingsModal from '../components/SettingsModal';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { addUser } from '../redux/userSlice.js';
import Cookies from 'js-cookie';
import { incrementUnreadCount, setUnreadCounts } from '../redux/unreadCountSlice.js';
import { createSocketConnection } from '../utils/socket.js';
import { viewProfileApi } from '../api/profileApi.js';
import { getUnreadChatsCountApi } from '../api/chatApi.js';

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const isPublicPath = ['/', '/landing', '/login'].includes(location.pathname);
  const userId = userData?._id;

  const fetchUser = useCallback(async () => {
    if (userData) return;
    try {
      const data = await viewProfileApi();
      dispatch(addUser(data.data));
    } catch (error) {
      console.error(error);
      if ((error?.response?.status === 401 || error?.status === 401) && !isPublicPath) {
        navigate('/login');
      }
    }
  }, [dispatch, navigate, userData, isPublicPath]);

  const fetchUnreadCounts = useCallback(async () => {
    try {
      const data = await getUnreadChatsCountApi();
      dispatch(setUnreadCounts(data.data));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUser();
    } else if (!isPublicPath) {
      navigate('/login');
    }
  }, [fetchUser, navigate, isPublicPath]);

  useEffect(() => {
    if (!userId) return;
    fetchUnreadCounts();

    const socket = createSocketConnection();
    socket.emit('chatNotification', { loginUserId: userId });

    socket.on('unreadCountUpdate', (data) => {
      dispatch(incrementUnreadCount(data.senderId));
      const audio = new Audio('/bell.mp3');
      audio.play().catch((err) => console.log(err));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, fetchUnreadCounts, dispatch]);

  return (
    <div className='flex flex-col min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content'>
      <NavBar />
      <main className='flex-1 flex flex-col'>
        <Outlet />
      </main>
      <Footer />
      <SettingsModal />
    </div>
  );
}

export default Body;
