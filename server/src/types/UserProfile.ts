export interface UserProfile {
  interests: string[] // ["ai_ml", "technical_deep_dive", "paper"]
  blockedTags?: string[]
}

export const USER_PROFILE: UserProfile = {
  interests: [],
  blockedTags: [],
}
