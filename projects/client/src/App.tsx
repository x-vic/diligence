import React from 'react'
import { NavLink } from 'react-router-dom'

export const App: () => JSX.Element = () => (
  <div className="w-[100vw] h-[100vh]">
    <NavLink to="/task" className="">
      task
    </NavLink>{' '}
    | <NavLink to="/settings">settings</NavLink>
  </div>
)
