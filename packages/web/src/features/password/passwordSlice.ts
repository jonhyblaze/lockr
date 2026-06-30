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
  value: string
}

const initialState: PasswordState = {
  length: 0,
  charset: {
    upper: true,
    lower: true,
    numbers: true,
    symbols: true
  },
  value: ""
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

      // Don't allow turning off the last active charset — an empty charset
      // produces a garbage password (the generator has nothing to pick from).
      const activeCount = Object.values(state.charset).filter(Boolean).length
      if (state.charset[key] && activeCount === 1) return

      state.charset[key] = !state.charset[key]
    },

    /* Stores a freshly generated password. The generation itself (impure —
      it calls Math.random) happens in the listener middleware, so the
      reducer stays pure and just records the result. */
    setPassword(state, action: PayloadAction<string>) {
      state.value = action.payload
    },

    /* A signal action: carries no payload and changes no state. The listener
      middleware reacts to it (alongside setLength/toggleCharset) to produce
      a new password. Dispatched by the Generate button.*/
    regenerate() {}
  }
})

export const { setLength, toggleCharset, setPassword, regenerate } = passwordSlice.actions
export default passwordSlice.reducer
