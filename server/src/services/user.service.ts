import type { TopicTag } from '@/types/StoryRecord'
import { USER_PROFILE } from '@/types/UserProfile'

export function getProfile() {
  return USER_PROFILE
}

export function addInterest(interest: TopicTag) {
  if (!USER_PROFILE.interests.includes(interest)) {
    USER_PROFILE.interests.push(interest)
  }
  return USER_PROFILE
}

export function removeInterest(interest: TopicTag) {
  USER_PROFILE.interests = USER_PROFILE.interests.filter((i) => i !== interest)
  return USER_PROFILE
}

export function addBlockedTag(tag: TopicTag) {
  if (!USER_PROFILE.blockedTags) {
    USER_PROFILE.blockedTags = []
  }
  if (!USER_PROFILE.blockedTags.includes(tag)) {
    USER_PROFILE.blockedTags.push(tag)
  }
  return USER_PROFILE
}

export function removeBlockedTag(tag: TopicTag) {
  USER_PROFILE.blockedTags = (USER_PROFILE.blockedTags ?? []).filter((t) => t !== tag)
  return USER_PROFILE
}
