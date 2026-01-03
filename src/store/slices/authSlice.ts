import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signupUser, signinUser, initiateSignup, verifyOTP, getUserById, updateUserName } from "../../api/authApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyPointsUpdated } from '../../hooks/usePoints';

interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
  user: any | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  message: null,
  user: null,
};

// Async thunk for signup
export const signup = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    return await signupUser(payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Signup failed");
  }
});

export const signin = createAsyncThunk(
  "auth/signin",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await signinUser(payload);
      console.log('Signin response:', response);

      if (response.message === "User not found") {
        return rejectWithValue("User not found");
      }

      if (response.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      }
      return response;
    } catch (error: any) {
      console.log('Error during signin:', error);
      return rejectWithValue(error.response?.data?.message || "Sign in failed");
    }
  }
);

// Async thunk for initiating signup (sending OTP)
export const initiateUserSignup = createAsyncThunk(
  "auth/initiateSignup",
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const response = await initiateSignup(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

// Async thunk for OTP verification and completing signup
export const verifyUserOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (payload: { email: string; password: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await verifyOTP(payload);
      if (response.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getUserById(userId);
      if (response.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        notifyPointsUpdated(); // Notify that points have been updated
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

export const updateName = createAsyncThunk(
  "auth/updateName",
  async (payload: { userId: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await updateUserName(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update name");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.user = action.payload.user || null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(initiateUserSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(initiateUserSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(initiateUserSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyUserOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyUserOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.user = action.payload.user || null;
      })
      .addCase(verifyUserOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateName.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.name = action.payload.updates.name;
        }
      })
      .addCase(updateName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
