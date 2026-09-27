import { useEffect } from 'react'
import { Loader2, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '@/features/customers/customersApi'
import { getApiErrorMessage } from '@/utils/apiError'

const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Customer name is required.')
    .max(
      150,
      'Customer name must be 150 characters or less.',
    ),

  email: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === '' ||
        z.string().email().safeParse(value).success,
      {
        message: 'Please enter a valid email address.',
      },
    ),

  phoneNumber: z
    .string()
    .trim()
    .max(
      30,
      'Phone number must be 30 characters or less.',
    ),

  address: z
    .string()
    .trim()
    .max(
      500,
      'Address must be 500 characters or less.',
    ),
})

const defaultValues = {
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
}

export default function CustomerDialog({
  open,
  onOpenChange,
  customer = null,
}) {
  const isEdit = Boolean(customer?.id)

  const [createCustomer, createState] =
    useCreateCustomerMutation()

  const [updateCustomer, updateState] =
    useUpdateCustomerMutation()

  const isLoading =
    createState.isLoading ||
    updateState.isLoading

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      return
    }

    if (isEdit) {
      reset({
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        phoneNumber:
          customer?.phoneNumber ?? '',
        address: customer?.address ?? '',
      })

      return
    }

    reset(defaultValues)
  }, [
    open,
    isEdit,
    customer,
    reset,
  ])

  const handleDialogChange = (value) => {
    if (isLoading) {
      return
    }

    onOpenChange(value)
  }

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateCustomer({
          id: customer.id,
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
        }).unwrap()
      } else {
        await createCustomer({
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address,
        }).unwrap()
      }

      onOpenChange(false)
      reset(defaultValues)
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          isEdit
            ? 'Unable to update customer.'
            : 'Unable to create customer.',
        ),
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogChange}
    >
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl overflow-hidden p-0 sm:w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <DialogHeader className="border-b px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <UserRound className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <DialogTitle>
                  {isEdit
                    ? 'Edit customer'
                    : 'Add customer'}
                </DialogTitle>

                <DialogDescription className="mt-1">
                  {isEdit
                    ? 'Update the customer information below.'
                    : 'Add a new customer to your business.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
            {errors.root?.message && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {errors.root.message}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="customer-name">
                  Customer name
                </Label>

                <input
                  id="customer-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter customer name"
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                  {...register('name')}
                />

                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="customer-email">
                  Email
                </Label>

                <input
                  id="customer-email"
                  type="email"
                  autoComplete="email"
                  placeholder="customer@example.com"
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                  {...register('email')}
                />

                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="customer-phone">
                  Phone number
                </Label>

                <input
                  id="customer-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter phone number"
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                  {...register('phoneNumber')}
                />

                {errors.phoneNumber && (
                  <p className="text-xs text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="customer-address">
                  Address
                </Label>

                <textarea
                  id="customer-address"
                  rows={4}
                  placeholder="Enter customer address"
                  disabled={isLoading}
                  className="flex min-h-24 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                  {...register('address')}
                />

                {errors.address && (
                  <p className="text-xs text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t px-5 py-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() =>
                handleDialogChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEdit
                    ? 'Saving...'
                    : 'Creating...'}
                </>
              ) : (
                <>
                  {isEdit
                    ? 'Save changes'
                    : 'Create customer'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
