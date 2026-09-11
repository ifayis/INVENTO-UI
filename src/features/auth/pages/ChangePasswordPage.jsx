import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  KeyRound,
  Loader2,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/features/auth/components/AuthLayout'
import PasswordInput from '@/features/auth/components/PasswordInput'
import { useChangePasswordMutation } from '@/features/auth/authApi'
import { getApiErrorMessage } from '@/utils/apiError'

const schema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required.'),

    newPassword: z
      .string()
      .min(
        8,
        'Password must be at least 8 characters.',
      ),

    confirmPassword: z
      .string()
      .min(
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

export default function ChangePasswordPage() {
  const navigate = useNavigate()

  const [changePassword, { isLoading }] =
    useChangePasswordMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap()

      if (!response?.success) {
        setError('root', {
          message:
            response?.errors?.join(' ') ||
            response?.message ||
            'Unable to change password.',
        })

        return
      }

      navigate('/login', {
        replace: true,
        state: {
          message:
            response.message ||
            response.data ||
            'Password changed successfully. Please login again.',
        },
      })
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to change your password.',
        ),
      })
    }
  }

  return (
    <AuthLayout
      title="Change password"
      description="Update your Invento account password."
      footer={
        <Link
          to="/dashboard"
          className="font-medium text-primary hover:underline"
        >
          Back to dashboard
        </Link>
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
          <Label htmlFor="currentPassword">
            Current password
          </Label>

          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            placeholder="Enter your current password"
            {...register('currentPassword')}
          />

          {errors.currentPassword && (
            <p className="text-xs text-destructive">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

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
            Confirm new password
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
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Changing password...
            </>
          ) : (
            <>
              <KeyRound className="h-4 w-4" />
              Change password
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}