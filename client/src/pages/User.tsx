import { useState } from 'react'
import { useLoaderData, useRevalidator } from 'react-router-dom'
import { X } from 'lucide-react'
import { TagBadge } from '@/components/TagBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  addBlockedTag,
  addInterest,
  removeBlockedTag,
  removeInterest,
} from '@/services/user.service'
import { formatTagLabel, TOPIC_TAGS, type TopicTag } from '@/types/StoryRecord'
import type { UserProfile } from '@/types/UserProfile'

export function User() {
  const profile = useLoaderData() as UserProfile
  const revalidator = useRevalidator()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const interests = profile.interests as TopicTag[]
  const blockedTags = (profile.blockedTags ?? []) as TopicTag[]

  const availableInterests = TOPIC_TAGS.filter((tag) => !interests.includes(tag))
  const availableBlockedTags = TOPIC_TAGS.filter((tag) => !blockedTags.includes(tag))

  const runUpdate = async (action: () => Promise<unknown>) => {
    setPending(true)
    setError(null)
    try {
      await action()
      revalidator.revalidate()
    } catch {
      setError('Failed to update profile. Make sure the server is running.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your interests and blocked tags to personalize story recommendations.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Interests</CardTitle>
          <CardDescription>
            Stories matching these topic tags will receive higher intent scores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {interests.length > 0 ? (
              interests.map((interest) => (
                <div key={interest} className="flex items-center gap-1">
                  <TagBadge tag={interest} />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={pending}
                    onClick={() => runUpdate(() => removeInterest(interest))}
                    aria-label={`Remove ${formatTagLabel(interest)}`}
                  >
                    <X />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No interests added yet.</p>
            )}
          </div>

          {availableInterests.length > 0 && (
            <Select
              disabled={pending}
              onValueChange={(value) => runUpdate(() => addInterest(value as TopicTag))}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Add an interest..." />
              </SelectTrigger>
              <SelectContent>
                {availableInterests.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {formatTagLabel(tag)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Blocked Tags</CardTitle>
          <CardDescription>
            Stories with these tags will be deprioritized in your feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {blockedTags.length > 0 ? (
              blockedTags.map((tag) => (
                <div key={tag} className="flex items-center gap-1">
                  <TagBadge tag={tag} variant="intent" />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={pending}
                    onClick={() => runUpdate(() => removeBlockedTag(tag))}
                    aria-label={`Remove blocked tag ${formatTagLabel(tag)}`}
                  >
                    <X />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No blocked tags.</p>
            )}
          </div>

          {availableBlockedTags.length > 0 && (
            <Select
              disabled={pending}
              onValueChange={(value) => runUpdate(() => addBlockedTag(value as TopicTag))}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Block a tag..." />
              </SelectTrigger>
              <SelectContent>
                {availableBlockedTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {formatTagLabel(tag)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Separator />

      <p className="text-xs text-muted-foreground">
        Profile is stored in server memory and resets when the server restarts.
      </p>
    </div>
  )
}
