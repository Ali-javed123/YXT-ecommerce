import {combineReducers, configureStore} from '@reduxjs/toolkit'
import localStorage from 'redux-persist'
import { persistReducer } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore';
import storage from "redux-persist/lib/storage";
import authReducer from './reducer/authReducer';
const rootReducer=combineReducers({
authStore:authReducer
})
const persistConfig={
    key:'root',
    storage:storage
}
const persistedReducer=persistReducer(persistConfig,rootReducer)
export const store=configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddle)=>
        getDefaultMiddle({
        serializableCheck:false
    })
    
    

})

export const persistor=persistStore(store)