import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import App from './App.jsx'
import './styles/global.css'
import './index.css'
// Import debug script
import './debug-storage.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
