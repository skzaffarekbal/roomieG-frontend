import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Body from './layouts/Body';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Connections from './pages/Connections';
import Requests from './pages/Requests';
import Premium from './pages/Premium';
import Chat from './pages/Chat';
import Landing from './pages/Landing';
import Cookies from 'js-cookie';
import { ThemeProvider } from './context/ThemeProvider';

function HomeRoute() {
  const user = useSelector((state) => state.user);
  const token = Cookies.get('token');
  if (user || token) {
    return <Feed />;
  }
  return <Landing />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Body />}>
            <Route path='/' element={<HomeRoute />} />
            <Route path='/landing' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/connections' element={<Connections />} />
            <Route path='/requests' element={<Requests />} />
            <Route path='/premium' element={<Premium />} />
            <Route path='/chat/:targetUserId' element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
