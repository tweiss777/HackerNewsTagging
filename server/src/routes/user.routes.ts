import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'

const userRouter = Router()

userRouter.get('/profile', userController.getProfile)
userRouter.post('/interests', userController.addInterest)
userRouter.delete('/interests/:interest', userController.removeInterest)
userRouter.post('/blocked-tags', userController.addBlockedTag)
userRouter.delete('/blocked-tags/:tag', userController.removeBlockedTag)

export { userRouter }
