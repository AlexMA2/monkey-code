import { configureStore } from '@reduxjs/toolkit';
import configReducer from './configSlice';

export const makeStore = () => configureStore({
  reducer: {
    config: configReducer,
  },
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
