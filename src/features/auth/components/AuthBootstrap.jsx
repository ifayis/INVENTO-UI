import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingScreen from '@/components/common/LoadingScreen'
import { clearCredentials, updateCredentials } from '@/features/auth/authSlice'
import { selectAccessToken, selectRefreshToken } from '@/features/auth/authSelectors'
import axiosClient from '@/api/axiosClient'
import { isJwtExpired } from '@/utils/jwt'
import { getRefreshToken } from '@/utils/authStorage'

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch()

  const accessToken = useSelector(selectAccessToken)
  const refreshToken = useSelector(selectRefreshToken)

  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    const initialize = async () => {
      try {
        const storedRefreshToken =
          refreshToken || getRefreshToken()

        if (
          accessToken &&
          !isJwtExpired(accessToken)
        ) {
          if (active) {
            setReady(true)
          }

          return
        }

        if (!storedRefreshToken) {
          dispatch(clearCredentials())

          if (active) {
            setReady(true)
          }

          return
        }

        const response = await axiosClient.post(
          '/Auth/refresh-token',
          {
            refreshToken: storedRefreshToken,
          },
          {
            skipAuthRefresh: true,
          },
        )

        if (
          response.data?.success &&
          response.data?.data
        ) {
          dispatch(
            updateCredentials(
              response.data.data,
            ),
          )
        } else {
          dispatch(clearCredentials())
        }
      } catch {
        dispatch(clearCredentials())
      } finally {
        if (active) {
          setReady(true)
        }
      }
    }

    initialize()

    return () => {
      active = false
    }
  }, [accessToken, refreshToken, dispatch])

  useEffect(() => {
    const handleAuthExpired = () => {
      dispatch(clearCredentials())
    }

    window.addEventListener(
      'invento:auth-expired',
      handleAuthExpired,
    )

    return () => {
      window.removeEventListener(
        'invento:auth-expired',
        handleAuthExpired,
      )
    }
  }, [dispatch])

  if (!ready) {
    return <LoadingScreen />
  }

  return children
}