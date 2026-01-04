import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveNotificationToken } from '../../api/notificationAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = createAsyncThunk(
    'notification/saveToken',
    async ({ userId, name }: { userId: string, name: string }) => {
        const fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) throw new Error('No FCM token found');
        console.log(fcmToken, 'fcm token sending')

        return await saveNotificationToken({ fcmToken, userId, name });
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveToken.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(saveToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to save token';
            });
    },
});

export default notificationSlice.reducer;
