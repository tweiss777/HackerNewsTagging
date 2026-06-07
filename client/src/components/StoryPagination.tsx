import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaginationEllipsis } from '@/components/ui/pagination'
import { getVisiblePages } from '@/lib/pagination'
import { cn } from '@/lib/utils'

type StoryPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function StoryPagination({ page, totalPages, onPageChange, className }: StoryPaginationProps) {
  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages(page, totalPages)

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('flex w-full max-w-full items-center justify-center gap-2', className)}
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="shrink-0"
      >
        <ChevronLeft />
      </Button>

      <div className="flex min-w-0 items-center justify-center gap-0.5">
        {visiblePages.map((pageNum, index) =>
          pageNum === 'ellipsis' ? (
            <PaginationEllipsis key={`ellipsis-${index}`} />
          ) : (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'outline' : 'ghost'}
              size="icon"
              onClick={() => onPageChange(pageNum)}
              aria-current={pageNum === page ? 'page' : undefined}
              className="shrink-0"
            >
              {pageNum}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="shrink-0"
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}
