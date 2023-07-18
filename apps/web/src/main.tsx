import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from './router'
import { RouterProvider } from '@tanstack/router'

const container = document.getElementById('root')
if (!container) throw new Error('No root element')

createRoot(container).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)