import React, { useEffect } from 'react'
import { BrowserRouter, useNavigate, useRoutes } from 'react-router-dom'
import { App } from '../App'
import Admin from '../modules/Admin'
import Settings from '../modules/Settings'
import Task from '../modules/tasks'

export function Index() {
  return (
    <BrowserRouter>
      <RouterTree />
    </BrowserRouter>
  )
}

function RouterTree() {
  return useRoutes([
    {
      path: '/',
      element: <App />,
    },
    {
      path: 'tasks',
      element: <Task />,
    },
    {
      path: 'admin',
      element: <Admin />,
    },
    {
      path: 'settings',
      element: <Settings />,
    },
    {
      path: '*',
      element: <Redirect to="/" />,
    },
  ])
}

function Redirect({ to }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  })
  return null
}
