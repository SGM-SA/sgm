import { RootRoute, Router } from '@tanstack/router'

// Import all routes
import indexRoute from '@web/modules/home/HomePage'

/**
 * Root route
 */
export const rootRoute = new RootRoute()

/**
 * Route tree from all routes
 */
const routeTree = rootRoute.addChildren([
    indexRoute,
])

/**
 * Router instance
 */
export const router = new Router({ routeTree })

/**
 * For more typesafety 
 */
declare module '@tanstack/router' {
    interface Register {
        router: typeof router
    }
}