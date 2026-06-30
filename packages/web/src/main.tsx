import { render } from "preact"
import "./index.css"
import { App } from "./app.tsx"
import { Provider } from "react-redux"
import { store } from "./store/store"

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")!
)
