import { useEffect, useMemo, useState } from 'react'
import { Link, useLoaderData, useNavigation } from 'react-router-dom'
import { LayoutGrid, Loader2, Search, Table as TableIcon } from 'lucide-react'
import { StoryPagination } from '@/components/StoryPagination'
import { TagBadge } from '@/components/TagBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { StoriesLoaderData } from '@/loaders'
import { getCachedFeed } from '@/lib/feedCache'
import { filterStories, paginateStories, sortStoriesByDate } from '@/lib/storyFilters'
import type { StoryRecord } from '@/types/StoryRecord'

const feedLabels = {
  top: 'Top Stories',
  new: 'New Stories',
  best: 'Best Stories',
} as const

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString()
}

function formatShortDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const feedPaths = new Set(['/top', '/new', '/best'])

function StoryCard({ story }: { story: StoryRecord }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-2">
        <CardTitle className="text-base leading-snug">
          <Link to={`/story/${story.hnId}`} className="hover:underline">
            {story.title}
          </Link>
        </CardTitle>
        <CardDescription>
          {story.score} points · {story.commentCount} comments · {formatDate(story.time)}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {story.topicTags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        {story.intentTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {story.intentTags.map((tag) => (
              <TagBadge key={tag} tag={tag} variant="intent" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Stories() {
  const { stories, feed } = useLoaderData() as StoriesLoaderData
  const navigation = useNavigation()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'card' | 'table'>('card')

  const loadingFeed =
    (navigation.location?.pathname?.slice(1) as StoriesLoaderData['feed'] | undefined) ?? feed

  const isFeedLoading =
    navigation.state === 'loading' &&
    feedPaths.has(navigation.location?.pathname ?? '') &&
    !getCachedFeed(loadingFeed)

  useEffect(() => {
    setPage(1)
  }, [feed])

  const processed = useMemo(() => {
    const filtered = filterStories(sortStoriesByDate(stories), query)
    return paginateStories(filtered, page)
  }, [stories, query, page])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {feedLabels[isFeedLoading ? loadingFeed : feed]}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isFeedLoading ? 'Loading stories...' : `${processed.totalItems} stories · sorted by date`}
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => value && setView(value as 'card' | 'table')}
          variant="outline"
        >
          <ToggleGroupItem value="card" aria-label="Card view">
            <LayoutGrid />
            Cards
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <TableIcon />
            Table
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search by title or tag..."
          className="pl-9"
        />
      </div>

      {isFeedLoading ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" aria-label="Loading stories" />
        </div>
      ) : processed.items.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No stories match your search.
          </CardContent>
        </Card>
      ) : view === 'card' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {processed.items.map((story) => (
            <StoryCard key={story.hnId} story={story} />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[38%]">Title</TableHead>
                  <TableHead className="w-[10%]">Score</TableHead>
                  <TableHead className="w-[12%]">Comments</TableHead>
                  <TableHead className="w-[18%]">Date</TableHead>
                  <TableHead className="w-[22%]">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processed.items.map((story) => (
                  <TableRow key={story.hnId}>
                    <TableCell className="max-w-0 font-medium whitespace-normal">
                      <Link
                        to={`/story/${story.hnId}`}
                        className="line-clamp-2 hover:underline"
                        title={story.title}
                      >
                        {story.title}
                      </Link>
                    </TableCell>
                    <TableCell className="tabular-nums">{story.score}</TableCell>
                    <TableCell className="tabular-nums">{story.commentCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-normal">
                      {formatShortDate(story.time)}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <div className="flex flex-wrap gap-1">
                        {story.topicTags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="max-w-full truncate font-normal">
                            {tag.replaceAll('_', ' ')}
                          </Badge>
                        ))}
                        {story.topicTags.length > 2 && (
                          <Badge variant="secondary">+{story.topicTags.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!isFeedLoading && (
        <StoryPagination
          page={processed.page}
          totalPages={processed.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
