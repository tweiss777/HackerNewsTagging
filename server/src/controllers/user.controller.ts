import type { Request, Response, NextFunction } from 'express'
import * as userService from '../services/user.service'
import type { TopicTag } from '@/types/StoryRecord'

export function getProfile(_req: Request, res: Response, next: NextFunction) {
  try {
    const profile = userService.getProfile()
    res.json(profile).end()
  } catch (error) {
    next(error)
  }
}

export function addInterest(req: Request, res: Response, next: NextFunction) {
  try {
    const { interest } = req.body as { interest: TopicTag }
    const profile = userService.addInterest(interest)
    res.json(profile).end()
  } catch (error) {
    next(error)
  }
}

export function removeInterest(req: Request, res: Response, next: NextFunction) {
  try {
    const { interest } = req.params as { interest: TopicTag }
    const profile = userService.removeInterest(interest)
    res.json(profile).end()
  } catch (error) {
    next(error)
  }
}

export function addBlockedTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { tag } = req.body as { tag: TopicTag }
    const profile = userService.addBlockedTag(tag)
    res.json(profile).end()
  } catch (error) {
    next(error)
  }
}

export function removeBlockedTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { tag } = req.params as { tag: TopicTag }
    const profile = userService.removeBlockedTag(tag)
    res.json(profile).end()
  } catch (error) {
    next(error)
  }
}
