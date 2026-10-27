"use client"
import {Provider} from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from '@/components/Application/loading'


import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const GlobalProvider = ({children}:any) => {
  const queryClient = new QueryClient()


  return (    
  <QueryClientProvider client={queryClient}>

    <Provider store={store} >
    <PersistGate persistor={persistor} loading={<Loading/>}>
        {children}

    </PersistGate>
    </Provider>
    <Suspense fallback={null} >
      <ReactQueryDevtools initialIsOpen={false}/>

    </Suspense>
   </QueryClientProvider>

    
  )
}

export default GlobalProvider