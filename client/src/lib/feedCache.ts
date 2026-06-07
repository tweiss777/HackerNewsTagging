import type { StoryRecord } from '@/types/StoryRecord'

export type FeedKey = 'top' | 'new' | 'best'

const feedCache = new Map<FeedKey, StoryRecord[]>()
const inflight = new Map<FeedKey, Promise<StoryRecord[]>>()

export function getCachedFeed(feed: FeedKey): StoryRecord[] | undefined {
  return feedCache.get(feed)
}

export function setCachedFeed(feed: FeedKey, stories: StoryRecord[]) {
  feedCache.set(feed, stories)
}

export function fetchAndCacheFeed(
  feed: FeedKey,
  fetcher: () => Promise<StoryRecord[]>
): Promise<StoryRecord[]> {
  const cached = feedCache.get(feed)
  if (cached) return Promise.resolve(cached)

  const pending = inflight.get(feed)
  if (pending) return pending

  const promise = fetcher()
    .then((stories) => {
      feedCache.set(feed, stories)
      inflight.delete(feed)
      return stories
    })
    .catch((error) => {
      inflight.delete(feed)
      throw error
    })

  inflight.set(feed, promise)
  return promise
}

export function invalidateFeedCache(feed?: FeedKey) {
  if (feed) {
    feedCache.delete(feed)
    inflight.delete(feed)
  } else {
    feedCache.clear()
    inflight.clear()
  }
}
