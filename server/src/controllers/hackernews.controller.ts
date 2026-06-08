import type { Request, Response, NextFunction } from 'express'
import * as hackerNewsService from '../services/hackernews.service.js'

export async function getTopStories(_req: Request, res: Response, next: NextFunction) {
  try {
    const stories = await hackerNewsService.getTopStories()
    res.json(stories).end()
  } catch (error) {
    next(error)
  }
}

export async function getBestStories(_req: Request, res: Response, next: NextFunction) {
  try {
    const stories = await hackerNewsService.getBestStories()
    res.json(stories).end()
  } catch (error) {
    next(error)
  }
}

export async function getNewStories(_req: Request, res: Response, next: NextFunction) {
  try {
    const stories = await hackerNewsService.getNewStories()
    res.json(stories).end()
  } catch (error) {
    next(error)
  }
}

export async function getStory(req: Request, res: Response, next: NextFunction) {
  try {
    const storyId = Number(req.params.id)
    if (isNaN(storyId)) {
      throw new Error('invalid story id')
    }
    const story = await hackerNewsService.getStory(storyId)
    res.json(story).end()
  } catch (error) {
    res.status(400)
    next(error)
  }
}

export async function summarizeStory(req: Request, res: Response, next: NextFunction) {
  try {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Transfer-Encoding', 'chunked')
    const id = Number(req.params.id)
    if (isNaN(id)) {
      throw new Error('invalid story id')
    }
    const stream = await hackerNewsService.summarizeArticle(id)
    for await (const event of stream) {
      if (event.type === 'response.output_text.delta') {
        res.write(`data: ${event.delta}\n\n`)
      }
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    res.status(400)
    next(error)
  }
}
