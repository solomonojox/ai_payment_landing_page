import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { ToastProvider } from './context/Toast.tsx'
import { AuthProvider } from './context/auth/AuthProvider.tsx'
import { SocketProvider } from './context/chat/SocketProvider.tsx'
// import { NotificationProvider } from './context/notification/NotificationProvider.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ThemeProvider from './context/Theme/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <SocketProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <NotificationProvider>
                </NotificationProvider> */}
                  <App />
              </LocalizationProvider>
            </SocketProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
