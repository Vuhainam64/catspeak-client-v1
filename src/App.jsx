import { Provider } from 'react-redux'
import AppRouter from '@routes'
import { store } from '@store'
import '@styles/app.css'

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  )
}

export default App
