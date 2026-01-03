import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMoodData, getFrequentWords, FrequentWordsData } from '../../api/moodApi';

interface MoodData {
  day: string;
  value: number;
  mood: string;
}

interface MoodState {
  moodData: MoodData[];
  loading: boolean;
  error: string | null;
  frequentWords: [string, string][] | null;
  frequentWordsLoading: boolean;
  frequentWordsError: string | null;
}

const getMoodEmoji = (value: number): string => {
  if (value >= 80) return '😁';
  if (value >= 60) return '🙂';
  if (value >= 40) return '😐';
  if (value >= 20) return '☹️';
  return '😞';
};

export const fetchMoodData = createAsyncThunk(
  'mood/fetchMoodData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMoodData();
      console.log(response)
      const moodWithEmojis = response.mood.mood.map((item: any) => ({
        ...item,
        mood: getMoodEmoji(item.value)
      }));
      return moodWithEmojis;
    } catch (error) {
      return rejectWithValue('Please complete one week of journal entries to get mood insights');
    }
  }
);

export const fetchFrequentWords = createAsyncThunk(
  'mood/fetchFrequentWords',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getFrequentWords(userId);
      return response.frequent_words;
    } catch (error) {
      return rejectWithValue('No journal data available yet');
    }
  }
);

const initialState: MoodState = {
  moodData: [],
  loading: false,
  error: null,
  frequentWords: null,
  frequentWordsLoading: false,
  frequentWordsError: null
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodData.fulfilled, (state, action) => {
        state.loading = false;
        state.moodData = action.payload;
      })
      .addCase(fetchMoodData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFrequentWords.pending, (state) => {
        state.frequentWordsLoading = true;
        state.frequentWordsError = null;
      })
      .addCase(fetchFrequentWords.fulfilled, (state, action) => {
        state.frequentWordsLoading = false;
        state.frequentWords = action.payload;
      })
      .addCase(fetchFrequentWords.rejected, (state, action) => {
        state.frequentWordsLoading = false;
        state.frequentWordsError = action.payload as string;
      });
  }
});

export default moodSlice.reducer;
