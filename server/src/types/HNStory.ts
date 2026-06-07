type HNStoryBase = {
  id: number
  title: string
  score: number
  by: string
  time: number
  descendants?: number
  url?: string
}

type HNStoryItem = HNStoryBase & { type: 'story'; url?: string; text?: string }
type HNPollItem = HNStoryBase & { type: 'poll'; text?: string }
export type HNStory = HNStoryItem | HNPollItem
