import {
  Edit3,
  FolderOpen,
  Loader2,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import CategoryDialog from '@/features/categories/components/CategoryDialog'
import DeleteCategoryDialog from '@/features/categories/components/DeleteCategoryDialog'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useRestoreCategoryMutation,
  useUpdateCategoryMutation,
} from '@/features/categories/categoriesApi'
import { selectCurrentUser } from '@/features/auth/authSelectors'
import { getApiErrorMessage } from '@/utils/apiError'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

function getCategories(response) {
  const data = response?.data

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.items)) {
    return data.items
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  if (Array.isArray(response?.items)) {
    return response.items
  }

  return []
}

function getPagination(response) {
  const data = response?.data

  return {
    totalCount:
      data?.totalCount ??
      response?.totalCount ??
      data?.totalItems ??
      response?.totalItems ??
      0,

    totalPages:
      data?.totalPages ??
      response?.totalPages ??
      0,

    pageNumber:
      data?.pageNumber ??
      response?.pageNumber ??
      1,

    pageSize:
      data?.pageSize ??
      response?.pageSize ??
      10,
  }
}

function isCategoryDeleted(category) {
  return (
    category?.isDeleted === true ||
    category?.IsDeleted === true ||
    category?.deletedAt != null ||
    category?.DeletedAt != null
  )
}

function getCategoryMutationError(error) {
  if (!error) {
    return ''
  }

  const data = error?.data

  if (typeof data === 'string') {
    return data
  }

  if (data?.message) {
    return data.message
  }

  if (
    Array.isArray(data?.errors) &&
    data.errors.length > 0
  ) {
    return data.errors.join(', ')
  }

  return getApiErrorMessage(error)
}

