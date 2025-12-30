import { Provider } from "react-redux"
import AppRouter from "@routes"
import { store } from "@store"
import "@styles/app.css"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-center" />
      <AppRouter />
    </Provider>
  )
}

export default App
