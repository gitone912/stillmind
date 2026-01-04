import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/actionSlice";
import mindReducer from "./slices/mindSlice";
// import therapyReducer from './slices/therapySlice';
import moodReducer from "./slices/moodSlice";
import journeyReducer from './slices/journeySlice';
import journalReducer from "./slices/journalSlice";
import analyseReducer from "./slices/analyseSlice";
import editGetJournalReducer from "./slices/editGetJournalSlice";
import settingsReducer from "./slices/settingsSlice";
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    mind: mindReducer,
    // therapy: therapyReducer,
    mood: moodReducer,
    journey: journeyReducer,
    journal: journalReducer,
    analyse: analyseReducer,
    editGetJournal: editGetJournalReducer,
    settings: settingsReducer,
    notification: notificationReducer,
    // payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;