export function getVisiblePages(
  page: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = []
  const start = Math.max(1, page - 1)
  const end = Math.min(totalPages, page + 1)

  pages.push(1)
  if (start > 2) pages.push('ellipsis')

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) pages.push(i)
  }

  if (end < totalPages - 1) pages.push('ellipsis')
  if (totalPages > 1) pages.push(totalPages)

  return pages
}
