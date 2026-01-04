import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getJournals, updateJournal } from "../../api/editGetJournalApi";

interface JournalEntry {
  actions: string[];
  content: string;
  created_at: string;
  journal_id: string;
  mood_emoji: string;
  mood_keywords: string[];
  original_content: string;
  summary: string;
  type: string;
  updated_at: string;
  user_id: string;
}

interface JournalState {
  entries: Record<string, JournalEntry>;
  loading: boolean;
  error: string | null;
}

const initialState: JournalState = {
  entries: {},
  loading: false,
  error: null,
};

export const fetchJournals = createAsyncThunk(
  'journal/fetchJournals',
  async () => {
    const response = await getJournals();
    return response;
  }
);

export const editJournal = createAsyncThunk(
  'journal/editJournal',
  async ({ journalId, data }: { journalId: string, data: any }) => {
    const response = await updateJournal(journalId, data);
    return { journalId, updates: response.updates };
  }
);

const editGetJournalSlice = createSlice({
  name: 'editGetJournal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
        state.error = null;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch journals';
      })
      .addCase(editJournal.fulfilled, (state, action) => {
        state.entries[action.payload.journalId] = {
          ...state.entries[action.payload.journalId],
          ...action.payload.updates,
        };
      });
  },
});

export default editGetJournalSlice.reducer;
