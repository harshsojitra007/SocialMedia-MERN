import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../src/features/userSlice';
import appApi from './services/appApi';

// to persist our store
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import persistReducer from 'redux-persist/es/persistReducer';

// reducers
const reducer = combineReducers({
    user: userSlice,
    [appApi.reducerPath]: appApi.reducer
});

const persistConfig = {
    key: "root",
    storage,
    blackList: [appApi.reducerPath]
};

// persist our store
const persistedReducer = persistReducer(persistConfig, reducer);

// create the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, appApi.middleware]
});

export default store;