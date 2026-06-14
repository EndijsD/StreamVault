import { createBrowserRouter } from 'react-router'
import NotFound from '../pages/NotFound'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Home from '../pages/Home'
import ProtectedRoute from '../components/ProtectedRoute'
import RedirectRoute from '../components/RedirectRoute'
import Register from '../pages/Register'
import Settings from '../pages/Settings'
import PublicLayout from '../components/PublicLayout'
import Library from '../pages/Library'
import RadioStations from '../pages/RadioStations'
import AudioFiles from '../pages/AudioFiles'
import PlaylistView from '../pages/PlaylistView'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        element: <RedirectRoute />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
        ],
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Home />,
        children: [
          {
            path: 'library',
            children: [
              { index: true, element: <Library /> },
              { path: 'folder/:id', element: <Library /> },
              { path: 'playlist/:id', element: <PlaylistView /> },
            ],
          },
          { path: 'radio', element: <RadioStations /> },
          { path: 'audio', element: <AudioFiles /> },
        ],
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
])
