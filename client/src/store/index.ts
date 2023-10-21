import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userStore";

export const store = configureStore({
  reducer: {
    // 注册子模块
    user: userReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
