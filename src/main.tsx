import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AppRoute from './route'
import { Toaster, toast } from 'sonner'
import './style.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message)
    },
  }),
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration =
        await navigator.serviceWorker.register('/service-worker.js')
      console.log('Service Worker registered with scope:', registration.scope)
    } catch (error) {
      console.error('Service Worker registeration failed:', error)
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors />
        <AppRoute />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
