import type { StoryRecord } from '@/types/StoryRecord'

export const STORIES_PAGE_SIZE = 12

export function filterStories(stories: StoryRecord[], query: string): StoryRecord[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return stories

  return stories.filter((story) => {
    const titleMatch = story.title.toLowerCase().includes(normalized)
    const tagMatch = [...story.topicTags, ...story.intentTags].some((tag) =>
      tag.toLowerCase().includes(normalized)
    )
    return titleMatch || tagMatch
  })
}

export function sortStoriesByDate(stories: StoryRecord[]): StoryRecord[] {
  return [...stories].sort((a, b) => b.time - a.time)
}

export function paginateStories<T>(items: T[], page: number, pageSize = STORIES_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems: items.length,
  }
}
