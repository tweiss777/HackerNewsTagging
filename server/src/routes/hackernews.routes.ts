import { Router } from 'express'
import * as hackerNews from '../controllers/hackernews.controller.js'
const hackerNewsRouter = Router()

hackerNewsRouter.get('/:id/summarize', hackerNews.summarizeStory)
hackerNewsRouter.get('/:id/story', hackerNews.getStory)
hackerNewsRouter.get('/top-stories', hackerNews.getTopStories)
hackerNewsRouter.get('/new-stories', hackerNews.getNewStories)
hackerNewsRouter.get('/best-stories', hackerNews.getBestStories)

export { hackerNewsRouter }
