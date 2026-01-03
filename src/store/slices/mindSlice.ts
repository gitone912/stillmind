import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMindData, MindData } from '../../api/mindTaskApi';

export const getMindData = createAsyncThunk(
  'mind/getData',
  async (userId: string) => {
    const response = await fetchMindData(userId);
    return response;
  }
);

interface MindState {
  data: Record<string, MindData>;
  loading: boolean;
  error: string | null;
}

const initialState: MindState = {
  data: {},
  loading: false,
  error: null,
};

const mindSlice = createSlice({
  name: 'mind',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMindData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMindData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getMindData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch mind data';
      });
  },
});

export default mindSlice.reducer;
