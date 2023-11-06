import { Routes } from '@generouted/react-router'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
if (!container) throw new Error('No root element')

createRoot(container).render(<Routes />)