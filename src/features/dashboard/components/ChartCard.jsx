import { motion } from 'framer-motion'

export default function ChartCard({
  title,
  description,
  loading,
  error,
  onRetry,
  children,
}) {
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
      className="rounded-xl border bg-card p-5 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="font-semibold">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex h-[300px] items-end gap-3">
          {[55, 75, 45, 85, 65, 90, 50].map(
            (height, index) => (
              <div
                key={index}
                className="flex-1 animate-pulse rounded-t bg-muted"
                style={{
                  height: `${height}%`,
                }}
              />
            ),
          )}
        </div>
      ) : error ? (
        <div className="flex h-[300px] flex-col items-center justify-center text-center">
          <p className="text-sm font-medium">
            Unable to load this chart.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        children
      )}
    </motion.div>
  )
}