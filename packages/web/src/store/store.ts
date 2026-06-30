import { configureStore } from "@reduxjs/toolkit"
import passwordReducer from "@/features/password/passwordSlice"
import { passwordListener } from "./passwordListener"

export const store = configureStore({
  reducer: {
    password: passwordReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(passwordListener.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
