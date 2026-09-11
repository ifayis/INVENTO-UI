import { useState } from 'react'
import {
  Eye,
  EyeOff,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function PasswordInput({
  id,
  placeholder = 'Password',
  ...props
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        className="pr-10"
        {...props}
      />

      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={
          visible
            ? 'Hide password'
            : 'Show password'
        }
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}