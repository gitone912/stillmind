import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserStreak } from '../../api/journeyApi';

export const getStreak = createAsyncThunk(
    'journey/getStreak',
    async () => {
        const streak = await fetchUserStreak();
        // console.log(streak)
        return streak;
    }
);

const journeySlice = createSlice({
    name: 'journey',
    initialState: {
        streak: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStreak.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStreak.fulfilled, (state, action) => {
                state.loading = false;
                state.streak = action.payload;
            })
            .addCase(getStreak.rejected, (state) => {
                state.loading = false;
                state.streak = 0;
            });
    }
});

export default journeySlice.reducer;
