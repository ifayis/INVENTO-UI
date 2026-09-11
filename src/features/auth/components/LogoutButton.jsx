import { LogOut, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  useLogoutMutation,
} from '@/features/auth/authApi'
import {
  getRefreshToken,
} from '@/utils/authStorage'
import {
  getApiErrorMessage,
} from '@/utils/apiError'

export default function LogoutButton({
  variant = 'ghost',
  className,
}) {
  const navigate = useNavigate()

  const [logout, { isLoading }] =
    useLogoutMutation()

  const handleLogout = async () => {
    const refreshToken = getRefreshToken()

    try {
      if (refreshToken) {
        await logout({
          refreshToken,
        }).unwrap()
      }
    } catch (error) {
      console.error(
        'Logout API error:',
        getApiErrorMessage(
          error,
          'Logout request failed.',
        ),
      )
    } finally {
      navigate('/login', {
        replace: true,
        state: {
          message: 'You have been logged out.',
        },
      })
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}

      {isLoading
        ? 'Signing out...'
        : 'Sign out'}
    </Button>
  )
}