import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteJournal } from '../../api/journalApi';
import axios from 'axios';

interface JournalState {
  currentJournal: {
    id?: string;
    content: string;
    title: string;
    date: string;
    type: 'chat' | 'type' | 'prompt' | 'gratitude';
    chatHistory?: string[];
  } | null;
}

const initialState: JournalState = {
  currentJournal: null,
};

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteJournal',
  async (journalId: string, { rejectWithValue }) => {
    try {
      await deleteJournal(journalId);
      return journalId;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Failed to delete journal',
          status: error.response?.status
        });
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    setCurrentJournal: (state, action: PayloadAction<JournalState['currentJournal']>) => {
      state.currentJournal = action.payload;
    },
    clearCurrentJournal: (state) => {
      state.currentJournal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        if (state.currentJournal?.id === action.payload) {
          state.currentJournal = null;
        }
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        console.error('Delete journal failed:', action.payload);
      });
  },
});

export const { setCurrentJournal, clearCurrentJournal } = journalSlice.actions;
export default journalSlice.reducer;
