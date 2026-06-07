import type { LoaderFunctionArgs } from 'react-router-dom'
import { fetchAndCacheFeed, getCachedFeed } from '@/lib/feedCache'
import { getBestStories, getNewStories, getStory, getTopStories } from '@/services/hackernews.service'
import { getProfile } from '@/services/user.service'
import type { StoryRecord } from '@/types/StoryRecord'
import type { FeedKey } from '@/lib/feedCache'

export type StoriesLoaderData = {
  stories: StoryRecord[]
  feed: FeedKey
}

function storiesLoader(feed: FeedKey, fetcher: () => Promise<StoryRecord[]>) {
  const cached = getCachedFeed(feed)
  if (cached) {
    return { stories: cached, feed }
  }

  return fetchAndCacheFeed(feed, fetcher).then((stories) => ({ stories, feed }))
}

export function topStoriesLoader() {
  return storiesLoader('top', getTopStories)
}

export function newStoriesLoader() {
  return storiesLoader('new', getNewStories)
}

export function bestStoriesLoader() {
  return storiesLoader('best', getBestStories)
}

export async function articleLoader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id)
  if (!Number.isFinite(id)) {
    throw new Response('Invalid story id', { status: 400 })
  }
  const story = await getStory(id)
  if (!story) {
    throw new Response('Story not found', { status: 404 })
  }
  return story
}

export async function userLoader() {
  return getProfile()
}
