import './index.css'

import App from './App.tsx'
import { AppProvider } from './context/AppContext'
import { BrowserRouter } from 'react-router-dom'
import { NetworkProvider } from './components/NWProvider.tsx'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { store } from '@/stores/index.ts'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <AppProvider>
      <BrowserRouter>
        <NetworkProvider>
          <App />
        </NetworkProvider>
      </BrowserRouter>
    </AppProvider>
  </Provider>,
  // </StrictMode>,
)
