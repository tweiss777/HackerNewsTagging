import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { Article } from '@/pages/Article'
import { Stories } from '@/pages/Stories'
import { User } from '@/pages/User'
import {
  articleLoader,
  bestStoriesLoader,
  newStoriesLoader,
  topStoriesLoader,
  userLoader,
} from '@/loaders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/top" replace /> },
      { path: 'top', element: <Stories />, loader: topStoriesLoader },
      { path: 'new', element: <Stories />, loader: newStoriesLoader },
      { path: 'best', element: <Stories />, loader: bestStoriesLoader },
      { path: 'story/:id', element: <Article />, loader: articleLoader },
      { path: 'user', element: <User />, loader: userLoader },
    ],
  },
])
