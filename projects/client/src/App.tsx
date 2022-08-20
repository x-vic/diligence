import React from 'react'
import { NavLink } from 'react-router-dom'

export const App: () => JSX.Element = () => (
  <div className="flex flex-col flex-initial items-center">
    <NavLink
      to="/tasks"
      className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
    >
      tasks
    </NavLink>
    <NavLink
      to="/admin"
      className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
    >
      管理笔记
    </NavLink>
    <NavLink
      to="/settings"
      className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
    >
      settings
    </NavLink>
    <NavLink
      to="/calendar"
      className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
    >
      calendar
    </NavLink>
  </div>
)
