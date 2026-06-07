import type { StoryRecord } from '@/types/StoryRecord'
import { fetchWrapper } from './fetchWrapper'

export async function getTopStories() {
  return fetchWrapper<StoryRecord[]>('/api/hacker-news/top-stories')
}

export async function getNewStories() {
  return fetchWrapper<StoryRecord[]>('/api/hacker-news/new-stories')
}

export async function getBestStories() {
  return fetchWrapper<StoryRecord[]>('/api/hacker-news/best-stories')
}

export async function getStory(id: number) {
  return fetchWrapper<StoryRecord>(`/api/hacker-news/${id}/story`)
}

export function summarizeStory(id: number, onChunk: (text: string) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const source = new EventSource(`/api/hacker-news/${id}/summarize`)
    source.onmessage = (event: MessageEvent<string>) => {
      if (event.data === '[DONE]') {
        source.close()
        resolve()
      } else {
        onChunk(event.data)
      }
    }
    source.onerror = () => {
      source.close()
      reject(new Error('SSE connection error'))
    }
  })
}
