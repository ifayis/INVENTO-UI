import { createApi } from '@reduxjs/toolkit/query/react'
import axiosClient from './axiosClient'

const axiosBaseQuery =
  () =>
  async ({ url, method = 'GET', data, params, headers, signal }) => {
    try {
      const response = await axiosClient({
        url,
        method,
        data,
        params,
        headers,
        signal,
      })

      return {
        data: response.data,
      }
    } catch (error) {
      if (error?.response) {
        return {
          error: {
            status: error.response.status,
            data: error.response.data,
          },
        }
      }

      if (error?.request) {
        return {
          error: {
            status: 'NETWORK_ERROR',
            data: {
              message: 'Unable to connect to the server.',
            },
          },
        }
      }

      return {
        error: {
          status: 'UNKNOWN_ERROR',
          data: {
            message: error?.message || 'An unexpected error occurred.',
          },
        },
      }
    }
  }

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Auth',
    'Balance',
    'Category',
    'Company',
    'Customer',
    'Dashboard',
    'Payable',
    'Product',
    'Profile',
    'Profit',
    'Purchase',
    'Receivable',
    'Report',
    'Sale',
    'StockMovement',
    'Supplier',
    'Target',
    'User',
  ],
  endpoints: () => ({}),
})