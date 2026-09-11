import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckCircle2,
  Loader2,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/features/auth/components/AuthLayout'
import { useForgotPasswordMutation } from '@/features/auth/authApi'
import { getApiErrorMessage } from '@/utils/apiError'

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
})

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading, isSuccess }] =
    useForgotPasswordMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const response = await forgotPassword({
        email: values.email.trim(),
      }).unwrap()

      if (!response?.success) {
        setError('root', {
          message:
            response?.errors?.join(' ') ||
            response?.message ||
            'Unable to process the request.',
        })
      }
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          'Unable to process the password reset request.',
        ),
      })
    }
  }

  return (
    <AuthLayout
      title="Forgot password?"
      description="Enter your account email to request a password reset."
      footer={
        <Link
          to="/login"
          className="font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      {isSuccess ? (
        <div className="rounded-xl border bg-muted/40 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />

          <h2 className="mt-4 font-semibold">
            Request submitted
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            If the email exists, a password reset link
            has been sent.
          </p>
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
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
            />

            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
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
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send reset link
              </>
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}