export default function CategoriesPage() {
  const user = useSelector(selectCurrentUser)

  const permissions = user?.permissions || []

  const canManage =
    permissions.includes('Categories')

  // --------------------------------------------------
  // Search / pagination
  // --------------------------------------------------

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // --------------------------------------------------
  // Category dialog
  // --------------------------------------------------

  const [dialogOpen, setDialogOpen] =
    useState(false)

  const [dialogMode, setDialogMode] =
    useState('create')

  const [selectedCategory, setSelectedCategory] =
    useState(null)

  // --------------------------------------------------
  // Delete dialog
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] =
    useState(false)

  // --------------------------------------------------
  // Get categories
  // --------------------------------------------------

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCategoriesQuery({
    search,
    pageNumber,
    pageSize,
    includeDeleted: true,
  })

  // --------------------------------------------------
  // Mutations
  // --------------------------------------------------

  const [
    createCategory,
    {
      isLoading: isCreating,
      error: createError,
    },
  ] = useCreateCategoryMutation()

  const [
    updateCategory,
    {
      isLoading: isUpdating,
      error: updateError,
    },
  ] = useUpdateCategoryMutation()

  const [
    deleteCategory,
    {
      isLoading: isDeleting,
      error: deleteError,
    },
  ] = useDeleteCategoryMutation()

  const [
    restoreCategory,
    {
      isLoading: isRestoring,
      error: restoreError,
    },
  ] = useRestoreCategoryMutation()

  // --------------------------------------------------
  // Derived data
  // --------------------------------------------------

  const categories = useMemo(
    () => getCategories(data),
    [data],
  )

  const pagination = useMemo(
    () => getPagination(data),
    [data],
  )

  const totalCount =
    pagination.totalCount ||
    categories.length

  const totalPages =
    pagination.totalPages ||
    Math.max(
      1,
      Math.ceil(
        totalCount / pageSize,
      ),
    )

  // --------------------------------------------------
  // Search debounce
  // --------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
      setPageNumber(1)
    }, 350)

    return () => {
      clearTimeout(timer)
    }
  }, [searchInput])

  // --------------------------------------------------
  // Dialog error
  // --------------------------------------------------

  const dialogError =
    dialogMode === 'edit'
      ? getCategoryMutationError(
          updateError,
        )
      : getCategoryMutationError(
          createError,
        )

  const deleteRestoreError =
    getCategoryMutationError(
      deleteError ||
        restoreError,
    )

  // --------------------------------------------------
  // Create
  // --------------------------------------------------

  const openCreateDialog = () => {
    setSelectedCategory(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const openEditDialog = (
    category,
  ) => {
    setSelectedCategory(category)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  // --------------------------------------------------
  // Close category dialog
  // --------------------------------------------------

  const closeDialog = () => {
    if (
      isCreating ||
      isUpdating
    ) {
      return
    }

    setDialogOpen(false)
    setSelectedCategory(null)
  }

  // --------------------------------------------------
  // Create / Update
  // --------------------------------------------------

  const handleCategorySubmit =
    async (values) => {
      try {
        if (
          dialogMode === 'edit'
        ) {
          if (!selectedCategory?.id) {
            return
          }

          await updateCategory({
            id: selectedCategory.id,
            name: values.name.trim(),
          }).unwrap()
        } else {
          await createCategory({
            name: values.name.trim(),
          }).unwrap()
        }

        setDialogOpen(false)
        setSelectedCategory(null)
      } catch (mutationError) {
        console.error(
          'Category mutation failed:',
          mutationError,
        )
      }
    }

  // --------------------------------------------------
  // Open delete confirmation
  // --------------------------------------------------

  const openDeleteDialog = (
    category,
  ) => {
    setSelectedCategory(category)
    setDeleteOpen(true)
  }

  // --------------------------------------------------
  // Close delete confirmation
  // --------------------------------------------------

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return
    }

    setDeleteOpen(false)
    setSelectedCategory(null)
  }

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async () => {
    if (!selectedCategory?.id) {
      return
    }

    try {
      await deleteCategory(
        selectedCategory.id,
      ).unwrap()

      setDeleteOpen(false)
      setSelectedCategory(null)
    } catch (mutationError) {
      console.error(
        'Category deletion failed:',
        mutationError,
      )
    }
  }

  // --------------------------------------------------
  // Restore
  // --------------------------------------------------

  const handleRestore = async (
    category,
  ) => {
    if (!category?.id) {
      return
    }

    try {
      await restoreCategory(
        category.id,
      ).unwrap()
    } catch (mutationError) {
      console.error(
        'Category restoration failed:',
        mutationError,
      )
    }
  }

  // --------------------------------------------------
  // Combined mutation state
  // --------------------------------------------------

  const isMutating =
    isCreating ||
    isUpdating ||
    isDeleting ||
    isRestoring

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <section className="space-y-6">
      {/* ============================================
          PAGE HEADER
      ============================================ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderOpen className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Categories
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Organize your products into manageable categories.
              </p>
            </div>
          </div>
        </div>

        {canManage && (
          <Button
            type="button"
            onClick={
              openCreateDialog
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add category
          </Button>
        )}
      </div>

      {/* ============================================
          DELETE / RESTORE ERROR
      ============================================ */}

      {deleteRestoreError && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {deleteRestoreError}
        </div>
      )}

      {/* ============================================
          GET ERROR
      ============================================ */}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {getApiErrorMessage(error)}
        </div>
      )}

      {/* ============================================
          TOOLBAR
      ============================================ */}

      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={searchInput}
              onChange={(event) => {
                setSearchInput(
                  event.target.value,
                )
              }}
              placeholder="Search categories..."
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {totalCount}{' '}
              {totalCount === 1
                ? 'category'
                : 'categories'}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={refetch}
              disabled={
                isFetching ||
                isMutating
              }
              aria-label="Refresh categories"
              title="Refresh categories"
            >
              <RefreshCcw
                className={[
                  'h-4 w-4',
                  isFetching
                    ? 'animate-spin'
                    : '',
                ].join(' ')}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* ============================================
          CATEGORY TABLE
      ============================================ */}

      <div className="overflow-hidden rounded-xl border bg-card">
        {isLoading ? (
          <LoadingState />
        ) : categories.length === 0 ? (
          <EmptyState
            search={search}
            canManage={canManage}
            onCreate={
              openCreateDialog
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-3 text-left font-semibold">
                      Products
                    </th>

                    <th className="px-6 py-3 text-left font-semibold">
                      Status
                    </th>

                    {canManage && (
                      <th className="px-6 py-3 text-right font-semibold">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {categories.map(
                    (category) => {
                      const deleted =
                        isCategoryDeleted(
                          category,
                        )

                      const productCount =
                        category?.productCount ??
                        category?.ProductCount ??
                        category?.productsCount ??
                        category?.ProductsCount ??
                        category?.totalProducts ??
                        category?.TotalProducts ??
                        0

                      const categoryName =
                        category?.name ??
                        category?.Name ??
                        'Unnamed category'

                      const categoryId =
                        category?.id ??
                        category?.Id

                      return (
                        <tr
                          key={
                            categoryId
                          }
                          className={[
                            'transition-colors hover:bg-muted/30',
                            deleted
                              ? 'bg-muted/20 opacity-70'
                              : '',
                          ].join(' ')}
                        >
                          {/* Category */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={[
                                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                                  deleted
                                    ? 'bg-muted text-muted-foreground'
                                    : 'bg-primary/10 text-primary',
                                ].join(' ')}
                              >
                                <FolderOpen className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p
                                  className={[
                                    'font-medium',
                                    deleted
                                      ? 'text-muted-foreground line-through'
                                      : '',
                                  ].join(' ')}
                                >
                                  {categoryName}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                  {categoryId}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Products */}
                          <td className="px-6 py-4 text-muted-foreground">
                            {productCount}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={[
                                'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                                deleted
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                              ].join(' ')}
                            >
                              {deleted
                                ? 'Deleted'
                                : 'Active'}
                            </span>
                          </td>

                          {/* Actions */}
                          {canManage && (
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-1">
                                {deleted ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    title="Restore category"
                                    aria-label={`Restore ${categoryName}`}
                                    disabled={
                                      isRestoring
                                    }
                                    onClick={() =>
                                      handleRestore(
                                        category,
                                      )
                                    }
                                    className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-400"
                                  >
                                    {isRestoring ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <RotateCcw className="h-4 w-4" />
                                    )}
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      title="Edit category"
                                      aria-label={`Edit ${categoryName}`}
                                      disabled={
                                        isMutating
                                      }
                                      onClick={() =>
                                        openEditDialog(
                                          category,
                                        )
                                      }
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      title="Delete category"
                                      aria-label={`Delete ${categoryName}`}
                                      disabled={
                                        isMutating
                                      }
                                      onClick={() =>
                                        openDeleteDialog(
                                          category,
                                        )
                                      }
                                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      )
                    },
                  )}
                </tbody>
              </table>
            </div>

            {/* Fetching indicator */}
            {isFetching && (
              <div className="flex items-center gap-2 border-t px-5 py-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating categories...
              </div>
            )}

            {/* Pagination */}
            <Pagination
              pageNumber={
                pageNumber
              }
              pageSize={pageSize}
              totalPages={
                totalPages
              }
              onPageChange={
                setPageNumber
              }
              onPageSizeChange={(
                value,
              ) => {
                setPageSize(value)
                setPageNumber(1)
              }}
            />
          </>
        )}
      </div>

      {/* ============================================
          CREATE / UPDATE DIALOG
      ============================================ */}

      <CategoryDialog
        open={dialogOpen}
        mode={dialogMode}
        category={
          selectedCategory
        }
        onClose={closeDialog}
        onSubmit={
          handleCategorySubmit
        }
        isSubmitting={
          isCreating ||
          isUpdating
        }
        errorMessage={
          dialogError
        }
      />

      {/* ============================================
          DELETE CONFIRMATION
      ============================================ */}

      <DeleteCategoryDialog
        open={deleteOpen}
        category={
          selectedCategory
        }
        onClose={
          closeDeleteDialog
        }
        onConfirm={
          handleDelete
        }
        isDeleting={
          isDeleting
        }
      />
    </section>
  )
}

/* ==================================================
   Loading State
================================================== */

function LoadingState() {
  return (
    <div className="flex min-h-80 items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading categories...
      </div>
    </div>
  )
}

/* ==================================================
   Empty State
================================================== */

function EmptyState({
  search,
  canManage,
  onCreate,
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <FolderOpen className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-base font-semibold">
        {search
          ? 'No categories found'
          : 'No categories yet'}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {search
          ? 'Try changing your search term.'
          : 'Create your first category to start organizing products.'}
      </p>

      {canManage && !search && (
        <Button
          type="button"
          className="mt-5"
          onClick={onCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create category
        </Button>
      )}
    </div>
  )
}

/* ==================================================
   Pagination
================================================== */

function Pagination({
  pageNumber,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) {
  const safeTotalPages =
    Math.max(1, totalPages)

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>

        <select
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(
              Number(
                event.target.value,
              ),
            )
          }
          className="h-9 rounded-md border bg-background px-2 text-sm outline-none focus:border-primary"
        >
          {PAGE_SIZE_OPTIONS.map(
            (size) => (
              <option
                key={size}
                value={size}
              >
                {size}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <span className="text-sm text-muted-foreground">
          Page {pageNumber} of{' '}
          {safeTotalPages}
        </span>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              pageNumber <= 1
            }
            onClick={() =>
              onPageChange(
                pageNumber - 1,
              )
            }
          >
            Previous
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              pageNumber >=
              safeTotalPages
            }
            onClick={() =>
              onPageChange(
                pageNumber + 1,
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}