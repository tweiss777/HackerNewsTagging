import 'dotenv/config'
import express, { type Request, type Response, type NextFunction } from 'express'
import { hackerNewsRouter } from './routes/hackernews.routes.js'
import { userRouter } from './routes/user.routes.js'
const app = express()
app.use(express.json())
const PORT = process.env.PORT ?? 3000

// Inject routers below
app.use('/api/hacker-news', hackerNewsRouter)
app.use('/api/user', userRouter)
// create an error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = res.statusCode ?? 500
  console.error(`Error handler called with status: ${status}, message: ${err.message}`)
  res.status(status).send(err.message).end()
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
