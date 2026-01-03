import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  voiceType: string;
  language: string;
  therapyType: string;
  updatedAt: string;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  voiceType: '',
  language: '',
  therapyType: '',
  updatedAt: '',
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSettingsSuccess: (state, action) => {
      state.loading = false;
      state.voiceType = action.payload.voice_type;
      state.language = action.payload.language;
      state.therapyType = action.payload.therapy_type;
      state.updatedAt = action.payload.updated_at;
    },
    updateSettingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { updateSettingsStart, updateSettingsSuccess, updateSettingsFailure } = settingsSlice.actions;
export default settingsSlice.reducer;
