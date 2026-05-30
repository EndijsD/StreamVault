import { createBrowserRouter } from 'react-router'
import NotFound from '../pages/NotFound'
import Landing from '../pages/Landing'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
