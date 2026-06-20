import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
  autoComplete?: string
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  className,
  id,
  autoComplete = 'off',
}: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
      </Button>
    </div>
  )
}
