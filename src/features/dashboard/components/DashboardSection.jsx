export default function DashboardSection({
  title,
  description,
  action,
  children,
  className = '',
}) {
  return (
    <section className={className}>
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  )
}