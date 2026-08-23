import { createSlice } from '@reduxjs/toolkit';

const unreadCountSlice = createSlice({
  name: 'unreadCount',
  initialState: {
    userWiseUnreadCounts: {},
    totalUnreadCount: 0,
  },
  reducers: {
    setUnreadCounts: (state, action) => {
      state.userWiseUnreadCounts = action.payload.userWiseUnreadCounts;
      state.totalUnreadCount = action.payload.totalUnreadCount;
    },
    incrementUnreadCount: (state, action) => {
      const userId = action.payload;
      if (!state.userWiseUnreadCounts[userId]) {
        state.userWiseUnreadCounts[userId] = 0;
      }
      state.userWiseUnreadCounts[userId] += 1;
      state.totalUnreadCount += 1;
    },
    resetUnreadCount: (state, action) => {
      const userId = action.payload;
      state.totalUnreadCount -= state.userWiseUnreadCounts[userId] || 0;
      state.userWiseUnreadCounts[userId] = 0;
    },
  },
});

export const { setUnreadCounts, incrementUnreadCount, resetUnreadCount } = unreadCountSlice.actions;
export default unreadCountSlice.reducer;
