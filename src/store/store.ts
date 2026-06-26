import { configureStore } from "@reduxjs/toolkit"
import passwordReducer from "@/features/password/passwordSlice"

export const store = configureStore({
  reducer: {
    password: passwordReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
