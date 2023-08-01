import { Routes } from '@generouted/react-router'
import { OpenAPI } from '@sgm/openapi'
import { createRoot } from 'react-dom/client'
import { environment } from './core/environments'

OpenAPI.BASE = environment.apiBaseUrl

const container = document.getElementById('root')
if (!container) throw new Error('No root element')

createRoot(container).render(<Routes />)