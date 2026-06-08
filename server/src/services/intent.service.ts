import type { HNStory } from '../types/HNStory.js'
import type { IntentTag, TopicTag } from '../types/StoryRecord.js'
import type { UserProfile } from '../types/UserProfile.js'

export function computeIntent(
  story: HNStory,
  topicTags: TopicTag[],
  profile: UserProfile
): IntentTag[] {
  const overlap = topicTags.filter((t) => profile.interests.includes(t))
  const highSignal = story.score > 100 && (story.descendants ?? 0) > 50
  if (overlap.length > 0 && highSignal) return ['read_now']
  if ((story.descendants ?? 0) > story.score) return ['skim_comments']
  return ['bookmark_later']
}
