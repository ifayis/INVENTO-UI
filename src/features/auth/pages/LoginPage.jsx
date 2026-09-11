import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/features/auth/components/AuthLayout'
import PasswordInput from '@/features/auth/components/PasswordInput'
import { useLoginMutation } from '@/features/auth/authApi'
import { getApiErrorMessage } from '@/utils/apiError'

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),

  password: z
    .string()
    .min(1, 'Password is required.'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [login, { isLoading }] =
    useLoginMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const from =
    location.state?.from?.pathname || '/dashboard'

  const onSubmit = async (values) => {
    try {
      const response = await login({
        email: values.email.trim(),
        password: values.password,
      }).unwrap()

      if (!response?.success) {
        const message =
          response?.errors?.join(' ') ||
          response?.message ||
          'Login failed.'

        setError('root', {
          message,
        })

        return
      }

      navigate(from, { replace: true })
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to sign in. Please try again.',
        ),
      })
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your Invento account."
      footer={
        <p>
          Need help?{' '}
          <Link
            to="/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            Reset your password
          </Link>
        </p>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        {errors.root?.message && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {errors.root.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
          />

          {errors.email && (
            <p className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              Password
            </Label>

            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register('password')}
          />

          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign in
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}