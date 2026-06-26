import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import { setLength, toggleCharset, regenerate, setPassword } from "@/features/password/passwordSlice"
import { generatePassword } from "@/lib/generator"

export const passwordListener = createListenerMiddleware()

/* Every trigger that should produce a new password lives here, in one place:
  the slider, the charset toggles, and the explicit Generate signal. The
  side effect (Math.random) belongs in middleware, not in a reducer or a
  React effect — so the component just reads state.password.value. */
passwordListener.startListening({
  matcher: isAnyOf(setLength, toggleCharset, regenerate),
  effect: (_action, api) => {
    const { length, charset } = (api.getState() as RootState).password
    api.dispatch(setPassword(generatePassword({ length, charset })))
  }
})
