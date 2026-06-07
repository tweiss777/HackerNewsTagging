import { fetchWrapper } from './fetchWrapper'
import type { TopicTag } from '../types/StoryRecord'
import type { UserProfile } from '../types/UserProfile'

export function getProfile(): Promise<UserProfile> {
  return fetchWrapper<UserProfile>('/api/user/profile')
}

export function addInterest(interest: TopicTag): Promise<UserProfile> {
  return fetchWrapper<UserProfile>(
    new Request('/api/user/interests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interest }),
    })
  )
}

export function removeInterest(interest: TopicTag): Promise<UserProfile> {
  return fetchWrapper<UserProfile>(
    new Request(`/api/user/interests/${interest}`, { method: 'DELETE' })
  )
}

export function addBlockedTag(tag: TopicTag): Promise<UserProfile> {
  return fetchWrapper<UserProfile>(
    new Request('/api/user/blocked-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag }),
    })
  )
}

export function removeBlockedTag(tag: TopicTag): Promise<UserProfile> {
  return fetchWrapper<UserProfile>(
    new Request(`/api/user/blocked-tags/${tag}`, { method: 'DELETE' })
  )
}
