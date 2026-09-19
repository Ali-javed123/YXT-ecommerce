"use client"
import {Provider} from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from '@/components/Application/loading'
const GlobalProvider = ({children}:any) => {
  return (
    <Provider store={store} >
    <PersistGate persistor={persistor} loading={<Loading/>}></PersistGate>
    {children}
    </Provider>
    
  )
}

export default GlobalProvider