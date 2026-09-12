import { motion } from 'framer-motion'

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading = false,
  formatter,
}) {
  const formattedValue =
    formatter && !loading
      ? formatter(value)
      : value

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      whileHover={{
        y: -2,
      }}
      className="rounded-xl border bg-card p-5 shadow-sm"
    >
      {loading ? (
        <div className="space-y-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />

          <div className="h-4 w-24 animate-pulse rounded bg-muted" />

          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight">
                {formattedValue}
              </p>

              {description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}