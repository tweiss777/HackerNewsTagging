import axios from 'axios'
import { summarize } from './openai.service.js'
import type { StoryRecord, TopicTag } from '../types/StoryRecord.js'
import type { HNStory } from '../types/HNStory.js'
import { assignTags } from './classifier.service.js'
import { USER_PROFILE } from '../types/UserProfile.js'
import { computeIntent } from './intent.service.js'

const hackerNewsInstance = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com',
})

const HNStories = new Map<number, StoryRecord>()

async function mapStories(stories: HNStory[], feed: StoryRecord['feed']) {
  const storyPromises = stories.map(async (story) => {
    if (!HNStories.has(story.id)) {
      const topicTags: TopicTag[] = await assignTags(story)
      const intentTags = computeIntent(story, topicTags, USER_PROFILE)
      const newStoryRecord: StoryRecord = {
        hnId: story.id,
        title: story.title,
        url: story.url ?? null,
        text: story.text ?? null,
        score: story.score,
        time: story.time,
        commentCount: story.descendants ?? 0,
        feed,
        topicTags,
        intentTags,
      }
      HNStories.set(newStoryRecord.hnId, newStoryRecord)
    }
  })
  await Promise.all(storyPromises)
}

async function fetchStories(endpoint: string): Promise<HNStory[]> {
  const { data: ids } = await hackerNewsInstance.get<number[]>(endpoint)
  const stories = await Promise.all(
    ids.map(async (id) => {
      const { data } = await hackerNewsInstance.get<HNStory | null>(`/v0/item/${id}.json`)
      return data
    })
  )
  return stories.filter((story): story is HNStory => story !== null && story.type === 'story')
}

export async function getTopStories(): Promise<StoryRecord[]> {
  const stories = await fetchStories('/v0/topstories.json')
  await mapStories(stories, 'top')
  return stories.map((s) => HNStories.get(s.id)).filter((s): s is StoryRecord => s !== undefined)
}

export async function getBestStories(): Promise<StoryRecord[]> {
  const stories = await fetchStories('/v0/beststories.json')
  await mapStories(stories, 'best')
  return stories.map((s) => HNStories.get(s.id)).filter((s): s is StoryRecord => s !== undefined)
}

export async function getNewStories(): Promise<StoryRecord[]> {
  const stories = await fetchStories('/v0/newstories.json')
  await mapStories(stories, 'new')
  return stories.map((s) => HNStories.get(s.id)).filter((s): s is StoryRecord => s !== undefined)
}

export async function getStory(id: number) {
  return HNStories.get(id)
}

export async function summarizeArticle(id: number) {
  const story = HNStories.get(id)
  if (story) {
    const [text, url] = [story.text, story.url]
    return await summarize(text ?? '', url ?? '')
  }
  throw new Error("Story doesn't exit")
}
