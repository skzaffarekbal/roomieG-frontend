import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';
import feedSlice from '../redux/feedSlice';
import connectionSlice from '../redux/connectionSlice';
import requestSlice from '../redux/requestSlice';
import unreadCountSlice from '../redux/unreadCountSlice';

// 1. Combine all your individual feature slices
const appReducer = combineReducers({
  user: userReducer,
  feed: feedSlice,
  connection: connectionSlice,
  request: requestSlice,
  unreadCount: unreadCountSlice,
});

// 2. Create a root reducer that can intercept the logout action
const rootReducer = (state, action) => {
  if (action.type === 'user/logoutUser') {
    // Setting state to undefined forces Redux to load the initial state for all reducers
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//     feed: feedSlice,
//     connection: connectionSlice,
//     request: requestSlice,
//   },
// });
