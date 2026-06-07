// Story record in your DB
export interface StoryRecord {
  hnId: number
  title: string
  url: string | null
  score: number
  time: number
  commentCount: number
  feed: 'top' | 'new' | 'best'
  text: string | null
  // AI-derived (cached)
  topicTags: TopicTag[] // multi-label
  intentTags: IntentTag[] // can be multi or single highest
  discussionSummary?: string // from your existing summarizer

  // optional for semantic search
  embedding?: number[]
}

export type TopicTag =
  | 'technical_deep_dive'
  | 'new_tool_or_library'
  | 'company_or_startup_news'
  | 'ai_ml'
  | 'security_privacy'
  | 'science_research'
  | 'policy_regulation_law'
  | 'career_work_culture'
  | 'opinion_analysis'
  | 'historical_or_retrospective'
  | 'paper_research'
  | 'show_hn'
  | 'ask_hn'
  | 'tutorial'
  | 'reference'
  | 'benchmark'
  | 'postmortem'
  | 'discussion_prompt'
  | 'personal_story'
  | 'demo_project'
  | 'investigation'
  | 'announcement'
  | 'other'

export type IntentTag =
  | 'read_now' // high signal, worth opening
  | 'skim' // useful but not urgent
  | 'save_for_later' // long/deep content
  | 'discuss_with_team' // relevant for engineering/product discussion
  | 'try_this' // tool/library/product worth testing
  | 'watch_risk' // security/legal/business risk to monitor
  | 'skim_comments' // discussion > link
  | 'bookmark_later'
  | 'ignore' // low signal, duplicate, shallow, or irrelevant

export const TOPIC_TAGS: TopicTag[] = [
  'technical_deep_dive',
  'new_tool_or_library',
  'company_or_startup_news',
  'ai_ml',
  'security_privacy',
  'science_research',
  'policy_regulation_law',
  'career_work_culture',
  'opinion_analysis',
  'historical_or_retrospective',
  'paper_research',
  'show_hn',
  'ask_hn',
  'tutorial',
  'reference',
  'benchmark',
  'postmortem',
  'discussion_prompt',
  'personal_story',
  'demo_project',
  'investigation',
  'announcement',
  'other',
]

export function formatTagLabel(tag: string): string {
  return tag
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
