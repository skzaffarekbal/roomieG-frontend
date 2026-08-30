import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfileCompletionApi } from '../api/profileApi';

export const fetchProfileCompletion = createAsyncThunk(
  'profileCompletion/fetchProfileCompletion',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileCompletionApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const profileCompletionSlice = createSlice({
  name: 'profileCompletion',
  initialState: {
    completionData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileCompletion.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfileCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.completionData = action.payload;
      })
      .addCase(fetchProfileCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileCompletionSlice.reducer;
