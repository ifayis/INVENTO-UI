import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building2,
  Loader2,
  UserPlus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import AuthLayout from '@/features/auth/components/AuthLayout'
import PasswordInput from '@/features/auth/components/PasswordInput'

import { useRegisterMutation } from '@/features/auth/authApi'
import { getApiErrorMessage } from '@/utils/apiError'
import { saveAuthSession } from '@/utils/authStorage'

const schema = z
  .object({
    companyName: z
      .string()
      .min(1, 'Company name is required.')
      .max(
        200,
        'Company name must be 200 characters or less.',
      ),

    fullName: z
      .string()
      .min(1, 'Full name is required.')
      .max(
        150,
        'Full name must be 150 characters or less.',
      ),

    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Please enter a valid email address.'),

    password: z
      .string()
      .min(
        6,
        'Password must be at least 6 characters.',
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
      values.password === values.confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    },
  )

export default function RegisterPage() {
  const navigate = useNavigate()

  const [registerUser, { isLoading }] =
    useRegisterMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const response = await registerUser({
        companyName: values.companyName.trim(),
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      }).unwrap()

      if (!response?.success) {
        setError('root', {
          message:
            response?.errors?.join(' ') ||
            response?.message ||
            'Registration failed.',
        })

        return
      }

      if (!response?.data?.accessToken) {
        setError('root', {
          message:
            'Registration succeeded, but authentication data was not returned.',
        })

        return
      }

      saveAuthSession(response.data)

      navigate('/dashboard', {
        replace: true,
      })
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to create your account.',
        ),
      })
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start managing your business with Invento."
      footer={
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
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
          <Label htmlFor="companyName">
            Company name
          </Label>

          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="companyName"
              type="text"
              autoComplete="organization"
              placeholder="Enter your company name"
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              {...register('companyName')}
            />
          </div>

          {errors.companyName && (
            <p className="text-xs text-destructive">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full name
          </Label>

          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            {...register('fullName')}
          />

          {errors.fullName && (
            <p className="text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            {...register('email')}
          />

          {errors.email && (
            <p className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>

          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            {...register('password')}
          />

          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
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
            placeholder="Repeat your password"
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
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create account
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}