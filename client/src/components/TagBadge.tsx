import { Badge } from '@/components/ui/badge'
import { formatTagLabel } from '@/types/StoryRecord'
import { cn } from '@/lib/utils'

type TagBadgeProps = {
  tag: string
  variant?: 'topic' | 'intent'
  className?: string
}

export function TagBadge({ tag, variant = 'topic', className }: TagBadgeProps) {
  return (
    <Badge
      variant={variant === 'intent' ? 'secondary' : 'outline'}
      className={cn('font-normal', className)}
    >
      {formatTagLabel(tag)}
    </Badge>
  )
}
