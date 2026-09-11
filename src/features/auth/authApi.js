import { baseApi } from '@/api/baseApi'
import {
  clearCredentials,
  setCredentials,
  updateCredentials,
} from './authSlice'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/Auth/login',
        method: 'POST',
        data: credentials,
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled

          if (response?.success && response?.data) {
            dispatch(
              setCredentials(response.data),
            )
          }
        } catch {
          // Component handles the displayed error.
        }
      },
    }),

    register: builder.mutation({
      query: (data) => ({
        url: '/Auth/register',
        method: 'POST',
        data,
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled

          if (response?.success && response?.data) {
            dispatch(
              setCredentials(response.data),
            )
          }
        } catch {
          // Component handles the displayed error.
        }
      },
    }),

    refreshToken: builder.mutation({
      query: (data) => ({
        url: '/Auth/refresh-token',
        method: 'POST',
        data,
        skipAuthRefresh: true,
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data: response } = await queryFulfilled

          if (response?.success && response?.data) {
            dispatch(
              updateCredentials(response.data),
            )
          }
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),

    logout: builder.mutation({
      query: (data) => ({
        url: '/Auth/logout',
        method: 'POST',
        data,
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(clearCredentials())
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/Auth/forgot-password',
        method: 'POST',
        data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/Auth/reset-password',
        method: 'POST',
        data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: '/Auth/change-password',
        method: 'POST',
        data,
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled

          dispatch(clearCredentials())
        } catch {
          // Component handles the displayed error.
        }
      },
    }),
  }),

  overrideExisting: false,
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi