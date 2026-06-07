import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react'
import { TagBadge } from '@/components/TagBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { summarizeStory } from '@/services/hackernews.service'
import type { StoryRecord } from '@/types/StoryRecord'

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString()
}

export function Article() {
  const story = useLoaderData() as StoryRecord
  const [summary, setSummary] = useState(story.discussionSummary ?? '')
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const handleSummarize = async () => {
    setIsSummarizing(true)
    setSummaryError(null)
    setSummary('')

    try {
      await summarizeStory(story.hnId, (chunk) => {
        setSummary((prev) => prev + chunk)
      })
    } catch {
      setSummaryError('Failed to generate summary. Make sure the server is running.')
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/${story.feed}`}>
          <ArrowLeft data-icon="inline-start" />
          Back to {story.feed} stories
        </Link>
      </Button>

      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{story.title}</h1>
          <p className="text-sm text-muted-foreground">
            {story.score} points · {story.commentCount} comments · {formatDate(story.time)}
          </p>
        </div>

        {story.url && (
          <Button variant="outline" size="sm" asChild>
            <a href={story.url} target="_blank" rel="noreferrer">
              <ExternalLink data-icon="inline-start" />
              Open original article
            </a>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tags</CardTitle>
          <CardDescription>AI-classified topic and intent labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Topic tags</p>
            <div className="flex flex-wrap gap-1.5">
              {story.topicTags.length > 0 ? (
                story.topicTags.map((tag) => <TagBadge key={tag} tag={tag} />)
              ) : (
                <span className="text-sm text-muted-foreground">No topic tags</span>
              )}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Intent tags</p>
            <div className="flex flex-wrap gap-1.5">
              {story.intentTags.length > 0 ? (
                story.intentTags.map((tag) => <TagBadge key={tag} tag={tag} variant="intent" />)
              ) : (
                <span className="text-sm text-muted-foreground">No intent tags</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {story.text && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Story text</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {story.text}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Summary</CardTitle>
            <CardDescription>Generated on demand via GPT</CardDescription>
          </div>
          <Button onClick={handleSummarize} disabled={isSummarizing}>
            <Sparkles data-icon="inline-start" />
            {isSummarizing ? 'Summarizing...' : summary ? 'Regenerate' : 'Summarize'}
          </Button>
        </CardHeader>
        <CardContent>
          {isSummarizing && !summary && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          )}
          {summaryError && <p className="text-sm text-destructive">{summaryError}</p>}
          {summary && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{summary}</p>
          )}
          {!summary && !isSummarizing && !summaryError && (
            <p className="text-sm text-muted-foreground">
              Click summarize to generate a concise overview of this story.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
