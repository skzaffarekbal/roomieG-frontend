import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Body from './layouts/Body';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Connections from './pages/Connections';
import Requests from './pages/Requests';
import Premium from './pages/Premium';
import Chat from './pages/Chat';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Body />}>
            <Route path='/' element={<Feed />} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/connections' element={<Connections />} />
            <Route path='/requests' element={<Requests />} />
            <Route path='/premium' element={<Premium />} />
            <Route path='/chat/:targetUserId' element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
