import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './contexts/AppContext.jsx'
import { OrderProvider } from './contexts/OrderContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
)