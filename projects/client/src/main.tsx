import React from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { Index } from './routes'

const root = createRoot(document.getElementById('root'))

root.render(<Index />)
