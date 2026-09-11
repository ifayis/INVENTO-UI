import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckCircle2,
  Loader2,
  LockKeyhole,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/features/auth/components/AuthLayout'
import PasswordInput from '@/features/auth/components/PasswordInput'
import { useResetPasswordMutation } from '@/features/auth/authApi'
import { getApiErrorMessage } from '@/utils/apiError'

const schema = z
  .object({
    newPassword: z
      .string()
      .min(
        8,
        'Password must be at least 8 characters.',
      ),

    confirmPassword: z.string().min(
      1,
      'Please confirm your password.',
    ),
  })
  .refine(
    (values) =>
      values.newPassword === values.confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    },
  )

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') || ''

  const hasValidToken =
    typeof token === 'string' &&
    token.trim().length > 0

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    if (!hasValidToken) {
      setError('root', {
        message:
          'This password reset link is invalid or the reset token is missing.',
      })

      return
    }

    try {
      const response = await resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap()

      if (!response?.success) {
        setError('root', {
          message:
            response?.errors?.join(' ') ||
            response?.message ||
            'Password reset failed.',
        })

        return
      }

      navigate('/login', {
        replace: true,
        state: {
          message:
            response.message ||
            'Password reset successfully. Please sign in.',
        },
      })
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to reset your password.',
        ),
      })
    }
  }
  return (
    <AuthLayout
      title="Reset password"
      description="Create a new password for your Invento account."
      footer={
        <Link
          to="/login"
          className="font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      }
    >

      {!hasValidToken ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          This password reset page must be opened using the
          reset link sent to your email.
        </div>
      ) : (

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
            <Label htmlFor="newPassword">
              New password
            </Label>

            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...register('newPassword')}
            />

            {errors.newPassword && (
              <p className="text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm password
            </Label>

            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat your new password"
              {...register('confirmPassword')}
            />

            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !token}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <LockKeyhole className="h-4 w-4" />
                Reset password
              </>
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}