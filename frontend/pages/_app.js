import '@/styles/globals.css'
import NextNProgress from 'nextjs-progressbar';
import { Toaster } from 'react-hot-toast'
import { Provider } from "react-redux"
import store from '../src/store/store'
import AuthInit from '@/src/authInit';

export default function App({ Component, pageProps }) {
  return <main className='h-full w-full sm:w-96 sm:border border-blue-200 rounded-lg'>
    <Provider store = {store}>
      <AuthInit/>
      <NextNProgress options={{ showSpinner: false }}/>
      <Component {...pageProps} />
      <Toaster position="top-center" toastOptions={{duration: 3000, style: {
        borderRadius: '5px',
        border: '1px solid rgb(219 234 254)',
        background: 'rgb(17 24 39)',
        color: 'rgb(219 234 254)',
      }}} />
    </Provider>
  </main>
}
