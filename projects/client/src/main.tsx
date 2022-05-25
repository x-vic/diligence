import React from 'react'
import { createRoot } from 'react-dom/client'
import { initObjectStores } from './db'
import './main.css'
import { Index } from './routes'

initObjectStores()

const root = createRoot(document.getElementById('root'))

root.render(<Index />)
