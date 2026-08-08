import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    logoutUser: () => {
      // The root reducer handles the data clearing, but you can
      // handle side-effects here if necessary (like removing local cookies)
    },
  },
});

export const { addUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
