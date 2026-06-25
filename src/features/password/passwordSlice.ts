import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Charset = {
  upper: boolean
  lower: boolean
  numbers: boolean
  symbols: boolean
}

export type PasswordState = {
  length: number
  charset: Charset
}

const initialState: PasswordState = {
  length: 0,
  charset: {
    upper: true,
    lower: true,
    numbers: true,
    symbols: true
  }
}

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    setLength(state, action: PayloadAction<number>) {
      state.length = action.payload
    },

    toggleCharset(state, action: PayloadAction<keyof Charset>) {
      const key = action.payload
      state.charset[key] = !state.charset[key]
    },


  }
})

export const { setLength, toggleCharset } = passwordSlice.actions
export default passwordSlice.reducer
