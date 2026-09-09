import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/api/baseApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }).concat(baseApi.middleware),

  devTools: import.meta.env.DEV,
})